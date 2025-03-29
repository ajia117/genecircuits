import React, { useState } from "react";
import { Play, Pause, Save, Trash, Graph } from "../../assets";
import "./Ribbon.css";
import { Node, Edge } from "@xyflow/react";
import { formatCircuitToJson } from "../../utils/formatCircuitToJson"
import { fetchOutput } from "../../utils/fetchOutput";

interface TopRibbonProps {
    nodes: Node[],
    setNodes: any,
    edges: Edge[],
    setEdges: any,
    showOutputWindow: boolean,
    setShowOutputWindow: any,
    circuitSettings: any,
    setOutputData: (data: any)=>void
}

const TopRibbon: React.FC<TopRibbonProps> = ({ nodes, setNodes, edges, setEdges, showOutputWindow, setShowOutputWindow, circuitSettings, setOutputData }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isRunning, setIsRunning] = useState(false)

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


    const handlePlayClick = async () => {
        const circuitJson = formatCircuitToJson(circuitSettings, nodes, edges);
        setIsRunning(true);
        try {
            const res = await fetchOutput(circuitJson);
            setOutputData(res);
            setShowOutputWindow(true);
        } catch (error) {
            console.error("Error fetching output:", error);
        } finally {
            setIsRunning(false);
        }
    };

    const handlePauseClick = () => {
        setIsRunning(false)
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
                <button onClick={() => setShowOutputWindow(!showOutputWindow)} className="toggle-output-button">
                    <Graph />
                </button>
            </div>
            <div className="ribbon-center">
                <button onClick={handlePlayClick} className="play-button">
                    <Play />
                </button>
                <button onClick={handlePauseClick} className="pause-button">
                    <Pause />
                </button>
            </div>
            <div className="ribbon-right">
                
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

