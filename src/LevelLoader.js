import { useState, useEffect } from "react";
import characters from "./data/characters.json";

export default function LevelLoader() {
  const [level, setLevel] = useState(null);

  // Function to load a level JSON
  function loadLevel(levelUrl) {
    fetch(`${process.env.PUBLIC_URL}${levelUrl}`)
      .then((res) => res.json())
      .then((data) => setLevel(data))
      .catch(console.error);
  }

  // Listen for key press "1"
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "1") {
        loadLevel("/data/levels/test_level.json");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      {level && (
        <div className="map-container" style={{ position: "relative" }}>
          <img
            src={level.map.src}
            alt={level.name}
            style={{ width: "800px", height: "600px" }}
          />

          {level.tokens.map((token) => {
            const char = characters.find((c) => c.name === token.characterName);
            if (!char) return null;

            return (
              <img
                key={token.id}
                src={`${process.env.PUBLIC_URL}${char.imageUrl}`}
                alt={token.characterName}
                style={{
                  position: "absolute",
                  left: token.x,
                  top: token.y,
                  width: token.size * 50,
                  height: token.size * 50,
                  pointerEvents: "none" // so map interactions still work
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
