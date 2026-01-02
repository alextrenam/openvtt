import { useState, useEffect, useCallback } from "react";
import MapLayer from "./MapLayer";
import FogCanvas from "./FogLayer";
import TokenLayer from "./TokenLayer";
import RulerOverlay from "./RulerOverlay";
import AreaOverlay from "./AreaOverlay";
import ToolSelector from "./ToolSelector";
import { doc, getDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useTokens } from "./useTokens";

export default function MapScene({ initialLevelId }) {
    const [levelId, setLevelId] = useState(initialLevelId);
    const [tokens, setTokens] = useTokens(levelId);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [mapScale, setMapScale] = useState(1);
    const [activeTool, setActiveTool] = useState(null);
    
    async function fetchMapScale(mapId) {
        try {
            const mapDocRef = doc(db, "levels", mapId, "map", "map");
            const mapSnap = await getDoc(mapDocRef);
            return mapSnap.exists() ? mapSnap.data().scale ?? 1 : 1;
        } catch (err) {
            console.error("Error fetching map scale:", err);
            return 1;
        }
    }

    // Load mapScale whenever levelId changes
    useEffect(() => {
        async function loadScale() {
            const scale = await fetchMapScale(levelId);
            setMapScale(scale);
        }
        loadScale();
    }, [levelId]);

    const aspectRatio = 4.245 / 3;
    const mapHeight = windowHeight;
    const mapWidth = mapHeight * aspectRatio;
    const baselineMapScale = 120;
    const scaleFactor = baselineMapScale / (mapHeight * mapScale);
    const tokenScale = 0.15 * Math.sqrt(mapScale) / scaleFactor;

    // Keep window height in sync with resize
    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Reset tokens to initial positions
    const resetLevel = useCallback(async () => {
        const tokenCollection = collection(db, "levels", levelId, "tokens");
        const snapshot = await getDocs(tokenCollection);
        snapshot.forEach((docSnap) => {
            const docId = docSnap.id;
            const token = docSnap.data();
            setDoc(doc(db, "levels", levelId, "tokens", docId), {
                ...token,
                x: token.init_x,
                y: token.init_y,
                locked: token.tokenType === "enemy",
            });
        });
    }, [levelId]);

    // Keybindings
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.toLowerCase() === "r") {
                setActiveTool((t) => (t === "ruler" ? null : "ruler"));
            } else if (e.key.toLowerCase() === "a") {
                setActiveTool((t) => (t === "area" ? null : "area"));
            } else if (e.key.toLowerCase() === "f") {
                setActiveTool((t) => (t === "fog" ? null : "fog"));
            } else if (e.key.toLowerCase() === "m") {
		if (activeTool !== "maps") {
		    setLevelId("caramrac");
		} else {
		    setLevelId("tulstoneKeepGroundFloor");
		}   
                setActiveTool((t) => (t === "maps" ? null : "maps"));
            } else if (e.key === "Escape") {
                setActiveTool(null);
            } else if (e.key.toLowerCase() === "l") {
                resetLevel();
	    } else if (activeTool === "maps") {
		if (e.key === "1") {
		    setLevelId("caramrac");
		} else if (e.key === "2") {
		    setLevelId("tulstone");
		}
	    } else if (e.key === "1") {
		setLevelId("tulstoneKeepGroundFloor");
	    } else if (e.key === "2") {
		setLevelId("tulstoneKeepFirstFloor");
	    } else if (e.key === "3") {
		setLevelId("tulstoneKeepSecondFloor");
	    } else if (e.key === "4") {
		setLevelId("tulstoneKeepThirdFloor");
	    }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [resetLevel, activeTool]);

    return (
            <MapLayer
	width={mapWidth}
	height={mapHeight}
	levelId={levelId}
	mapMode={activeTool === "maps"}
	    >
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
	mapMode={activeTool === "maps"}
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
