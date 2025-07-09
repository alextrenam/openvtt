import { ref, set } from "firebase/database";
import { database } from "./firebase";
import DraggableToken from "./DraggableToken";

export default function TokenLayer({ tokens, setTokens }) {
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
		x={token.x}
		y={token.y}
		iconUrl={`${process.env.PUBLIC_URL}/${token.iconUrl}`}
		onDragEnd={updateTokenPosition}
		tokenType={token.tokenType}
		    />
	    ))}
	</>
    );
}
