import React, { useState, useRef, useEffect } from "react";

export default function DraggableToken({
    id,
    u, // relative horizontal position (0..1)
    v, // relative vertical position (0..1)
    mapWidth,
    mapHeight,
    iconUrl,
    onDragEnd, // called with (id, newU, newV)
    tokenType,
    label,
}) {
    // Convert relative (u,v) to pixel coords
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

    // Update local position if props change and not dragging
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
        dragging.current = false;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);

        const { x, y } = positionRef.current;
        const { u: newU, v: newV } = pxToRel(x, y);
        onDragEnd(id, newU, newV); // update Firebase with relative coords
    }

    const borderColours = {
        player: "dodgerblue",
        enemy: "crimson",
        neutral: "gray",
        ally: "limegreen",
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            style={{
                position: "absolute",
                zIndex: 20,
                left: position.x,
                top: position.y,
                width: 48,
                textAlign: "center",
                cursor: dragging.current ? "grabbing" : "grab",
                userSelect: "none",
                transform: "translate(-50%, -50%)", // center on coordinates
            }}
        >
            <img
                src={iconUrl}
                alt={id}
                style={{
                    width: 48,
                    height: 48,
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
