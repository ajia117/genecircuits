import {MarkerType, Node} from "@xyflow/react";
import React, {useEffect, useState} from "react";
import NodeData from "../types/NodeData";
import {ProteinDataForm} from '../components'
import {
    Flex,
    Text,
    Button,
    ScrollArea,
} from "@radix-ui/themes"
import {
    Trash2,
    Pencil
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

    useEffect(() => {
        if (proteinData) {
            setLocalProteinData(proteinData);
            setEditingProtein(false); // reset edit mode when new node selected
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
            { selectedNodeId && ( // display selected node data
                <Flex direction="column" gap="4">
                    <Text size="4" weight="bold">Selected Node ID: <Text weight="regular">{selectedNodeId}</Text></Text>
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


// interface PropertiesWindowProps {
//     selectedEdgeId: string;
//     selectedNodeId: string;
//     selectedNode: Node<NodeData>;
//     selectedNodeData: NodeData;
//     changeMarkerType: (type: string) => void;
//     changeLabelData: (name: string, value: string | number) => void;
//     changeNodeData: (name: string, value: string | number) => void;
// }
// const PropertiesWindow: React.FC<PropertiesWindowProps> = ({
//            selectedEdgeId,
//            selectedNodeId,
//            selectedNode,
//            selectedNodeData,
//            changeMarkerType,
//            changeLabelData,
//            changeNodeData
//        }) => {
//     // Add local state to store form values
//     const [formValues, setFormValues] = useState<NodeData>(selectedNodeData);
//     const isGate = selectedNode && (selectedNode.type === 'and' || selectedNode.type === 'or');

//     // Update local state when selectedNode changes
//     useEffect(() => {
//         if (selectedNodeId && selectedNode) {
//             setFormValues(selectedNodeData);
//         } else {
//             setFormValues(null);
//         }
//     }, [selectedNodeId, selectedNode]);

//     // Handle input changes
//     const handleInputChange = (key: string, value: string | number) => {
//         setFormValues(prev => ({
//             ...prev,
//             [key]: value
//         }));
//     };

//     // Generate form fields based on selectedNode data
//     const formFields = selectedNodeId && selectedNode ? Object.entries(selectedNodeData).map(([key, value]) => {
//         if (key === "label") {
//             return (
//                 <div key={key}>
//                     Label:<br />
//                     <input
//                         name="label"
//                         type="text"
//                         value={formValues[key] || ''}
//                         readOnly={true}
//                     /><br />
//                 </div>
//             );
//         }

//         if (key === 'inputs' || key === 'outputs') {
//             return (
//                 <div key={key}>
//                     {key.charAt(0).toUpperCase() + key.slice(1)}:<br />
//                     <input
//                         readOnly={true}
//                         name={key}
//                         type="number"
//                         value={formValues[key] as number || '0'}
//                         onChange={(e) => handleInputChange(key, e.target.value)}
//                     /><br />
//                 </div>
//             );
//         }

//         if (typeof value === "number") {
//             return (
//                 <div key={key}>
//                     {key.charAt(0).toUpperCase() + key.slice(1)}:<br />
//                     <input
//                         name={key}
//                         type="number"
//                         value={formValues[key] as number || '0'}
//                         onChange={(e) => handleInputChange(key, Number(e.target.value))}
//                     /><br />
//                 </div>
//             );
//         }

//         return null;
//     }) : null;

//     return (
//         <div className={`h-full overflow-y-auto`}>
//             <h1>
//                 Properties Window
//             </h1>
//             {(!(selectedNode || selectedEdgeId) || isGate) &&
//                 <div>Select a Node or Edge to view properties </div>
//             }
//             {selectedEdgeId && (
//                 <>
//                     <p>Change Marker for Edge: {selectedEdgeId}</p>
//                     <button onClick={() => changeMarkerType(MarkerType.Arrow)}>Promote</button>
//                     <button onClick={() => changeMarkerType("repress")}>Repress</button>
//                 </>
//             )}
//             {selectedNodeId && selectedNode && !isGate && (
//                 <>
//                     <p>Change Node Properties</p>
//                     <form
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             // Apply all changes at once on submit
//                             Object.entries(formValues).forEach(([key, value]) => {
//                                 if (typeof value === 'string' || typeof value === 'number') {
//                                     const numValue = Number(value);
//                                     // separate handles from rest of data

//                                     //todo: remove, cannot edit here
//                                     if(key === 'inputs' || key === 'outputs') {
//                                         // String if Not a Number
//                                         changeNodeData(key, isNaN(numValue) ? value : numValue);
//                                     }
//                                     else {
//                                         // String if Not a Number
//                                         changeLabelData(key, isNaN(numValue) ? value : numValue);
//                                     }
//                                 }
//                             });
//                         }}
//                     >
//                         {formFields}
//                         <button type="submit">Update</button>
//                     </form>
//                 </>
//             )}
//         </div>
//     );
// };

export default PropertiesWindow;