import React from "react";
import MapScene from "./MapScene";
import CharacterList from "./CharacterList";
import LevelLoader from "./LevelLoader";

function App() {
    return (
	<div className="app-container">
	    <div className="map-container">
		<MapScene levelId="testLevel"/>
	    </div>
	    <CharacterList/>
	    <LevelLoader/>
	</div>
    );
}

export default App;
