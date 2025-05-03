import {
    Dialog,
    Flex,
    Box,
    Text,
    Button,
    ScrollArea,
} from "@radix-ui/themes";
import {
    Upload,
    Import,
    FolderOpen,
    AlertCircle,
    X
} from "lucide-react";
import React, { useState } from "react";
import { validateProjectJson } from "../utils";
import { useAlert } from "../components/Alerts/AlertProvider";

interface ImportWindowProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ImportWindow({ open, onOpenChange }: ImportWindowProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showImportUI, setShowImportUI] = useState(false);
    const { showAlert } = useAlert();

    const savedProjects: any[] = []; // Replace with actual saved data

    const handleCircuitImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
            const result = JSON.parse(event.target?.result as string);
            const errorMessage = validateProjectJson(result);
            if (errorMessage) {
                showAlert(errorMessage);
                return;
            }
        
            const { circuitSettings, nodes, edges, proteins, hillCoefficients } = result;
            window.dispatchEvent(
                new CustomEvent("circuitImport", {
                detail: { circuitSettings, nodes, edges, proteins, hillCoefficients }
                })
            );
            setSelectedFile(null);
            } catch (err) {
            console.error("Error parsing file:", err);
            showAlert("Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);
    };

    const handleSelectImport = () => {
        if (selectedFile) processFile(selectedFile);
        setShowImportUI(false);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content maxWidth="800px" style={{ padding: "2em" }}>
                <Flex direction="column" mb="6">
                    <Dialog.Title>File Manager</Dialog.Title>
                    <Dialog.Description>
                        Open an existing project or import one (.json file) from your local computer.
                    </Dialog.Description>
                </Flex>

                <Flex direction="row" justify="between">
                    <Text size="4" weight="bold">Recent Projects</Text>
                    <Button
                        variant="ghost"
                        size="3" mr="2"
                        color={showImportUI ? "red" : undefined}
                        onClick={() => {
                            setShowImportUI(!showImportUI);
                            setSelectedFile(null);
                        }}
                    >
                        {!showImportUI ? (
                            <>
                                <FolderOpen size={20} />
                                <Text size="3" weight="medium">Browse Files</Text>
                            </>
                        ) : (
                            <>
                                <X size={20} color="red" />
                                <Text size="3" weight="medium" color="red">Cancel</Text>
                            </>
                        )}
                    </Button>
                </Flex>

                <Flex
                    direction={showImportUI ? "row" : "column"}
                    gap="4"
                    align={showImportUI ? "start" : "center"}
                    style={{ width: "100%" }}
                >
                    {/* Recent Projects */}
                    <Flex direction="column" gap="3" justify="start" style={showImportUI ? { flex: 1 } : { width: "100%" }} >
                        <Box // Recent Projects box border
                            p="3"
                            style={{
                                color: "var(--gray-a9)",
                                padding: "100px 32px",
                                textAlign: "center",
                                border: "1px solid var(--gray-a6)",
                                borderRadius: "12px",
                                marginTop: "16px",
                                fontSize: "13px",
                                width: "100%",
                            }}
                        >

                        {savedProjects.length === 0 ? (
                            <Flex direction="column" align="center" gap="3">
                                <AlertCircle size={32} color="hsl(240, 5%, 60%)" />
                                <Text size="3" weight="medium" color="gray">No saved projects found</Text>
                                <Text size="2" color="gray">
                                    Create a new project or import a circuit to get started.
                                </Text>
                            </Flex>
                        ) : (
                            <ScrollArea>
                                {/* TODO: Project list */}
                            </ScrollArea>
                        )}
                        </Box>
                    </Flex>


                    {/* Import UI */}
                    {showImportUI && (
                        <Flex direction="column" gap="4" style={{ flex: 1 }}>
                            <Box
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                style={{
                                    border: dragActive
                                        ? "dashed 1px hsl(160, 100%, 36%)"
                                        : "dashed 1px hsl(240, 5%, 80%)",
                                    borderRadius: "12px",
                                    padding: "80px 24px",
                                    marginTop: "16px",
                                    transition: "all 0.2s ease",
                                    backgroundColor: dragActive
                                        ? "hsla(160, 100%, 36%, 0.05)"
                                        : "hsl(240, 5%, 98%)"
                                }}
                            >
                                <Flex direction="column" align="center" justify="center" gap="3">
                                    <Box
                                        style={{
                                            backgroundColor: "hsl(240, 5%, 96%)",
                                            borderRadius: "50%",
                                            padding: "12px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <Upload width="24px" height="24px" color={selectedFile ? "hsl(160, 100%, 36%)" : "hsl(240, 5%, 60%)"} />
                                    </Box>

                                    {selectedFile ? (
                                        <Flex direction="column" align="center" gap="1">
                                            <Text size="3" weight="medium" color="green">
                                                {selectedFile.name}
                                            </Text>
                                            <Text size="1" color="gray">
                                                {selectedFile.size > 100000
                                                    ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                                                    : `${(selectedFile.size / 1024).toFixed(2)} KB`}
                                            </Text>
                                        </Flex>
                                    ) : (
                                        <Flex direction="column" align="center" gap="1">
                                            <Flex align="center" gap="1">
                                                <label
                                                    htmlFor="file-upload"
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "var(--accent-9)",
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    Choose file
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        accept=".json"
                                                        onChange={handleCircuitImport}
                                                        style={{ display: "none" }}
                                                    />
                                                </label>
                                                <Text size="2" color="gray">or drag and drop</Text>
                                            </Flex>
                                            <Text size="1" color="gray">Supports .json files up to 10MB</Text>
                                        </Flex>
                                    )}
                                </Flex>
                            </Box>

                            <Flex justify="end" mb="2">
                                <Dialog.Close>
                                    <Button
                                        variant="solid" size="3"
                                        disabled={!selectedFile}
                                        style={{
                                            backgroundColor: selectedFile ? "var(--accent-9)" : "hsl(240, 5%, 90%)",
                                            color: selectedFile ? "white" : "hsl(240, 5%, 60%)",
                                            transition: "all 0.2s ease"
                                        }}
                                        onClick={handleSelectImport}
                                    >
                                        <Import size={16} />
                                        Import Circuit
                                    </Button>
                                </Dialog.Close>
                            </Flex>


                        </Flex>
                    )}
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}

