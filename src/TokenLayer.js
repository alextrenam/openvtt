import { ref, set } from "firebase/database";
import { database } from "./firebase";
import DraggableToken from "./DraggableToken";

export default function TokenLayer({ tokens, setTokens, mapWidth, mapHeight }) {
    function updateTokenPosition(id, x, y) {
	set(ref(database, `tokens/${id}`), {
	    ...tokens[id],
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
