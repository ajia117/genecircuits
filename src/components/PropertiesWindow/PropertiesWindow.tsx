import {MarkerType, Node} from "@xyflow/react";
import React, {useEffect, useState} from "react";
import NodeData from "../../types/NodeData";

interface PropertiesWindowProps {
    selectedEdgeId: string;
    selectedNodeId: string;
    selectedNode: Node<NodeData>;
    selectedNodeData: NodeData;
    changeMarkerType: (type: string) => void;
    changeLabelData: (name: string, value: string | number) => void;
    changeNodeData: (name: string, value: string | number) => void;
}
const PropertiesWindow: React.FC<PropertiesWindowProps> = ({
           selectedEdgeId,
           selectedNodeId,
           selectedNode,
           selectedNodeData,
           changeMarkerType,
           changeLabelData,
           changeNodeData
       }) => {
    // Add local state to store form values
    const [formValues, setFormValues] = useState<NodeData>(selectedNodeData);

    // Update local state when selectedNode changes
    useEffect(() => {
        if (selectedNodeId && selectedNode) {
            setFormValues(selectedNodeData);
        } else {
            setFormValues(null);
        }
    }, [selectedNodeId, selectedNode]);

    // Handle input changes
    const handleInputChange = (key: string, value: string | number) => {
        setFormValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Generate form fields based on selectedNode data
    const formFields = selectedNodeId && selectedNode ? Object.entries(selectedNodeData).map(([key, value]) => {
        if (key === "label") {
            return (
                <div key={key}>
                    Label:<br />
                    <input
                        name="label"
                        type="text"
                        value={formValues[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                    /><br />
                </div>
            );
        }

        if (key === 'inputs' || key === 'outputs') {
            return (
                <div key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:<br />
                    <input
                        readOnly={true}
                        name={key}
                        type="number"
                        value={formValues[key] as number || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                    /><br />
                </div>
            );
        }

        if (typeof value === "number") {
            return (
                <div key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:<br />
                    <input
                        name={key}
                        type="number"
                        value={formValues[key] as number || 0}
                        onChange={(e) => handleInputChange(key, Number(e.target.value))}
                    /><br />
                </div>
            );
        }

        return null;
    }) : null;

    return (
        <div className={`h-full overflow-y-auto`}>
            {selectedEdgeId && (
                <>
                    <p>Change Marker for Edge: {selectedEdgeId}</p>
                    <button onClick={() => changeMarkerType(MarkerType.Arrow)}>Promote</button>
                    <button onClick={() => changeMarkerType("repress")}>Repress</button>
                </>
            )}
            {selectedNodeId && selectedNode && (
                <>
                    <p>Change Node Properties</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Apply all changes at once on submit
                            Object.entries(formValues).forEach(([key, value]) => {
                                if (typeof value === 'string' || typeof value === 'number') {
                                    const numValue = Number(value);
                                    // separate handles from rest of data
                                    if(key === 'inputs' || key === 'outputs') {
                                        // String if Not a Number
                                        changeNodeData(key, isNaN(numValue) ? value : numValue);
                                    }
                                    else {
                                        // String if Not a Number
                                        changeLabelData(key, isNaN(numValue) ? value : numValue);
                                    }
                                }
                            });
                        }}
                    >
                        {/* Only show form if not a circuit gate */
                         selectedNode.type !== 'and' &&
                         selectedNode.type !== 'or'  &&
                         formFields}
                        <button type="submit">Update</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default PropertiesWindow;