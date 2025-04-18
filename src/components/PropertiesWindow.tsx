import {MarkerType, Node} from "@xyflow/react";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import ProteinData from "../types/ProteinData";
import EdgeData from "../types/EdgeData";
import {ProteinDataForm} from '../components'
import {
    Flex,
    Text,
    Button,
    ScrollArea,
    DataList,
    Code,
    IconButton,
    SegmentedControl
} from "@radix-ui/themes"
import {
    Trash2,
    Pencil,
    Copy
} from "lucide-react"

interface PropertiesWindowProps {
    selectedNodeId: string | null;
    selectedNodeType: string | null;
    proteinData: ProteinData | null;
    setProteinData: (label: string, data: ProteinData) => void;
    selectedEdgeId: string | null;
    edgeData: EdgeData | null;
    setEdgeType: (type: "promote" | "repress") => void;
    editingProtein?: ProteinData | null;
    setEditingProtein?: Dispatch<SetStateAction<ProteinData>>;
    setActiveTab: Dispatch<SetStateAction<'toolbox' | 'properties' | 'circuits'>>;
}

const PropertiesWindow: React.FC<PropertiesWindowProps> = ({
    selectedNodeId,
    selectedNodeType,
    proteinData,
    setProteinData,
    selectedEdgeId,
    edgeData,
    setEdgeType,
    editingProtein,
    setEditingProtein,
    setActiveTab
}) => {
    const [localProteinData, setLocalProteinData] = useState<ProteinData | null>(null);
    const [showProteinEditor, setShowProteinEditor] = useState(false);
    const [localEdgeData, setLocalEdgeData] = useState<EdgeData | null>(null);


    const PROTEIN_LABEL_MAP: { [key: string]: string } = {
        label: "Protein Name",
        initialConcentration: "Initial Concentration",
        lossRate: "Loss Rate",
        beta: "Beta",
        inputs: "Number of Inputs",
        outputs: "Number of Outputs",
        "inputFunctionData.steadyStateValue": "Steady State Value",
        "inputFunctionData.timeStart": "Pulse Start Time",
        "inputFunctionData.timeEnd": "Pulse End Time",
        "inputFunctionData.pulsePeriod": "Pulse Period",
        "inputFunctionData.amplitude": "Amplitude",
        "inputFunctionData.dutyCycle": "Duty Cycle",
    };
    const EDGE_LABEL_MAP: { [key: string]: string } = {
        source: "Source Node ID",
        target: "Target Node ID",
    };
    
    
    // Reset proteinData when new node clicked
    useEffect(() => {
        if (proteinData) {
            setLocalProteinData(proteinData);
            setShowProteinEditor(false); // reset edit mode when new node selected. close the protein editor
        } else { // no data at all, something going wrong, nothing to display => reset all values
            setLocalProteinData(null);
            setShowProteinEditor(false);
        }
    }, [proteinData]);

    // Reset edgeData when new edge clicked
    useEffect(() => {
        if (edgeData) {
            setLocalEdgeData(edgeData);
        } else {
            setLocalEdgeData(null);
        }
    }, [edgeData]);

    // Reset proteinData when new node clicked
    useEffect(() => {
        if (editingProtein) {
            setLocalProteinData(editingProtein);
            setShowProteinEditor(true);          
        }
    }, [editingProtein]);
    
    // Called when user submits the updated protein data
    const handleUpdate = () => {
        if (localProteinData) {
            setProteinData(localProteinData.label, localProteinData);
            setShowProteinEditor(false); // exit edit mode after update
        }
        if(editingProtein) {
            setShowProteinEditor(false);
            setLocalProteinData(null);
            setLocalEdgeData(null);
            setEditingProtein(null);
            setActiveTab('toolbox')
        }
    };

    if (editingProtein) return (// Show protein editor if user clicks edit on a protein from the toolbox)
        <ScrollArea
            type="auto"
            scrollbars="vertical"
            style={{
                maxHeight: '400px',
                border: '1px solid var(--gray-a6)',
                borderRadius: 'var(--radius-3)',
                padding: '0.5rem',
                width: 'auto'
            }}
        >
            <Flex direction="column" gap="4" pb="4">
                <ProteinDataForm
                    mode="edit"
                    proteinData={editingProtein}
                    setProteinData={setEditingProtein}
                />
                <Button onClick={handleUpdate}><Text>Update Protein</Text></Button>
            </Flex>
        </ScrollArea>
    )

    // Text displayed when no node or edge is selected
    if (!selectedNodeId && !selectedEdgeId) return (
        <Flex align="center" justify="center">
            <Text color="gray" size="2" align="center">Select a node, protein, or edge to view its properties.</Text>
        </Flex>
    ) 
    
    return (
        <Flex direction="column" gap="4">
            {/* NODE PROPERTIES */}
            {( selectedNodeId && selectedNodeType === "custom" && proteinData ) && ( // display selected node data
                <Flex direction="column" gap="4">
                    <Text size="4" weight="bold">Node Properties</Text>

                    {/* start node data */}
                    <Flex direction="column" justify="center"
                        style={{
                            border: '1px solid var(--gray-a6)',
                            borderRadius: 'var(--radius-3)',
                            padding: '0.5rem',
                            backgroundColor: 'var(--color-surface)',
                            transition: 'background-color 0.2s ease',
                        }}
                    >
                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label minWidth="88px">Node ID</DataList.Label>
                                <DataList.Value>
                                    <Flex align="center" gap="2">
                                        <Code variant="ghost">{selectedNodeId}</Code>
                                        <IconButton
                                            size="1"
                                            aria-label="Copy value"
                                            color="gray"
                                            variant="ghost"
                                        >
                                            <Copy size={15} />
                                        </IconButton>
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                            {Object.entries(proteinData).map(([key, value]) => {
                                if (key === "inputFunctionData" && typeof value === "object" && value !== null) {
                                    return Object.entries(value).map(([innerKey, innerValue]) => (
                                        <DataList.Item key={innerKey}>
                                            <DataList.Label minWidth="88px">
                                                {PROTEIN_LABEL_MAP[`inputFunctionData.${innerKey}`] ?? innerKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </DataList.Label>
                                            <DataList.Value>
                                                <Code variant="ghost">
                                                    {typeof innerValue === "number"
                                                        ? innerValue
                                                        : typeof innerValue === "string"
                                                        ? innerValue
                                                        : JSON.stringify(innerValue)}
                                                </Code>
                                            </DataList.Value>
                                        </DataList.Item>
                                    ));
                                }

                                return (
                                    <DataList.Item key={key}>
                                        <DataList.Label minWidth="88px">
                                            {PROTEIN_LABEL_MAP[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </DataList.Label>
                                        <DataList.Value>
                                            <Code variant="ghost">
                                                {typeof value === "number"
                                                    ? value
                                                    : typeof value === "string"
                                                    ? value
                                                    : JSON.stringify(value)}
                                            </Code>
                                        </DataList.Value>
                                    </DataList.Item>
                                );
                            })}

                        </DataList.Root>
                    </Flex>

                    {/* start function buttons */}
                    <Flex direction="row" justify="between" align="center">
                        <Button variant="outline" color="red">
                            <Trash2 size={20}/> <Text size="4" weight="bold">Delete</Text>
                        </Button>
                        <Button variant="outline" onClick={() => setShowProteinEditor((prev) => !prev)}>
                            <Pencil size={20} />
                            <Text size="4" weight="bold">{showProteinEditor ? "Cancel" : "Edit"}</Text>
                        </Button>
                    </Flex>
                </Flex>
            )}

            { showProteinEditor && ( // open protein data editor
                <ScrollArea
                    type="auto"
                    scrollbars="vertical"
                    style={{
                        maxHeight: '400px',
                        border: '1px solid var(--gray-a6)',
                        borderRadius: 'var(--radius-3)',
                        padding: '1rem',
                        width: 'auto'
                    }}
                >
                    <Flex direction="column" gap="4" pb="4">
                        <ProteinDataForm
                            mode="edit"
                            proteinData={localProteinData}
                            setProteinData={setLocalProteinData}
                        />
                        <Button onClick={handleUpdate}><Text>Update Protein</Text></Button>
                    </Flex>
                </ScrollArea>
            )}

            {/* -------------------------------------------------------------------------------------------- */}
            {/* EDGE PROPERTIES */}
            {selectedEdgeId && edgeData && (
                <Flex direction="column" gap="4">
                    <Text size="4" weight="bold">Edge Properties</Text>

                    {/* edge data list */}
                    <Flex direction="column"
                        style={{
                            border: '1px solid var(--gray-a6)',
                            borderRadius: 'var(--radius-3)',
                            padding: '0.5rem',
                            backgroundColor: 'var(--color-surface)',
                        }}
                    >
                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label minWidth="88px">Edge ID</DataList.Label>
                                <DataList.Value>
                                    <Flex align="center" gap="2">
                                        <Code variant="ghost">{selectedEdgeId}</Code>
                                        <IconButton
                                            size="1"
                                            aria-label="Copy value"
                                            color="gray"
                                            variant="ghost"
                                        >
                                            <Copy size={15} />
                                        </IconButton>
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <Flex align="center"><DataList.Label minWidth="88px">Edge Type</DataList.Label></Flex>
                                <DataList.Value>
                                    <Flex justify="start" width="100%" align="center">
                                    <SegmentedControl.Root
                                        value={localEdgeData?.markerEnd}
                                        onValueChange={(val) => setEdgeType(val as "promote" | "repress")}
                                    >
                                        <SegmentedControl.Item value="promote">Promote</SegmentedControl.Item>
                                        <SegmentedControl.Item value="repress">Repress</SegmentedControl.Item>
                                    </SegmentedControl.Root>
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                            {Object.entries(edgeData)
                                .filter(([key]) => ["source", "target"].includes(key))
                                .map(([key, value]) => (
                                    <DataList.Item key={key}>
                                        <DataList.Label minWidth="88px">
                                            {EDGE_LABEL_MAP[key] ?? key}
                                        </DataList.Label>
                                        <DataList.Value>
                                            <Code variant="ghost">  
                                                {typeof value === "string" || typeof value === "number"
                                                ? value
                                                : JSON.stringify(value)}
                                            </Code>
                                        </DataList.Value>

                                    </DataList.Item>
                            ))}
                        </DataList.Root>
                    </Flex>
                </Flex>
            )}

            {/* -------------------------------------------------------------------------------------------- */}
            {/* LOGIC GATE PROPERTIES */}
            {selectedNodeId && (selectedNodeType === "and" || selectedNodeType === "or") && (
                <Flex direction="column" gap="4">
                    <Text size="4" weight="bold">Logic Gate Properties</Text>

                    {/* edge data list */}
                    <Flex direction="column"
                        style={{
                            border: '1px solid var(--gray-a6)',
                            borderRadius: 'var(--radius-3)',
                            padding: '0.5rem',
                            backgroundColor: 'var(--color-surface)',
                        }}
                    >
                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label minWidth="88px">Gate ID</DataList.Label>
                                <DataList.Value>
                                    <Flex align="center" gap="2">
                                        <Code variant="ghost">{selectedNodeId}</Code>
                                        <IconButton
                                            size="1"
                                            aria-label="Copy value"
                                            color="gray"
                                            variant="ghost"
                                        >
                                            <Copy size={15} />
                                        </IconButton>
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label minWidth="88px">Gate Type</DataList.Label>
                                <DataList.Value>
                                    <Code variant="ghost">{(selectedNodeType === "and") ? "AND" : "OR"}</Code>
                                </DataList.Value>
                            </DataList.Item>

                        </DataList.Root>
                    </Flex>
                </Flex>
            )}

        </Flex>
    );
};
export default PropertiesWindow;