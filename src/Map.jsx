import React from "react";
import { ref, set } from "firebase/database";
import { database } from "./firebase";
import { useTokens } from "./useTokens";
import DraggableToken from "./DraggableToken";

export default function Map() {
    const [tokens, setTokens] = useTokens();

    // Update token position in Firebase
    function updateTokenPosition(id, x, y) {
	set(ref(database, `tokens/${id}`), {
	    ...tokens[id],  // preserve other token data
	    x,
	    y,
	});
    }

    return (
	<div
	    style={{
		position: "relative",
		width: 800,
		height: 600,
		backgroundImage: `url('/assets/map.jpg')`,
		backgroundSize: "cover",
		border: "2px solid black",
	    }}
	>
	    {Object.entries(tokens).map(([id, token]) => (
		<DraggableToken
		    key={id}
		    id={id}
		    x={token.x}
		    y={token.y}
		    iconUrl={token.iconUrl}
		    onDragEnd={updateTokenPosition}
		/>
	    ))}
	</div>
    );
}
