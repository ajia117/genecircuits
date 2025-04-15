import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
// import { Play, Pause, Save, Trash, Graph, SettingsSlider } from "../../assets";
import "./Ribbon.css";
import { Node, Edge } from "@xyflow/react";
import { fetchOutput, abortFetch, formatBackendJson, formatCircuitExportJson } from "../../utils"
import CircuitSettingsType from "../../types/CircuitSettingsType";
import NodeData from "../../types/NodeData";
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
    DropdownMenu,
    Slider
} from "@radix-ui/themes";
import ImportWindow from "../ImportWindow";

interface TopRibbonProps {
    proteins: { [label: string]: NodeData };
    setProteins: Dispatch<SetStateAction<{ [label: string]: NodeData }>>;
    nodes: Node<NodeData>[];
    setNodes: Dispatch<SetStateAction<Node<NodeData>[]>>;
    edges: Edge[];
    setEdges: Dispatch<SetStateAction<Edge[]>>;
    showOutputWindow: boolean;
    setShowOutputWindow: (show: boolean) => void;
    circuitSettings: CircuitSettingsType;
    setCircuitSettings: Dispatch<SetStateAction<CircuitSettingsType>>;
    setOutputData: (data: any) => void;
}


const TopRibbon: React.FC<TopRibbonProps> = ({ nodes, setNodes, edges, setEdges, showOutputWindow, setShowOutputWindow, circuitSettings, setCircuitSettings, setOutputData, proteins, setProteins }) => {
    const [showClearConfirmation, setShowClearConfirmation] = useState(false); // keep track of whether clear confirmation window is open or not
    const [isRunning, setIsRunning] = useState(false) // flag to track if simulation is running or not
    const [showSettingsWindow, setShowSettingsWindow] = useState(false); // keep track of whether settings window is open or not
    const [showImportWindow, setShowImportWindow] = useState(false); // keep track of whether import window is open or not

    // listen for a circuit import
    // useEffect(() => {
    //     const handleImportedCircuit = (event: CustomEvent) => {
    //         const { circuitSettings: importedSettings, nodes: importedNodes, edges: importedEdges, proteins: importedProteins } = event.detail;
        
    //         // Merge circuit settings (replace name, keep other values if already set)
    //         setCircuitSettings(prev => ({
    //             projectName: importedSettings.projectName ?? prev.projectName,
    //             simulationDuration: importedSettings.simulationDuration ?? prev.simulationDuration,
    //             numTimePoints: importedSettings.numTimePoints ?? prev.numTimePoints,
    //         }));
        
    //         //TODO: update so nodes and edges get re IDed if things are already existing in circuit
    //         // Merge nodes
    //         setNodes(prevNodes => [
    //             ...prevNodes,
    //             ...(importedNodes ?? []),
    //         ]);
        
    //         // Merge edges
    //         setEdges(prevEdges => [
    //             ...prevEdges,
    //             ...(importedEdges ?? []),
    //         ]);
        
    //         // Merge proteins
    //         setProteins(prevProteins => ({
    //             ...prevProteins,
    //             ...(importedProteins ?? {})
    //         }));
    //     };
      
    //     window.addEventListener("circuitImport", handleImportedCircuit as EventListener);
    //     return () => {
    //       window.removeEventListener("circuitImport", handleImportedCircuit as EventListener);
    //     };
    // }, []);
      

    const confirmClear = () => {
        setNodes([])
        setEdges([])
        setShowClearConfirmation(false);
    };

    // make sure all nodes we send back are updated with regards to label
    // currently, this is inefficient, and runs on every node each time we hit play
    // in future, add new boolean field in NodeData to check if it has changed since last run through
    // const updateNodesWithProteinData = () => {
    //     return nodes.map((node) => {
    //         const label = node.data?.label;
    //         const sharedData = label && proteins[label];
    //         return {
    //             ...node,
    //             data: {
    //                 ...sharedData,
    //                 label, // ensure label is preserved
    //             }
    //         };
    //     });
    // };
    


    const handlePlayClick = async () => {
        // nodes = updateNodesWithProteinData();
        // setNodes(nodes); // see above comment for why this is unnecessary, but can be improved
        
        const circuitJson = formatBackendJson(circuitSettings, nodes, edges, proteins);
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

    const handleExport = (e: React.MouseEvent<HTMLDivElement>, type: string) => {
        e.preventDefault();
        if(nodes.length === 0 && edges.length === 0) { alert("Nothing to export."); return; }
        if(type === "json") {
            // const updatedNodes = updateNodesWithProteinData();
            const circuitJson = formatCircuitExportJson(circuitSettings, nodes, edges, proteins);
            const blob = new Blob([JSON.stringify(circuitJson, null, 2)], {
                type: "application/json",
            });
    
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${circuitSettings.projectName || "circuit"}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
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
                        <IconButton variant="outline" size="3" color="gray" onClick={() => setShowImportWindow(true)}>
                        <FolderOpen />
                        </IconButton>
                    </Tooltip>

                    <Tooltip content="Save">
                        <IconButton variant="outline" size="3" color="gray">
                        <Save />
                        </IconButton>
                    </Tooltip>

                    <DropdownMenu.Root>
                        <Tooltip content="Export Circuit">
                            <DropdownMenu.Trigger>
                            <IconButton variant="outline" size="3" color="gray">
                                <Download />
                            </IconButton>
                            </DropdownMenu.Trigger>
                        </Tooltip>
                        <DropdownMenu.Content align="end">
                            <DropdownMenu.Item onClick={(e) => handleExport(e, 'png')}>Export as PNG</DropdownMenu.Item>
                            <DropdownMenu.Item onClick={(e) => handleExport(e, 'jpeg')}>Export as JPEG</DropdownMenu.Item>
                            <DropdownMenu.Item onClick={(e) => handleExport(e, 'json')}>Export as JSON</DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    </Flex>
                </Flex>

                {/* PROJECT NAME FIELD */}
                <Box maxWidth="400px" flexGrow="1" mx="4">  
                    <TextField.Root size="2" variant="surface" style={{textAlign: "center"}}
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
            

            {/* IMPORT WINDOW */}
            <ImportWindow open={showImportWindow} onOpenChange={setShowImportWindow} />

            {/* CLEAR CONFIRMATION WINDOW */}
            <Dialog.Root open={showClearConfirmation} onOpenChange={setShowClearConfirmation}>
                <Dialog.Content maxWidth="500px">
                    <Flex justify="between">
                        <Dialog.Title mt="1">Are you sure you want to clear the screen?</Dialog.Title>
                        <Dialog.Close><IconButton variant="ghost" color="gray"><X /></IconButton></Dialog.Close>
                    </Flex>
                <Dialog.Description mb="4">
                    This action cannot be undone. All unsaved changes will be lost.
                </Dialog.Description>

                <Flex justify="center" gap="3" mt="3">
                    <Dialog.Close>
                        <Button color="red" size="3" onClick={confirmClear}>Clear</Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button variant="soft" color="gray" size="3" onClick={() => setShowClearConfirmation(false)}>Cancel</Button>
                    </Dialog.Close>
                </Flex>
                </Dialog.Content>
            </Dialog.Root>


            {/* SETTINGS WINDOW */}
            <Dialog.Root open={showSettingsWindow} onOpenChange={setShowSettingsWindow}>
                <Dialog.Content maxWidth="400px">
                    <Flex justify="between">
                        <Dialog.Title mt="1">Circuit Settings</Dialog.Title>
                        <Dialog.Close><IconButton variant="ghost" color="gray"><X /></IconButton></Dialog.Close>
                    </Flex>
                    <Dialog.Description mb="3">Make changes to your project settings.</Dialog.Description>
                
                    <Flex direction="column" gap="3" mt="4">
                        <Text as="div" weight="bold">Project Name</Text>
                        <TextField.Root
                            placeholder="Enter your full name"
                            mb="2"
                            value={circuitSettings.projectName ?? ""}
                            onChange={(e) => setCircuitSettings({ ...circuitSettings, projectName: e.target.value })}
                        />
                        
                        {/* simulation duration */}
                        <Text as="div" weight="bold">Simulation Duration (seconds)</Text>
                        <Flex gap="3" align="center">
                            <Slider
                                id="simulation-duration"
                                min={1}
                                max={120}
                                step={1}
                                value={[circuitSettings.simulationDuration ?? 10]}
                                onValueChange={(value) => setCircuitSettings({ ...circuitSettings, simulationDuration: value[0] })}
                                className="flex-1"
                            />
                            <TextField.Root
                                type="number"
                                value={circuitSettings.simulationDuration ?? 10}
                                onChange={(e) => setCircuitSettings({ ...circuitSettings, simulationDuration: parseInt(e.target.value) })}
                                className="w-20"
                            />
                        </Flex>

                        {/* num time points */}
                        <Text as="div" weight="bold">Number of Time Points</Text>
                        <Flex gap="3" align="center">
                            <Slider
                                id="time-points"
                                min={1}
                                max={100}
                                step={1}
                                value={[circuitSettings.numTimePoints ?? 10]}
                                onValueChange={(value) => setCircuitSettings({ ...circuitSettings, numTimePoints: value[0] })}
                                className="flex-1"
                            />
                            <TextField.Root
                                type="number"
                                value={circuitSettings.numTimePoints ?? 10}
                                onChange={(e) => setCircuitSettings({ ...circuitSettings, numTimePoints: parseInt(e.target.value) })}
                                className="w-20"
                            />
                        </Flex>
                    </Flex>
                
                    <Flex justify="end" mt="5"><Dialog.Close><Button size="3">Close</Button></Dialog.Close></Flex>
                </Dialog.Content>
            </Dialog.Root>
            

        </Theme>
    );
};

export default TopRibbon;

