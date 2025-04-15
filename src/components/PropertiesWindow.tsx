import {MarkerType, Node} from "@xyflow/react";
import React, {useEffect, useState} from "react";
import NodeData from "../types/NodeData";
import {ProteinDataForm} from '../components'
import {
    Flex,
    Text,
    Button,
    ScrollArea,
    DataList,
    Code,
    IconButton,
} from "@radix-ui/themes"
import {
    Trash2,
    Pencil,
    Copy
} from "lucide-react"

interface PropertiesWindowProps {
    selectedNodeId: string | null;
    proteinData: NodeData | null;
    setProteinData: (label: string, data: NodeData) => void;
}

const PropertiesWindow: React.FC<PropertiesWindowProps> = ({
    selectedNodeId,
    proteinData,
    setProteinData,
}) => {
    const [localProteinData, setLocalProteinData] = useState<NodeData | null>(null);
    const [editingProtein, setEditingProtein] = useState(false);

    const LABEL_MAP: { [key: string]: string } = { // used for protein data list labels
        label: "Protein",
        initialConcentration: "Initial Concentration",
        lossRate: "Loss Rate",
        beta: "Beta",
        inputs: "Number of Inputs",
        outputs: "Number of Outputs"
    };
    

    useEffect(() => {
        console.log('opening', proteinData)
        if (proteinData) {
            setLocalProteinData(proteinData);
            setEditingProtein(false); // reset edit mode when new node selected
        } else { // no data at all, something going wrong, nothing to display => reset all values
            setLocalProteinData(null);
            setEditingProtein(false);
        }
    }, [proteinData]);

    const handleUpdate = () => {
        if (localProteinData) {
            setProteinData(localProteinData.label, localProteinData);
            setEditingProtein(false); // exit edit mode after update
        }
    };

    if (!localProteinData) return (
        <Flex align="center" justify="center">
            <Text color="gray" size="2" align="center">Select a node, protein, or edge to view its properties.</Text>
        </Flex>
    );

    return (
        <Flex direction="column" gap="4">
            {( selectedNodeId && proteinData ) && ( // display selected node data
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
                                <DataList.Label minWidth="88px">ID</DataList.Label>
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
                            {Object.entries(proteinData).map(([key, value]) => (
                                <DataList.Item key={key}>
                                    <DataList.Label minWidth="88px">
                                        {LABEL_MAP[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </DataList.Label>
                                    <DataList.Value>
                                        {typeof value === "number"
                                            ? value
                                            : typeof value === "string"
                                            ? value
                                            : JSON.stringify(value)
                                        }
                                    </DataList.Value>
                                </DataList.Item>
                            ))}
                        </DataList.Root>
                    </Flex>

                    {/* start function buttons */}
                    <Flex direction="row" justify="between" align="center">
                        <Button variant="outline" color="red">
                            <Trash2 size={20}/> <Text size="4" weight="bold">Delete</Text>
                        </Button>
                        <Button variant="outline" onClick={() => setEditingProtein((prev) => !prev)}>
                            <Pencil size={20} />
                            <Text size="4" weight="bold">{editingProtein ? "Cancel" : "Edit"}</Text>
                        </Button>
                    </Flex>
                </Flex>
            )}

            { editingProtein && ( // open protein data editor
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
                            proteinData={localProteinData}
                            setProteinData={setLocalProteinData}
                        />
                        <Button onClick={handleUpdate}><Text>Update Protein</Text></Button>
                    </Flex>
                </ScrollArea>
            )}
        </Flex>
    );
};
export default PropertiesWindow;