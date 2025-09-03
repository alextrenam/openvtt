import { useEffect, useRef, useState, useLayoutEffect, useCallback } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance

export default function FogCanvas({ width, height, fogEraseMode, levelId }) {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);

    const fogPath = `levels/${levelId}/fog/fog`; // Firestore document path
    const fogImageRef = useRef(null); // last fog image

    // Save current canvas to Firestore
    const saveFogToFirebase = async () => {
	const canvas = canvasRef.current;
	if (!canvas) return;
	const imageData = canvas.toDataURL("image/png");

	await setDoc(doc(db, fogPath), { image: imageData });
	fogImageRef.current = new Image();
	fogImageRef.current.src = imageData;
    };

    // Redraw current fog image onto canvas
    const redrawFog = useCallback(() => {
	const canvas = canvasRef.current;
	const img = fogImageRef.current;
	if (!canvas || !img) return;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }, []);

    // Load fog from Firestore on mount
    useEffect(() => {
	if (!levelId) return;
	const canvas = canvasRef.current;
	if (!canvas) return;
	const ctx = canvas.getContext("2d");

	const fogDocRef = doc(db, fogPath);
	const unsubscribe = onSnapshot(fogDocRef, (docSnap) => {
	    const data = docSnap.data();
	    if (data?.image) {
		const img = new Image();
		img.onload = () => {
		    ctx.clearRect(0, 0, canvas.width, canvas.height);
		    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		    fogImageRef.current = img; // store for redraw
		};
		img.src = data.image;
	    } else {
		// fallback: full fog
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	    }
	});

	return () => unsubscribe();
    }, [levelId, fogPath]);

    // Redraw when canvas mounts or re-mounts
    useLayoutEffect(() => {
	redrawFog();
    }, [redrawFog]);

    // Optional: redraw on window focus/visibility change
    useEffect(() => {
	const handleVisibility = () => {
	    if (document.visibilityState === "visible") redrawFog();
	};
	window.addEventListener("focus", redrawFog);
	document.addEventListener("visibilitychange", handleVisibility);
	return () => {
	    window.removeEventListener("focus", redrawFog);
	    document.removeEventListener("visibilitychange", handleVisibility);
	};
    }, [redrawFog]);

    // Optional: redraw on parent/container resize
    useEffect(() => {
	const canvas = canvasRef.current;
	if (!canvas || !canvas.parentElement) return;

	const observer = new ResizeObserver(() => {
	    redrawFog();
	});
	observer.observe(canvas.parentElement);
	return () => observer.disconnect();
    }, [redrawFog]);

    const eraseAt = (e) => {
	if (!fogEraseMode) return;
	const canvas = canvasRef.current;
	const ctx = canvas.getContext("2d");
	const rect = canvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	ctx.save();
	ctx.globalCompositeOperation = "destination-out";
	ctx.beginPath();
	ctx.arc(x, y, 30, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
    };

    const handleMouseDown = (e) => {
	if (!fogEraseMode) return;
	isDrawingRef.current = true;
	eraseAt(e);
    };

    const handleMouseMove = (e) => {
	if (!fogEraseMode || !isDrawingRef.current) return;
	eraseAt(e);
    };

    const handleMouseUp = () => {
	if (!fogEraseMode) return;
	isDrawingRef.current = false;
	saveFogToFirebase();
    };

    const resetFog = () => {
	const canvas = canvasRef.current;
	if (!canvas) return;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	saveFogToFirebase();
    };

    return (
	    <>
	    <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 10,
            pointerEvents: fogEraseMode ? "auto" : "none",
            cursor: fogEraseMode ? "crosshair" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
	    />
	    <button
        onClick={resetFog}
        style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 999,
            backgroundColor: "black",
            color: "white",
            padding: "4px 8px",
        }}
	    >
            Reset Fog
	</button>
	    </>
    );
}
