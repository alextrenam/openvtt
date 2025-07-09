import { useRef, useEffect, useState } from "react";

export default function RulerOverlay({ width, height, scaleFactor, rulerMode }) {
    const canvasRef = useRef(null);
    const [startPoint, setStartPoint] = useState(null);
    const [endPoint, setEndPoint] = useState(null);

    const drawLine = () => {
	const canvas = canvasRef.current;
	const ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, width, height);

	if (!startPoint || !endPoint) return;

	const dx = endPoint.x - startPoint.x;
	const dy = endPoint.y - startPoint.y;
	const distance = Math.sqrt(dx * dx + dy * dy);

	ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(startPoint.x, startPoint.y);
	ctx.lineTo(endPoint.x, endPoint.y);
	ctx.stroke();

	ctx.fillStyle = "white";
	ctx.font = "bold 16px sans-serif";
	ctx.fillText(`${Math.round(scaleFactor * distance)} ft`, endPoint.x + 10, endPoint.y - 10);
    };

    const handleMouseDown = (e) => {
	if (!rulerMode) return;
	const rect = canvasRef.current.getBoundingClientRect();
	setStartPoint({
	    x: e.clientX - rect.left,
	    y: e.clientY - rect.top,
	});
    };

    const handleMouseMove = (e) => {
	if (!rulerMode || !startPoint) return;
	const rect = canvasRef.current.getBoundingClientRect();
	setEndPoint({
	    x: e.clientX - rect.left,
	    y: e.clientY - rect.top,
	});
    };

    const handleMouseUp = () => {
	if (!rulerMode) return;
	// Optional: clear or freeze
	setStartPoint(null);
	setEndPoint(null);
    };

    useEffect(drawLine, [startPoint, endPoint, height, width, scaleFactor]);

    return (
	    <canvas
	ref={canvasRef}
	width={width}
	height={height}
	style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999,
            cursor: "crosshair",
            pointerEvents: rulerMode ? "auto" : "none",
	}}
	onMouseDown={handleMouseDown}
	onMouseMove={handleMouseMove}
	onMouseUp={handleMouseUp}
	    />
    );
}
