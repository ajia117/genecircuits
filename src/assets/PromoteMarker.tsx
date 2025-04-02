const PromoteMarker = () => {
    return (
        <svg width="0" height="0" style={{position: "absolute", top: 0, left: 0, width: 0, height: 0}}>
            <defs>
                <marker
                    id="promote"
                    viewBox="0 0 10 20" // minX minY width height
                    refX="12"
                    refY="9"
                    markerWidth="10"
                    markerHeight="10"
                    orient="auto" // orient end perpendicular to the edge
                >
                    <path d="M1 0.5L11 9L1 17.5" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </marker>
            </defs>
        </svg>
    );
};

export default PromoteMarker;