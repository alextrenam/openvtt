import React, { useState, useRef, useEffect } from "react";

export default function DraggableToken({ id, x, y, iconUrl, onDragEnd, tokenType }) {
    const [position, setPosition] = useState({ x, y });
    const positionRef = useRef({ x, y });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    // Sync position state when props change (important for live updates)
    useEffect(() => {
	if (!dragging.current) {
	    setPosition({ x, y });
	}
    }, [x, y]);

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

    function handlePointerUp(e) {
	dragging.current = false;
	window.removeEventListener("pointermove", handlePointerMove);
	window.removeEventListener("pointerup", handlePointerUp);
	
	const { x, y } = positionRef.current;
	onDragEnd(id, x, y); // update Firebase
    }

    const borderColours = {
	player: "dodgerblue",
	enemy: "crimson",
	neutral: "gray",
	ally: "limegreen",
    };

    return (
	<img
	    src={iconUrl}
	    alt={id}
	    onPointerDown={handlePointerDown}
	    style={{
		position: "absolute",
		zIndex: 20,
		left: position.x,
		top: position.y,
		width: 48,
		height: 48,
		borderRadius: "50%",
		overflow: "hidden",
		border: `4px solid ${borderColours[tokenType] || "black"}`,
		boxSizing: "border-box",
		backgroundColor: "white",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		cursor: dragging.current ? "grabbing" : "grab",
		userSelect: "none",
	    }}
	/>
    );
}
