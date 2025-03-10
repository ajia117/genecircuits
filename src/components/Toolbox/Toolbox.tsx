import React, {useState} from 'react';
import { Plus } from 'lucide-react';
import AndGate from "../../assets/AndGate";

export const Toolbox = () => {

    const [showForm, setShowForm] = useState(false);
    const [connections, setConnections] = useState({
        inputs: 1,
        outputs: 1
    });
    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setConnections(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType); // Store type
        if(nodeType === "custom") {
            event.dataTransfer.setData("application/node-in", String(connections.inputs));
            event.dataTransfer.setData("application/node-out", String(connections.outputs));
        }
        event.dataTransfer.effectAllowed = "move";
        console.log("Dragging node type:", nodeType);
    };

    return (
        <>
            <h1 className={`text-center`}>Toolbox</h1>
            <div className="components-container">
                <div className="dndnode and" onDragStart={(event) => onDragStart(event, 'and')} draggable>
                    AND Node
                </div>
                <div className="dndnode or" onDragStart={(event) => onDragStart(event, 'or')} draggable>
                    OR Node
                </div>
                <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                    Input Node
                </div>
                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                    Default Node
                </div>
                <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                    Output Node
                </div>
                <div
                    onClick={() => setShowForm(!showForm)}
                    className="flex dndnode items-center justify-center w-full transition-colors cursor-pointer"
                >
                    <Plus size={20} className={`my-auto`}/>
                </div>

                {showForm && (
                    <div className="mt-4 p-4 bg-gray-50 rounded shadow-sm">
                        <h3 className="text-lg font-medium mb-3">Connection Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Inputs
                                </label>
                                <input
                                    type="number"
                                    name="inputs"
                                    min="0"
                                    max="10"
                                    value={connections.inputs}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Outputs
                                </label>
                                <input
                                    type="number"
                                    name="outputs"
                                    min="0"
                                    max="10"
                                    value={connections.outputs}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'custom')} draggable>
                            Custom Node
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Toolbox;
