export default function ToolSelector({ activeTool, setActiveTool }) {
    const tools = [
	{ id: null, icon: "🖐️", label: "Move", key: "Esc" },
	{ id: "ruler", icon: "📏", label: "Ruler", key: "R" },
	{ id: "area", icon: "🔵", label: "Area", key: "A" },
	{ id: "fog", icon: "☁️", label: "Fog", key: "F" },
    ];

    const handleClick = (id) => {
	setActiveTool((prev) => (prev === id ? null : id));
    };

    return (
	    <div
	style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            zIndex: 1000,
            display: "flex",
            gap: "8px",
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: "6px 8px",
            borderRadius: "6px",
	}}
	    >
	    {tools.map((tool) => {
		const isActive = activeTool === tool.id;
		return (
			<button
		    key={tool.id ?? "default"}
		    onClick={() => handleClick(tool.id)}
		    title={`Press ${tool.key}`}
		    style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			width: "48px",
			height: "48px",
			fontSize: "20px",
			backgroundColor: isActive ? "#2ecc71" : "#444",
			color: "white",
			border: "none",
			borderRadius: "4px",
			opacity: isActive ? 1 : 0.75,
			cursor: "pointer",
		    }}
			>
			<span>{tool.icon}</span>
			<span style={{ fontSize: "10px" }}>{tool.key}</span>
			</button>
		);
	    })}
	</div>
    );
}
