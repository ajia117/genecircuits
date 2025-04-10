import React, { useState, useEffect, useRef } from "react";
// import { Play, Pause, Save, Trash, Graph, SettingsSlider } from "../../assets";
import "./Ribbon.css";
import { Node, Edge } from "@xyflow/react";
import { formatCircuitToJson } from "../../utils/formatCircuitToJson"
import { fetchOutput, abortFetch } from "../../utils/fetchOutput";
import CircuitSettingsType from "../../types/CircuitSettingsType";
import NodeData from "../../types/NodeData";
import useClickOutside from "../../utils/hooks/useClickOutside";
import {
    Play,
    Pause,
    Save,
    Trash2,
    ChartArea,
    Settings,
    Download,
    FolderOpen,
    X,
    Dna,
} from "lucide-react";
import {
    Flex,
    Box,
    Text,
    TextField,
    IconButton,
    Button,
    Tooltip,
    Dialog,
} from "@radix-ui/themes";

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
        abortFetch()
        setIsRunning(false)
    }

    return (
        <div className="top-ribbon-container">
            <div className="ribbon-left">
                <Dna className="icon" />
                <h3 className="app-title">Genetic Circuits Builder</h3>
                {/* <button className="icon-button" title="Open/Import">
                    <FolderOpen className="icon" />
                </button>
                <button className="icon-button" title="Save">
                    <Save className="icon" />
                </button>
                <button className="icon-button" title="Export">
                    <Download className="icon" />
                </button> */}
                <Tooltip content="Open/Import">
                    <IconButton variant="outline" size="3" color="gray">
                    <FolderOpen />
                    </IconButton>
                </Tooltip>

                <Tooltip content="Save">
                    <IconButton variant="outline" size="3" color="gray">
                    <Save />
                    </IconButton>
                </Tooltip>

                <Tooltip content="Export">
                    <IconButton variant="outline" size="3" color="gray">
                    <Download />
                    </IconButton>
                </Tooltip>
            </div>
            <div className="ribbon-center">
                <input
                type="text"
                className="project-input"
                value={circuitSettings.projectName}
                onChange={(e: any) => setCircuitSettings({ ...circuitSettings, projectName: e.target.value })}
                />
            </div>
            <div className="ribbon-right">
                <Button
                    variant="solid"
                    size="3"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handlePlayClick}
                >
                    <Play className="h-4 w-4 mr-2" />
                    Run Simulation
                </Button>


                <Tooltip content={showOutputWindow ? "Close Output" : "Show Output"}>
                    <IconButton variant="outline" size="3" color="gray" onClick={() => setShowOutputWindow(!showOutputWindow)}>
                    {showOutputWindow ? <X /> : <ChartArea />}
                    </IconButton>
                </Tooltip>

                <Tooltip content="Clear Canvas">
                    <IconButton variant="outline" size="3" color="gray" onClick={handleClear}>
                    <Trash2 />
                    </IconButton>
                </Tooltip>

                <Tooltip content="Settings">
                    <IconButton variant="outline" size="3" color="gray" onClick={() => setShowSettingsWindow(!showSettingsWindow)}>
                    <Settings />
                    </IconButton>
                </Tooltip>

            </div>

            {/* CONFIRMATION WINDOW */}
            {showConfirmation && (
                <div className="ribbon-overlay">
                    <div className="confirmation-window" ref={confirmationRef}>
                        <button className="close-button" onClick={cancelClear}>×</button>
                        <h2>Are you sure you want to clear the screen?</h2>
                        <div className="confirmation-buttons">
                            <button onClick={confirmClear} className="confirm">Clear</button>
                            <button onClick={cancelClear} className="cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* SETTINGS WINDOW */}
            {showSettingsWindow && (
                <div className="settings-popup-container">
                    <div className="settings-window">
                        <button className="close-button" onClick={() => setShowSettingsWindow(false)}>×</button>
                        <h2>Circuit Settings</h2>
                        <label>
                            Project Name:
                            <input
                                type="text"
                                value={circuitSettings.projectName}
                                onChange={(e) =>
                                    setCircuitSettings({ ...circuitSettings, projectName: e.target.value })
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

