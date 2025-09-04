import { useState, useEffect } from "react";
import MapLayer from "./MapLayer";
import FogCanvas from "./FogLayer";
import TokenLayer from "./TokenLayer";
import RulerOverlay from "./RulerOverlay";
import AreaOverlay from "./AreaOverlay";
import ToolSelector from "./ToolSelector";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useTokens } from "./useTokens";

export default function MapScene({ levelId }) {
    const [tokens, setTokens] = useTokens(levelId);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [mapScale, setMapScale] = useState(1); // <- store scale here
    const [activeTool, setActiveTool] = useState(null);

    async function fetchMapScale(mapId) {
        try {
            const mapDocRef = doc(db, "levels", mapId, "map", "map");
            const mapSnap = await getDoc(mapDocRef);
            if (mapSnap.exists()) {
                return mapSnap.data().scale ?? 1;
            } else {
                console.warn("Map document not found:", mapId);
                return 1;
            }
        } catch (err) {
            console.error("Error fetching map scale:", err);
            return 1;
        }
    }

    // Load mapScale on mount
    useEffect(() => {
        async function loadScale() {
            const scale = await fetchMapScale(levelId);
            setMapScale(scale);
        }
        loadScale();
    }, [levelId]);

    const aspectRatio = 4 / 3;
    const mapHeight = windowHeight;
    const mapWidth = mapHeight * aspectRatio;
    const baselineMapScale = 120;

    const scaleFactor = baselineMapScale / (mapHeight * mapScale);
    const tokenScale = 0.15 * Math.sqrt(mapScale) / scaleFactor;

    // Resize map dynamically
    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Reset all tokens to initial positions
    const resetLevel = async () => {
        const tokenCollection = collection(db, "levels", levelId, "tokens");
        const snapshot = await getDocs(tokenCollection);
        snapshot.forEach((docSnap) => {
            const docId = docSnap.id;
            const token = docSnap.data();
            setDoc(doc(db, "levels", levelId, "tokens", docId), {
                ...token,
                x: token.init_x,
                y: token.init_y,
		locked: token.tokenType === "enemy" ? true : false,
            });
        });
    };

    // Keybindings
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === "r") setActiveTool((t) => (t === "ruler" ? null : "ruler"));
            else if (e.key.toLowerCase() === "a") setActiveTool((t) => (t === "area" ? null : "area"));
            else if (e.key.toLowerCase() === "f") setActiveTool((t) => (t === "fog" ? null : "fog"));
            else if (e.key === "Escape") setActiveTool(null);
            else if (e.key.toLowerCase() === "l") resetLevel();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [levelId]);

    return (
        <MapLayer width={mapWidth} height={mapHeight} levelId={levelId}>
            <FogCanvas
                width={mapWidth}
                height={mapHeight}
                fogEraseMode={activeTool === "fog"}
                levelId={levelId}
            />
            <TokenLayer
                tokens={tokens}
                setTokens={setTokens}
                mapWidth={mapWidth}
                mapHeight={mapHeight}
                levelId={levelId}
                scaleFactor={tokenScale}
            />
            <RulerOverlay
                width={mapWidth}
                height={mapHeight}
                scaleFactor={scaleFactor}
                rulerMode={activeTool === "ruler"}
            />
            <AreaOverlay
                width={mapWidth}
                height={mapHeight}
                scaleFactor={scaleFactor}
                areaMode={activeTool === "area"}
            />
            <ToolSelector activeTool={activeTool} setActiveTool={setActiveTool} />
        </MapLayer>
    );
}

// import { useState, useEffect } from "react";
// import MapLayer from "./MapLayer";
// import FogCanvas from "./FogLayer";
// import TokenLayer from "./TokenLayer";
// import RulerOverlay from "./RulerOverlay";
// import AreaOverlay from "./AreaOverlay";
// import ToolSelector from "./ToolSelector";
// import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase"; // your Firestore setup
// import { useTokens } from "./useTokens";

// export default function MapScene({ levelId }) {
//     const [tokens, setTokens] = useTokens(levelId);
//     const [windowHeight, setWindowHeight] = useState(window.innerHeight);
//     const [activeTool, setActiveTool] = useState(null);

//     async function fetchMapScale(mapId) {
// 	try {
//             const mapDocRef = doc(db, "levels", levelId, "map", "map");
//             const mapSnap = await getDoc(mapDocRef);

//             if (mapSnap.exists()) {
// 		const mapData = mapSnap.data();
// 		return mapData.scale; // e.g., a number like 1.5
//             } else {
// 		console.warn("Map document not found:", mapId);
// 		return 1; // default scale
//             }
// 	} catch (err) {
//             console.error("Error fetching map scale:", err);
//             return 1; // fallback
// 	}
//     }
    
    
//     const aspectRatio = 4 / 3;
//     const mapHeight = windowHeight;
//     const mapWidth = mapHeight * aspectRatio;
//     const baselineMapScale = 120;
//     const mapScale = await fetchMapScale(levelId);
//     console.log(mapScale);
//     const scaleFactor = mapScale * baselineMapScale / mapHeight;
//     const tokenScale = 10 * scaleFactor;

//     // Resize map dynamically
//     useEffect(() => {
// 	const handleResize = () => setWindowHeight(window.innerHeight);
// 	window.addEventListener("resize", handleResize);
// 	return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     // Reset all tokens to initial positions
//     const resetLevel = async () => {
// 	const tokenCollection = collection(db, "levels", levelId, "tokens");
// 	const snapshot = await getDocs(tokenCollection);

// 	snapshot.forEach((docSnap) => {
// 	    const docId = docSnap.id;
// 	    const token = docSnap.data();
// 	    setDoc(doc(db, "levels", levelId, "tokens", docId), {
// 		...token,
// 		x: token.init_x,
// 		y: token.init_y,
// 	    });
// 	});
//     };

//     // Keybindings: tools + reset level
//     useEffect(() => {
// 	const handleKeyDown = (e) => {
// 	    if (e.key === "r" || e.key === "R") setActiveTool((t) => (t === "ruler" ? null : "ruler"));
// 	    else if (e.key === "a" || e.key === "A") setActiveTool((t) => (t === "area" ? null : "area"));
// 	    else if (e.key === "f" || e.key === "F") setActiveTool((t) => (t === "fog" ? null : "fog"));
// 	    else if (e.key === "Escape") setActiveTool(null);
// 	    else if (e.key === "L" || e.key === "l") resetLevel(); // <--- Reset level
// 	};
// 	window.addEventListener("keydown", handleKeyDown);
// 	return () => window.removeEventListener("keydown", handleKeyDown);
//     }, [levelId]);

//     return (
// 	    <MapLayer width={mapWidth} height={mapHeight} levelId={levelId}>
// 	    <FogCanvas width={mapWidth} height={mapHeight} fogEraseMode={activeTool === "fog"}  levelId={levelId}/>
// 	    <TokenLayer tokens={tokens} setTokens={setTokens} mapWidth={mapWidth} mapHeight={mapHeight} levelId={levelId} scaleFactor={tokenScale}/>
// 	    <RulerOverlay width={mapWidth} height={mapHeight} scaleFactor={scaleFactor} rulerMode={activeTool === "ruler"} />
// 	    <AreaOverlay width={mapWidth} height={mapHeight} scaleFactor={scaleFactor} areaMode={activeTool === "area"} />
// 	    <ToolSelector activeTool={activeTool} setActiveTool={setActiveTool} />
// 	    </MapLayer>
//     );
// }
