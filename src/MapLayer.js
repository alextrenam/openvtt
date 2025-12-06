import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function MapLayer({ width, height, levelId, mapMode, children }) {
    const [mapSrc, setMapSrc] = useState(null);

    useEffect(() => {
	if (!levelId) return;

	const fetchMap = async () => {
	    try {
		const mapDocRef = doc(db, "levels", levelId, "map", "map");
		const mapDocSnap = await getDoc(mapDocRef);
		if (mapDocSnap.exists()) {
		    const data = mapDocSnap.data();
		    setMapSrc(data.url); // assumes the Firestore doc has a field 'url'
		} else {
		    console.warn("No map found for level:", levelId);
		}
	    } catch (err) {
		console.error("Error fetching map:", err);
	    }
	};

	fetchMap();
    }, [levelId]);

    return (
	    <div
	style={{
            position: "relative",
            margin: "0 auto",
            width,
            height,
            backgroundImage: mapSrc ? `url(${process.env.PUBLIC_URL}/${mapSrc})` : undefined,
            backgroundSize: "contain",
	    backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            border: "4px solid black",
            overflow: "hidden",
	}}
	    >
	    {children}
	</div>
    );
}
