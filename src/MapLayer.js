export default function MapLayer({ width, height, children }) {
    return (
	    <div
	style={{
            position: "relative",
	    margin: "0 auto", // centers horizontally
            width,
            height,
            backgroundImage: `url(${process.env.PUBLIC_URL}/assets/map.jpg)`,
            backgroundSize: "cover",
            border: "4px solid black",
            overflow: "hidden",
	}}
	    >
	    {children}
	</div>
    );
}
