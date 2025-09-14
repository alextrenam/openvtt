import { useState, useEffect, useRef } from "react";

export default function AreaOverlay({ width, height, scaleFactor, areaMode }) {
    const [center, setCenter] = useState(null);
    const [radius, setRadius] = useState(0);
    const [mousePos, setMousePos] = useState(null);
    const isDraggingRef = useRef(false);

    const canvasRef = useRef(null);

    const getDistance = (x1, y1, x2, y2) =>
	  Math.hypot(x2 - x1, y2 - y1);

    useEffect(() => {
	const drawCircle = () => {
	    const canvas = canvasRef.current;
	    if (!canvas) return;
	    const ctx = canvas.getContext("2d");
	    ctx.clearRect(0, 0, width, height);

	    if (!center || radius === 0) return;

	    ctx.beginPath();
	    ctx.strokeStyle = "rgba(0, 200, 0, 0.7)";
	    ctx.lineWidth = 2;
	    ctx.fillStyle = "rgba(0, 200, 0, 0.2)";
	    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
	    ctx.fill();
	    ctx.stroke();

	    if (mousePos) {
		ctx.fillStyle = "white";
		ctx.font = "bold 16px sans-serif";
		ctx.shadowColor = "rgba(0,0,0,0.7)";
		ctx.shadowBlur = 4;
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.fillText(
		    `${Math.round(scaleFactor * radius)} ft`,
		    mousePos.x + 10,
		    mousePos.y - 10
		);
		ctx.shadowColor = "transparent";
		ctx.shadowBlur = 0;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
	    }
	};

	drawCircle();
    }, [center, radius, mousePos, scaleFactor, width, height]);

    const onMouseDown = (e) => {
	if (!areaMode) return;
	isDraggingRef.current = true;

	const rect = e.currentTarget.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	setCenter({ x, y });
	setRadius(0);
    };

    const onMouseMove = (e) => {
	if (!areaMode || !isDraggingRef.current) return;
	const rect = e.currentTarget.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	const r = getDistance(center.x, center.y, x, y);
	setRadius(r);
	setMousePos({ x, y });
    };

    const onMouseUp = () => {
	if (!areaMode) return;
	isDraggingRef.current = false;

	// Clear the circle and radius text
	setCenter(null);
	setRadius(0);
	setMousePos(null);
    };

    return (
	    <canvas
	ref={canvasRef}
	width={width}
	height={height}
	style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: areaMode ? "auto" : "none",
            cursor: areaMode ? "crosshair" : "default",
            zIndex: 999,
	}}
	onMouseDown={onMouseDown}
	onMouseMove={onMouseMove}
	onMouseUp={onMouseUp}
	onMouseLeave={onMouseUp}
	    />
     );
}
