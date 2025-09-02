const characters = [
  {
    name: "Banowain",
    description: "An aging man with a surprising fighting prowess",
    imageUrl: `${process.env.PUBLIC_URL}/assets/banowain.png`
  },
  {
    name: "Goldborn Thimble",
    description: "Innkeeper at the Bellevue Inn in River Bend",
    imageUrl: `${process.env.PUBLIC_URL}/assets/goldborn.png`
  },
  {
    name: "Hugh Jassolini",
    description: "Just a huge ass dude",
    imageUrl: `${process.env.PUBLIC_URL}/assets/hugh.png`
  },
  {
    name: "Chungus Alpha-Strike",
    description: "Something about those eyes seems shady...",
    imageUrl: `${process.env.PUBLIC_URL}/assets/chungus.jpg`
  },
  {
    name: "Tritus Basilcoch",
    description: "Has been known to get a little sautéed on the booze",
    imageUrl: `${process.env.PUBLIC_URL}/assets/tritus.png`
  }
];

export default function CharacterList() {
  return (
    <div className="sidebar">
      <h2>Known Characters</h2>
      {characters.map((char, index) => (
        <div className="character-row" key={index}>
          <img src={char.imageUrl} alt={char.name} className="character-img" />
          <div className="character-text">
            <strong>{char.name}</strong>
            <div>{char.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
