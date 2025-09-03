import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase"; // Firestore instance
import DraggableToken from "./DraggableToken";

export default function TokenLayer({ tokens, setTokens, mapWidth, mapHeight, levelId }) {
    // Update token position in Firestore
    async function updateTokenPosition(id, x, y) {
	console.log("levelId:", levelId, "id:", id);
	const tokenData = tokens[id];
	if (!tokenData) return;

	await setDoc(doc(db, "levels", levelId, "tokens", id), {
	    ...tokenData,
	    x,
	    y,
	});
    }

    return (
	    <>
	    {Object.entries(tokens).map(([id, token]) => (
		    <DraggableToken
		key={id}
		id={id}
		label={token.label}
		u={token.x}
		v={token.y}
		mapWidth={mapWidth}
		mapHeight={mapHeight}
		iconUrl={`${process.env.PUBLIC_URL}/${token.iconUrl}`}
		onDragEnd={updateTokenPosition}
		tokenType={token.tokenType}
		    />
	    ))}
	</>
    );
}
