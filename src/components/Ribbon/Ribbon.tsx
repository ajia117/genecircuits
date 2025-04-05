import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Save, Trash, Graph, SettingsSlider } from "../../assets";
import "./Ribbon.css";
import { Node, Edge } from "@xyflow/react";
import { formatCircuitToJson } from "../../utils/formatCircuitToJson"
import { fetchOutput } from "../../utils/fetchOutput";
import CircuitSettingsType from "../../types/CircuitSettingsType";
import NodeData from "../../types/NodeData";
import useClickOutside from "../../utils/hooks/useClickOutside";


interface TopRibbonProps {
    labelDataMap: {[label: string]: NodeData},
    nodes: Node<NodeData>[],
    setNodes: (nodes: Node[]) => void,
    edges: Edge[],
    setEdges: (edges: Edge[]) => void,
    showOutputWindow: boolean,
    setShowOutputWindow: (show: boolean) => void,
    circuitSettings: CircuitSettingsType,
    setCircuitSettings: (settings: CircuitSettingsType) => void,
    setOutputData: (data: any)=>void
}

const TopRibbon: React.FC<TopRibbonProps> = ({ nodes, setNodes, edges, setEdges, showOutputWindow, setShowOutputWindow, circuitSettings, setCircuitSettings, setOutputData, labelDataMap }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isRunning, setIsRunning] = useState(false)
    const [showSettingsWindow, setShowSettingsWindow] = useState(false);
    const confirmationRef = useRef<HTMLDivElement>(null);
    useClickOutside(confirmationRef, () => setShowConfirmation(false));



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


    const handlePlayClick = async () => {
        nodes = updateNodesWithLabels();
        setNodes(nodes); // see above comment for why this is unnecessary, but can be improved
        
        const circuitJson = formatCircuitToJson(circuitSettings, nodes, edges);
        console.log(circuitJson)
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
                <button onClick={() => setShowSettingsWindow(prev => !prev)} className="circuitSettings-button">
                    <SettingsSlider />
                </button>
            </div>
            <div className="ribbon-right">
                <p>{circuitSettings.circuitName}</p>                
            </div>

            {showConfirmation && (
                <div className="ribbon-overlay">
                    <div className="confirmation-window" ref={confirmationRef}>
                        <button className="close-button" onClick={() => setShowSettingsWindow(false)}>×</button>
                        <h2>Are you sure you want to clear the screen?</h2>
                        <div className="confirmation-buttons">
                            <button onClick={confirmClear} className="confirm">Clear</button>
                            <button onClick={cancelClear} className="cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showSettingsWindow && (
                <div className="settings-popup-container">
                    <div className="settings-window">
                        <button className="close-button" onClick={cancelClear}>×</button>
                        <h2>Circuit Settings</h2>
                        <label>
                            Circuit Name:
                            <input
                                type="text"
                                value={circuitSettings.circuitName}
                                onChange={(e) =>
                                    setCircuitSettings({ ...circuitSettings, circuitName: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Simulation Duration:
                            <input
                                type="number"
                                value={circuitSettings.simulationDuration}
                                onChange={(e) =>
                                    setCircuitSettings({ ...circuitSettings, simulationDuration: parseInt(e.target.value) })
                                }
                            />
                        </label>
                        <label>
                            Number of Time Points:
                            <input
                                type="number"
                                value={circuitSettings.numTimePoints}
                                onChange={(e) =>
                                    setCircuitSettings({ ...circuitSettings, numTimePoints: parseInt(e.target.value) })
                                }
                            />
                        </label>
                        <div className="confirmation-buttons">
                            <button className="confirm" onClick={() => setShowSettingsWindow(false)}>Save</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default TopRibbon;

