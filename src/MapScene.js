import { useState, useEffect } from "react";
import { useTokens } from "./useTokens";
import MapLayer from "./MapLayer";
import FogCanvas from "./FogLayer";
import TokenLayer from "./TokenLayer";
import RulerOverlay from "./RulerOverlay";
import AreaOverlay from "./AreaOverlay";
import ToolSelector from "./ToolSelector";

export default function MapScene() {
    useEffect(() => {
	document.title = "Bellevue Inn - OpenVTT";
    }, []);

    const [tokens, setTokens] = useTokens();
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    const scaleFactor = 0.1;
    
    // Dynamically resize map
    useEffect(() => {
	const handleResize = () => {
	    setWindowHeight(window.innerHeight);
	};
	window.addEventListener("resize", handleResize);
	return () => window.removeEventListener("resize", handleResize);
    }, []);

    const aspectRatio = 4 / 3;
    const mapHeight = windowHeight;
    const mapWidth = mapHeight * aspectRatio;

    // Toggle between modes: ruler, fog, null
    const [activeTool, setActiveTool] = useState(null);

    useEffect(() => {
	const handleKeyDown = (e) => {
	    if (e.key === 'r' || e.key === 'R') {
		setActiveTool((tool) => (tool === 'ruler' ? null : 'ruler'));
	    }
	    else if (e.key === "a" || e.key === "A") {
		setActiveTool((tool) => (tool === "area" ? null : "area"));
	    }
	    else if (e.key === 'f' || e.key === 'F') {
		setActiveTool((tool) => (tool === 'fog' ? null : 'fog'));
	    }
	    else if (e.key === 'Escape') {
		setActiveTool(null);
	    }
	};
	window.addEventListener('keydown', handleKeyDown);
	return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
	    <MapLayer width={mapWidth} height={mapHeight}>
	    <FogCanvas width={mapWidth} height={mapHeight} fogEraseMode={activeTool === "fog"} />
	    <TokenLayer tokens={tokens} setTokens={setTokens} />
	    <RulerOverlay width={mapWidth} height={mapHeight} scaleFactor={scaleFactor} rulerMode={activeTool === "ruler"} />
	    <AreaOverlay width={mapWidth} height={mapHeight} scaleFactor={scaleFactor} areaMode={activeTool === 'area'} />
	    <ToolSelector activeTool={activeTool} setActiveTool={setActiveTool} />
	    </MapLayer>
    );
}
