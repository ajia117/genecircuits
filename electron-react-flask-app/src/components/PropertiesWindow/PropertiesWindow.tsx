import {MarkerType, Node} from "@xyflow/react";
import React from "react";
import NodeData from "../../types/NodeData";

interface PropertiesWindowProps {
    selectedEdgeId: string;
    selectedNodeId: string;
    selectedNode: Node<NodeData>;
    changeMarkerType: (type: string) => void;
    changeNodeData: (name: string, value: string | number) => void;
}

const PropertiesWindow: React.FC<PropertiesWindowProps> = ({selectedEdgeId, selectedNodeId, selectedNode, changeMarkerType, changeNodeData}) => {
    const formFields = selectedNodeId && selectedNode ? Object.entries(selectedNode.data).map(([key, value]) => {
        if (key === "label") {
            return (
                <div key={key}>
                    Label:<br />
                    <input name="label" type="text" defaultValue={String(value)} /><br />
                </div>
            );
        }

        if (typeof value === "number") {
            return (
                <div key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:<br />
                    <input name={key} type="number" defaultValue={value} /><br />
                </div>
            );
        }

        return null;
    }) : null;

    return (
        <>
        {selectedEdgeId && (
            <>
                <p>Change Marker for Edge</p>
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
                        const formData = new FormData(e.currentTarget);
                        formData.forEach((value, key) => {
                            if(value instanceof File) return;
                            const numValue = Number(value);

							// String if Not a Number
                            changeNodeData(key, isNaN(numValue) ? value : numValue);
                        });
                    }}
                >
                    {formFields}
                    <button type="submit">Update</button>
                </form>
            </>
        )}
        </>
    )
}

export default PropertiesWindow;