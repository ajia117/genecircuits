const RepressMarker = () => {
    return (
        <svg width="0" height="0" style={{position: "absolute", top: 0, left: 0, width: 0, height: 0}}>
            <defs>
                <marker
                    id="repress"
                    viewBox="0 0 10 20" // minX minY width height
                    refX="10"
                    refY="10"
                    markerWidth="10"
                    markerHeight="10"
                    orient="auto" // orient end perpendicular to the edge
                >
                    <line x1="8" y1="0" x2="8" y2="40" stroke="black" strokeWidth="2.5" strokeLinecap="round" />
                </marker>
            </defs>
        </svg>
    );
};

export default RepressMarker;
