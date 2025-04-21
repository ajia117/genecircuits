
import { 
    Dialog,
    Flex,
    Tabs,
    Box,
    Text,
    Button,
} from "@radix-ui/themes";
import {
    Upload,
    Import
} from "lucide-react";

interface ImportWindowProps {
    open: boolean
    onOpenChange: (open: boolean) => void,
}

export default function ImportWindow({ open, onOpenChange }: ImportWindowProps) { 

    const handleCircuitImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
      
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
                            Open Project
                        </Tabs.Trigger>
                        <Tabs.Trigger value="import">
                            Import Circuit
                        </Tabs.Trigger>
                    </Tabs.List>

                    {/* START TABS CONTENT */}
                    <Box pt="3">
                        {/* OPEN PROJECT */}
                        <Tabs.Content value="open">
                            <Text size="2">Open an existing project.</Text>
                        </Tabs.Content>

                        {/* IMPORT CIRCUIT */}
                        <Tabs.Content value="import">
                            <Text size="2">Import a circuit JSON file.</Text>
                            <Flex as="div" direction="column" align="center" justify="center" gap="2" mt="4" mb="5"
                                style={{
                                    border: "dashed 2px",
                                    borderRadius: "5px",
                                    color: "lightgray"
                                }}
                            >
                                <Upload color="gray" width="25px" height="25px" />
                                <Box>
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer text-emerald-600 font-medium hover:text-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
                                >
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only hidden"
                                        accept=".json"
                                        onChange={(e) => {handleCircuitImport(e)}}
                                    />
                                </label>
                                <Text size="1" color="gray" ml="1">
                                    or drag and drop
                                </Text>
                                </Box>
                                <Text size="1" color="gray"> Supports .json files up to 10MB</Text>
                            </Flex>

                            {/* import button */}
                            <Flex justify="end" mb="4">
                                <Dialog.Close>
                                <Button variant="solid" size="3" onClick={() => {handleCircuitImport}}> {/* TODO: make work with multiple files and it only import when button clicked */}
                                    <Import /> Import
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