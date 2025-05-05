import React, { useState } from "react";
import { useCircuitContext, useHillCoefficientContext, useWindowStateContext } from '../../hooks';
import { fetchOutput, formatBackendJson, formatCircuitExportJson, abortFetch } from "../../utils"
import { saveCircuitAsImage } from "./SaveImage"; // Import our new function
import {
    Play,
    Save,
    Trash2,
    Settings,
    Download,
    FolderOpen,
    X,
    Dna,
    AreaChart,
    Grid3X3
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
    Slider,
    AlertDialog
} from "@radix-ui/themes";
import { ImportWindow } from "../../components";
import { useAlert } from "../Alerts/AlertProvider";
import { ProjectDataType } from "../../types";

const TopRibbon: React.FC = () => {
    const {
        nodes, setNodes, edges, setEdges, proteins
    } = useCircuitContext();
    const {
        hillCoefficients
    } = useHillCoefficientContext();
    const {
        showOutputWindow, setShowOutputWindow,
        circuitSettings, setCircuitSettings,
        setOutputData,
        showHillCoeffMatrix, setShowHillCoeffMatrix
    } = useWindowStateContext();
    const { showAlert } = useAlert();

    const [showClearConfirmation, setShowClearConfirmation] = useState(false); // Track whether clear confirmation window is open or not
    const [isRunning, setIsRunning] = useState(false) // Track if simulation is running or not
    const [showSettingsWindow, setShowSettingsWindow] = useState(false); // Track whether settings window is open or not
    const [showImportWindow, setShowImportWindow] = useState(false); // Track whether import window is open or not
    const [open, setOpen] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    // Handler called when user confirms clearing the screen
    const confirmClear = () => {
        setNodes([])
        setEdges([])
        setShowClearConfirmation(false);
    };

    // Handler for when user clicks the run simulation button
    const handlePlayClick = async () => {
        if (isRunning) {
            // Abort the running simulation
            abortFetch();
            if (timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }
            setIsRunning(false);
            return;
        }
        const circuitJson = formatBackendJson(circuitSettings, nodes, edges, proteins, hillCoefficients);
        setIsRunning(true);
        // Set a timeout (e.g., 30 seconds)
        const tId = setTimeout(() => {
            abortFetch();
            setIsRunning(false);
        }, 30000);
        setTimeoutId(tId);
        try {
            const res = await fetchOutput(circuitJson);
            if ('type' in res && res.type === 'image') {
                setOutputData(res);
            } else {
                setOutputData(null);
            }
            setShowOutputWindow(true);
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("Fetch aborted");
            } else {
                console.error("Error fetching output:", error);
            }
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
                setTimeoutId(null);
            }
            setIsRunning(false);
        }
    };

    // Exports the circuit displayed on the screen
    const handleExport = async (e: React.MouseEvent<HTMLDivElement>, type: string) => {
        e.preventDefault();
        setOpen(false);
        if(nodes.length === 0 && edges.length === 0) {
            showAlert("Nothing to export.");
            return;
        }

        try {
            await saveCircuitAsImage(type as 'png' | 'jpeg', circuitSettings);
        } catch (error) {
            console.error("Export error:", error);
            showAlert(error instanceof Error ? error.message : 'Failed to export image.');
        }
    }

    const handleSaveProject = () => {
        if(nodes.length === 0 && edges.length === 0) { alert("Nothing to save."); return; }
        const circuitJson: ProjectDataType = formatCircuitExportJson(circuitSettings, nodes, edges, proteins, hillCoefficients);
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

    return (
        <Theme>
            <Flex direction="row" align="center" justify="between" p="3" style={{ borderBottom: '1px solid #ccc' }}>
                {/* LEFT */}
                <Flex gap="3" align="center">
                    <Dna color="var(--accent-9)" />
                    <Text weight="bold" size="3">
                        Genetic Circuits Simulator
                    </Text>

                    <Flex gap="2" align="center">
                        <Tooltip content="Open File">
                            <IconButton variant="outline" size="3" color="gray" onClick={() => setShowImportWindow(true)}>
                                <FolderOpen size={20} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip content="Save Project">
                            <IconButton variant="outline" size="3" color="gray" onClick={() => {handleSaveProject()}}>
                                <Save size={20} />
                            </IconButton>
                        </Tooltip>

                        <DropdownMenu.Root open={open} onOpenChange={setOpen}>
                            <Tooltip content="Export Circuit">
                                <DropdownMenu.Trigger>
                                    <IconButton variant="outline" size="3" color="gray">
                                        <Download size={20} />
                                    </IconButton>
                                </DropdownMenu.Trigger>
                            </Tooltip>
                            <DropdownMenu.Content align="end">
                                <DropdownMenu.Item onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleExport(e, 'png')}>Export as PNG</DropdownMenu.Item>
                                <DropdownMenu.Item onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleExport(e, 'jpeg')}>Export as JPEG</DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                </Flex>

                {/* PROJECT NAME FIELD */}
                <Box maxWidth="400px" flexGrow="1" mx="4">
                    <TextField.Root size="2" variant="surface" style={{textAlign: "center"}}
                                    value={circuitSettings.projectName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCircuitSettings({ ...circuitSettings, projectName: e.target.value })}
                    />
                </Box>

                <Flex gap="2" align="center">
                    <Tooltip content="Hill Coefficient Matrix">
                        <IconButton variant="outline" size="3" color="gray" onClick={() => setShowHillCoeffMatrix(!showHillCoeffMatrix)}>
                            <Grid3X3 size={20} />
                        </IconButton>
                    </Tooltip>

                    <Button
                        variant="solid"
                        size="3"
                        onClick={handlePlayClick}
                        disabled={false}
                        style={isRunning ? { backgroundColor: '#e74c3c', borderColor: '#e74c3c' } : {}}
                    >
                        {isRunning ? (<><X size={20} /> Stop</>) : (<><Play size={20} /> Run Simulation</>)}
                    </Button>

                    <Tooltip content={showOutputWindow ? "Close Output" : "Show Output"}>
                        <IconButton variant="outline" size="3" color="gray" onClick={() => setShowOutputWindow(!showOutputWindow)}>
                            {showOutputWindow ? <X size={20} /> : <AreaChart size={20} />}
                        </IconButton>
                    </Tooltip>

                    <Tooltip content="Clear Canvas">
                        <IconButton variant="outline" size="3" color="gray" onClick={() => setShowClearConfirmation(true)}>
                            <Trash2 size={20} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip content="Settings">
                        <IconButton variant="outline" size="3" color="gray" onClick={() => setShowSettingsWindow(!showSettingsWindow)}>
                            <Settings size={20} />
                        </IconButton>
                    </Tooltip>
                </Flex>
            </Flex>


            {/* IMPORT WINDOW */}
            <ImportWindow open={showImportWindow} onOpenChange={setShowImportWindow} />

            {/* CLEAR CONFIRMATION WINDOW */}
            <AlertDialog.Root open={showClearConfirmation} onOpenChange={setShowClearConfirmation}>
                <AlertDialog.Content maxWidth="500px">
                    <Flex direction="column" align="center" justify="center" my="2">
                        <AlertDialog.Title mt="1">Are you sure you want to clear the screen?</AlertDialog.Title>
                        <AlertDialog.Description mb="4">
                            This action cannot be undone. All unsaved changes will be lost.
                        </AlertDialog.Description>

                        <Flex direction="row" justify="center" gap="3" mt="3">
                            <AlertDialog.Action>
                                <Button color="red" size="3" onClick={confirmClear}>Clear</Button>
                            </AlertDialog.Action>
                            <AlertDialog.Cancel>
                                <Button variant="soft" color="gray" size="3" onClick={() => setShowClearConfirmation(false)}>Cancel</Button>
                            </AlertDialog.Cancel>
                        </Flex>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>


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