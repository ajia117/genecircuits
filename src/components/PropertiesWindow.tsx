import {MarkerType, Node} from "@xyflow/react";
import React, {useEffect, useState} from "react";
import NodeData from "../types/NodeData";
import {ProteinDataForm} from '../components'
import {
    Flex,
    Text,
    Button,
    ScrollArea
} from "@radix-ui/themes"
import {
    Trash2
} from "lucide-react"

interface PropertiesWindowProps {
    selectedNodeId: string | null;
    proteinData: NodeData | null;
    setProteinData: (label: string, data: NodeData) => void;
}

const PropertiesWindow: React.FC<PropertiesWindowProps> = ({
    selectedNodeId,
    proteinData,
    setProteinData
}) => {
    const [localData, setLocalData] = useState<NodeData | null>(null);

    useEffect(() => {
        if (proteinData) {
            setLocalData(proteinData);
        }
    }, [proteinData]);

    const handleUpdate = () => {
        if (localData) {
            setProteinData(localData.label, localData);
        }
    };

    if (!localData) return <Text>No protein selected.</Text>;

    return (
        <Flex direction="column" gap="4">
            <Text size="4" weight="bold">Selected Node ID: <Text weight="regular">{selectedNodeId}</Text></Text>
            <Flex direction="row" justify="between" align="center">
                
                <Button variant="outline" color="red">
                    <Trash2 size={20}/> <Text size="4" weight="bold">Delete</Text>
                </Button>
            </Flex>

            <ScrollArea
                type="auto"
                scrollbars="vertical"
                style={{
                    // maxHeight: 'calc(100vh - 450px)',
                    border: '1px solid var(--gray-a6)',
                    borderRadius: 'var(--radius-3)',
                    padding: '0.5rem',
                    width: 'auto'
                }}
            >
                <Flex direction="column" gap="4" pb="4">
                    <ProteinDataForm
                        mode="edit"
                        proteinData={localData}
                        setProteinData={setLocalData}
                    />
                    <Button onClick={handleUpdate}><Text weight="bold">Update Protein</Text></Button>
                </Flex>
            </ScrollArea>
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