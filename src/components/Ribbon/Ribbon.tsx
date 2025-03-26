import React, { useState } from "react";
import { Play, Pause, Save, Trash, Graph } from "../../assets";
import "./Ribbon.css";
import { Node, Edge } from "@xyflow/react";
import { formatCircuitToJson } from "../../utils/formatCircuitToJson"

interface TopRibbonProps {
    nodes: Node[],
    setNodes: any,
    edges: Edge[],
    setEdges: any,
    showOutputWindow: boolean,
    setShowOutputWindow: any,
}

const TopRibbon: React.FC<TopRibbonProps> = ({ nodes, setNodes, edges, setEdges, showOutputWindow, setShowOutputWindow }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const handleClear = () => {
        setShowConfirmation(true);
    };

    const confirmClear = () => {
        setNodes([])
        setEdges([])
        setShowConfirmation(false);
    };

    const cancelClear = () => {
        setShowConfirmation(false);
    };

    const handlePlayClick = () => {
        const circuitJson = formatCircuitToJson(nodes, edges)
        console.log(edges)
        console.log(circuitJson)
        setShowOutputWindow(true)
    }

    return (
        <div className="top-ribbon-container">
            <div className="ribbon-left">
                <button onClick={null} className="save-button">
                    <Save />
                </button>
                <button onClick={handleClear} className="clear-button">
                    <Trash />
                </button>
            </div>
            <div className="ribbon-center">
                <button onClick={handlePlayClick} className="play-button">
                    <Play />
                </button>
                <button onClick={null} className="pause-button">
                    <Pause />
                </button>
            </div>
            <div className="ribbon-right">
                <button onClick={() => setShowOutputWindow(!showOutputWindow)} className="toggle-output-button">
                    <Graph />
                </button>
            </div>

            {showConfirmation && (
                <div className="ribbon-overlay">
                    <div className="confirmation-window">
                        <h2>Are you sure you want to clear the screen?</h2>
                        <div className="confirmation-buttons">
                            <button onClick={confirmClear} className="confirm">Clear</button>
                            <button onClick={cancelClear} className="cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopRibbon;

