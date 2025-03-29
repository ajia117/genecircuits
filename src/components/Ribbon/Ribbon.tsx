import React, { useState } from "react";
import { Play, Pause, Save, Trash, Graph } from "../../assets";
import "./Ribbon.css";
import { Node, Edge } from "@xyflow/react";
import { formatCircuitToJson } from "../../utils/formatCircuitToJson"
import CircuitSettingsType from "../../types/CircuitSettingsType";
import NodeData from "../../types/NodeData";

interface TopRibbonProps {
    labelDataMap: {[label: string]: NodeData},
    nodes: Node<NodeData>[],
    setNodes: (nodes: Node[]) => void,
    edges: Edge[],
    setEdges: (edges: Edge[]) => void,
    showOutputWindow: boolean,
    setShowOutputWindow: (show: boolean) => void,
    circuitSettings: CircuitSettingsType
}

const TopRibbon: React.FC<TopRibbonProps> = ({ labelDataMap, nodes, setNodes, edges, setEdges, showOutputWindow, setShowOutputWindow, circuitSettings }) => {
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

    // make sure all nodes we send back are updated with regards to label
    // currently, this is inefficient, and runs on every node each time we hit play
    // in future, add new boolean field in NodeData to check if it has changed since last run through
    const updateNodesWithLabels = () => {
        return nodes.map((node) => {
            return {
                ...node,
                data: labelDataMap[node.data.label]
            }
        });
    }

    const handlePlayClick = () => {
        nodes = updateNodesWithLabels();
        setNodes(nodes); // see above comment for why this is unnecessary, but can be improved
        const circuitJson = formatCircuitToJson(circuitSettings, nodes, edges)
        setShowOutputWindow(true);
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

