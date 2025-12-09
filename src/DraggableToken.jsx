import React, { useState, useRef, useEffect } from "react";

export default function DraggableToken({
    id,
    u,
    v,
    mapWidth,
    mapHeight,
    iconUrl,
    onDragEnd,
    tokenType,
    tokenSize,
    label,
    scaleFactor,
    locked, // NEW: comes from Firestore
    onToggleLock, // NEW: callback to toggle lock in parent/Firestore
}) {
    function relToPx(u, v) {
        return { x: u * mapWidth, y: v * mapHeight };
    }

    function pxToRel(x, y) {
        return { u: x / mapWidth, v: y / mapHeight };
    }

    const initialPx = relToPx(u, v);
    const [position, setPosition] = useState(initialPx);
    const positionRef = useRef(initialPx);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const [currentUrl, setCurrentUrl] = useState(iconUrl);
    
    useEffect(() => {
        setCurrentUrl(iconUrl);
    }, [iconUrl]);
    
    // Update position if props change and not dragging
    useEffect(() => {
        if (!dragging.current) {
            const x = u * mapWidth;
            const y = v * mapHeight;
            setPosition({ x, y });
            positionRef.current = { x, y };
        }
    }, [u, v, mapWidth, mapHeight]);

    function handlePointerDown(e) {
        e.preventDefault();

        if (e.button === 2) {
            // right click = toggle lock
            onToggleLock(id, !locked);
            return;
        }

        if (locked) return; // don’t drag if locked

        dragging.current = true;
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    }

    function handlePointerMove(e) {
        e.preventDefault();
        if (!dragging.current) return;
        const newX = e.clientX - offset.current.x;
        const newY = e.clientY - offset.current.y;
        setPosition({ x: newX, y: newY });
        positionRef.current = { x: newX, y: newY };
    }

    function handlePointerUp() {
        if (!dragging.current) return;
        dragging.current = false;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);

        const { x, y } = positionRef.current;
        const { u: newU, v: newV } = pxToRel(x, y);
        onDragEnd(id, newU, newV);
    }

    const borderColours = {
        player: "dodgerblue",
        enemy: "crimson",
        neutral: "gray",
        ally: "limegreen",
    };

    const tokenSizes = {
        tiny: 30,
        small: 40,
        normal: 48,
        large: 58,
        huge: 80,
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            onContextMenu={(e) => e.preventDefault()} // disable browser menu
            style={{
                position: "absolute",
                zIndex: tokenType === "enemy" ? 5 : 20,
                left: position.x,
                top: position.y,
                width: tokenSizes[tokenSize] * scaleFactor,
                textAlign: "center",
                cursor: locked
                    ? "default"
                    : dragging.current
                    ? "grabbing"
                    : "grab",
                userSelect: "none",
                transform: "translate(-50%, -50%)",
                opacity: locked ? 0.7 : 1, // optional visual cue
            }}
        >
            <img
                src={iconUrl}
                alt={id}
		onError={() => {
		    const fallback = `/assets/missing.png`;
		    console.log(fallback);
		    if (currentUrl !== fallback) {
			setCurrentUrl(fallback);
		    }
		}}
                style={{
                    width: tokenSizes[tokenSize] * scaleFactor,
                    height: tokenSizes[tokenSize] * scaleFactor,
                    borderRadius: "50%",
                    border: `4px solid ${borderColours[tokenType] || "black"}`,
                    backgroundColor: "white",
                    boxSizing: "border-box",
                    display: "block",
                }}
            />
            <div
                style={{
                    marginTop: 4,
                    fontSize: 12,
                    color: "white",
                    textShadow: "1px 1px 2px black",
                }}
            >
                {label || id}
            </div>
        </div>
    );
}
