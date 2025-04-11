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
    AreaChart,
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
    Theme,
    DropdownMenu
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
    const [showClearConfirmation, setShowClearConfirmation] = useState(false);
    const [isRunning, setIsRunning] = useState(false)
    const [showSettingsWindow, setShowSettingsWindow] = useState(false);
    const confirmationRef = useRef<HTMLDivElement>(null);
    useClickOutside(confirmationRef, () => setShowClearConfirmation(false));



    const handleClear = () => {
        setShowClearConfirmation(true);
    };

    const confirmClear = () => {
        setNodes([])
        setEdges([])
        setShowClearConfirmation(false);
    };

    const cancelClear = () => {
        setShowClearConfirmation(false);
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
        <Theme>
        <Flex direction="row" align="center" justify="between" p="3" style={{ borderBottom: '1px solid #ccc' }}>
            {/* LEFT */}
            <Flex gap="3" align="center">
                <Dna color="var(--accent-9)" />
                <Text weight="bold" size="3">
                    Genetic Circuits Builder
                </Text>

                <Flex gap="2" align="center">
                <Tooltip content="Open File">
                    <IconButton variant="outline" size="3" color="gray">
                    <FolderOpen />
                    </IconButton>
                </Tooltip>

                <Tooltip content="Save">
                    <IconButton variant="outline" size="3" color="gray">
                    <Save />
                    </IconButton>
                </Tooltip>

                {/* <Tooltip content="Export">
                    <IconButton variant="outline" size="3" color="gray">
                    <Download />
                    </IconButton>
                </Tooltip> */}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                    <IconButton variant="outline" size="3" color="gray">
                        <Download />
                    </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                        <DropdownMenu.Item>Export as PNG</DropdownMenu.Item>
                        <DropdownMenu.Item>Export as JPEG</DropdownMenu.Item>
                        <DropdownMenu.Item>Export as SVG</DropdownMenu.Item>
                        <DropdownMenu.Item>Export as JSON</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                </Flex>
            </Flex>

            <Box maxWidth="300px" flexGrow="1" mx="4">  
                <input
                    type="text"
                    className="project-input"
                    value={circuitSettings.projectName}
                    onChange={(e: any) => setCircuitSettings({ ...circuitSettings, projectName: e.target.value })}
                />
            </Box>

            <Flex gap="2" align="center">
                <Button variant="solid" size="3" onClick={handlePlayClick} disabled={isRunning}>
                    <Play /> Run Simulation
                </Button>

                <Tooltip content={showOutputWindow ? "Close Output" : "Show Output"}>
                    <IconButton variant="outline" size="3" color="gray" onClick={() => setShowOutputWindow(!showOutputWindow)}>
                    {showOutputWindow ? <X /> : <AreaChart />}
                    </IconButton>
                </Tooltip>

                <Tooltip content="Clear Canvas">
                    <IconButton variant="outline" size="3" color="gray" onClick={() => setShowClearConfirmation(true)}>
                    <Trash2 />
                    </IconButton>
                </Tooltip>

                <Tooltip content="Settings">
                    <IconButton variant="outline" size="3" color="gray" onClick={() => setShowSettingsWindow(!showSettingsWindow)}>
                    <Settings />
                    </IconButton>
                </Tooltip>
            </Flex>
        </Flex>
        {/* <div className="top-ribbon-container"> */}
            

            {/* </div> */}

            {/* CLEAR CONFIRMATION WINDOW */}
            <Dialog.Root open={showClearConfirmation} onOpenChange={setShowClearConfirmation}>
                <Dialog.Content maxWidth="500px">
                <Dialog.Title>Are you sure you want to clear the screen?</Dialog.Title>
                <Dialog.Description mb="4">
                    This action cannot be undone. All unsaved changes will be lost.
                </Dialog.Description>

                <Flex justify="center" gap="3" mt="3">
                    <Dialog.Close>
                        <Button color="red" onClick={confirmClear}>Clear</Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button variant="soft" color="gray" onClick={cancelClear}>Cancel</Button>
                    </Dialog.Close>
                </Flex>
                </Dialog.Content>
            </Dialog.Root>


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


        </Theme>
    );
};

export default TopRibbon;

