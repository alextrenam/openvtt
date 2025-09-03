import characters from "./data/characters.json";

export default function CharacterList() {
  return (
    <div className="sidebar">
      <h2>Known Characters</h2>
      {characters.map((char, index) => (
        <div className="character-row" key={index}>
          <img src={`${process.env.PUBLIC_URL}${char.imageUrl}`} alt={char.name} className="character-img" />
          <div className="character-text">
            <strong>{char.name}</strong>
            <div>{char.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
