import { useEffect, useRef } from "react";
import { ref, set, onValue } from "firebase/database";
import { database } from "./firebase";

export default function FogCanvas({ width, height, fogEraseMode }) {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);

    const fogPath = "fog/map1"; // You can make this dynamic

    // 🖼️ Save current canvas as image
    const saveFogToFirebase = () => {
	const canvas = canvasRef.current;
	const imageData = canvas.toDataURL("image/png");
	set(ref(database, fogPath), { image: imageData });
    };

    // 🧠 Load image from Firebase and draw
    useEffect(() => {
	const canvas = canvasRef.current;
	const ctx = canvas.getContext("2d");

	const fogRef = ref(database, fogPath);
	onValue(fogRef, (snapshot) => {
	    const data = snapshot.val();
	    if (data && data.image) {
		const img = new Image();
		img.onload = () => {
		    ctx.clearRect(0, 0, canvas.width, canvas.height);
		    ctx.drawImage(img, 0, 0);
		};
		img.src = data.image;
	    } else {
		// fallback — fully covered fog
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	    }
	});
    }, []);

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
	saveFogToFirebase(); // 💾 Push to Firebase
    };

    function resetFog() {
	const canvas = canvasRef.current;
	if (!canvas) return;
	const ctx = canvas.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	saveFogToFirebase(); // ✅ sync reset with Firebase
    }

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
