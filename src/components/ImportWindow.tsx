import {
    Dialog,
    Flex,
    Tabs,
    Box,
    Text,
    Button,
    Card,
} from "@radix-ui/themes";
import {
    Upload,
    Import,
    FolderOpen,
    FileJson,
    AlertCircle
} from "lucide-react";
import React, { useState } from "react";

interface ImportWindowProps {
    open: boolean
    onOpenChange: (open: boolean) => void,
}

export default function ImportWindow({ open, onOpenChange }: ImportWindowProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const savedProjects = [
        // TODO: store
    ];

    const handleSelectImport = () => {
        processFile(selectedFile);
    }

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

                const { circuitSettings, nodes, edges, proteins } = result;

                // TODO: import validation: make sure files have valid nodes, edges, and protein data. no corrupt files
                // if (!circuitSettings || !Array.isArray(nodes) || !Array.isArray(edges) || !Array.isArray(proteins)) {
                //   alert("Invalid circuit file format.");
                //   return;
                // }

                // Send parsed values to the global handler
                window.dispatchEvent(
                    new CustomEvent("circuitImport", {
                        detail: { circuitSettings, nodes, edges, proteins },
                    })
                );


            } catch (err) {
                console.error("Error parsing file:", err);
                alert("Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedFile(file);
            processFile(file);
        }
    };

    return(
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content maxWidth="800px">
                <Flex direction="column" mb="4">
                    <Dialog.Title>File Manager</Dialog.Title>
                    <Dialog.Description>Open existing projects and import circuits.</Dialog.Description>
                </Flex>

                <Tabs.Root defaultValue="open">
                    <Tabs.List justify="center"
                               style={{
                                   display: 'flex',
                                   justifyContent: 'center',
                                   backgroundColor: 'hsl(240, 5%, 96%)',
                                   borderRadius: '8px',
                                   padding: '6px',
                                   gap: '6px'
                               }}
                    >
                        <Tabs.Trigger value="open"
                                      style={{
                                          padding: '8px 16px',
                                          borderRadius: '6px',
                                          fontWeight: '500',
                                          backgroundColor: 'transparent',
                                          color: 'hsl(240, 5%, 40%)',
                                          transition: 'all 0.2s ease-in-out'
                                      }}
                        >
                            <Flex gap="2" align="center">
                                <FolderOpen size={16} />
                                Open Project
                            </Flex>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="import">
                            <Flex gap="2" align="center">
                                <FileJson size={16} />
                                Import Circuit
                            </Flex>
                        </Tabs.Trigger>
                    </Tabs.List>

                    {/* START TABS CONTENT */}
                    <Box pt="3">
                        {/* OPEN PROJECT */}
                        <Tabs.Content value="open">
                            {savedProjects.length === 0 ? (
                                <Card style={{
                                    padding: "32px",
                                    backgroundColor: "hsl(240, 5%, 96%)",
                                    textAlign: "center",
                                    borderRadius: "8px",
                                    marginTop: "16px"
                                }}>
                                    <Flex direction="column" align="center" gap="3">
                                        <AlertCircle size={32} color="hsl(240, 5%, 60%)" />
                                        <Text size="3" weight="medium" color="gray">No saved projects found</Text>
                                        <Text size="2" color="gray">
                                            Create a new project or import a circuit to get started.
                                        </Text>
                                    </Flex>
                                </Card>
                            ) : (
                                <Box>
                                    {/* TODO: Project list here */}
                                </Box>
                            )}
                        </Tabs.Content>

                        {/* IMPORT CIRCUIT */}
                        <Tabs.Content value="import">
                            <Box
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                style={{
                                    border: dragActive ? "dashed 2px hsl(160, 100%, 36%)" : "dashed 2px hsl(240, 5%, 80%)",
                                    borderRadius: "12px",
                                    padding: "32px 24px",
                                    marginTop: "16px",
                                    marginBottom: "24px",
                                    transition: "all 0.2s ease",
                                    backgroundColor: dragActive ? "hsla(160, 100%, 36%, 0.05)" : "hsl(240, 5%, 98%)"
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
                                        <Upload color={selectedFile ? "hsl(160, 100%, 36%)" : "hsl(240, 5%, 60%)"} width="24px" height="24px" />
                                    </Box>

                                    {selectedFile ? (
                                        <Flex direction="column" align="center" gap="1">
                                            <Text size="3" weight="medium" color="green">
                                                {selectedFile.name}
                                            </Text>
                                            <Text size="1" color="gray">
                                                {selectedFile.size > 100000 ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` :
                                                                              `${(selectedFile.size / 1024).toFixed(2)} KB`}
                                            </Text>
                                        </Flex>
                                    ) : (
                                        <Flex direction="column" align="center" gap="1">
                                            <Flex align="center" gap="1">
                                                <label
                                                    htmlFor="file-upload"
                                                    style={{
                                                        cursor: "pointer",
                                                        color: "hsl(160, 100%, 36%)",
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
                                                <Text size="2" color="gray">
                                                    or drag and drop
                                                </Text>
                                            </Flex>
                                            <Text size="1" color="gray">Supports .json files up to 10MB</Text>
                                        </Flex>
                                    )}
                                </Flex>
                            </Box>

                            {/* import button */}
                            <Flex justify="end" mb="2">
                                <Dialog.Close>
                                    <Button
                                        variant="solid"
                                        size="3"
                                        disabled={!selectedFile}
                                        style={{
                                            backgroundColor: selectedFile ? "hsl(160, 100%, 36%)" : "hsl(240, 5%, 90%)",
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
                        </Tabs.Content>
                    </Box>
                </Tabs.Root>
            </Dialog.Content>
        </Dialog.Root>
    )
}