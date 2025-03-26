import {MarkerType, Node} from "@xyflow/react";
import React, {useEffect, useState} from "react";
import NodeData from "../../types/NodeData";

interface PropertiesWindowProps {
    selectedEdgeId: string;
    selectedNodeId: string;
    selectedNode: Node<NodeData>;
    changeMarkerType: (type: string) => void;
    changeNodeData: (name: string, value: string | number) => void;
}
const PropertiesWindow: React.FC<PropertiesWindowProps> = ({
           selectedEdgeId,
           selectedNodeId,
           selectedNode,
           changeMarkerType,
           changeNodeData
       }) => {
    // Add local state to store form values
    const [formValues, setFormValues] = useState<NodeData>(selectedNode.data);

    // Update local state when selectedNode changes
    useEffect(() => {
        if (selectedNodeId && selectedNode) {
            setFormValues(selectedNode.data);
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
    const formFields = selectedNodeId && selectedNode ? Object.entries(selectedNode.data).map(([key, value]) => {
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
                                    // String if Not a Number
                                    changeNodeData(key, isNaN(numValue) ? value : numValue);
                                }
                            });
                        }}
                    >
                        {formFields}
                        <button type="submit">Update</button>
                    </form>
                </>
            )}
        </div>
    );
};

export default PropertiesWindow;