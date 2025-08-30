import React from "react";
import MapScene from "./MapScene";
import CharacterList from "./CharacterList";

function App() {
    return (
	<div className="app-container">
	    <div className="map-container">
		<MapScene />
	    </div>
	    <CharacterList/>
	</div>
    );
}

export default App;
