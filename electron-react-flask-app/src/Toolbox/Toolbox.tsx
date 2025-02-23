import React from 'react';
import { useDnD } from './ToolboxContext';
 
export default () => {
    const [_, setType] = useDnD();
    
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType); // Store type
        event.dataTransfer.effectAllowed = "move";
        setType(nodeType); // Ensure type updates
        console.log("Dragging node type:", nodeType);
        };

 
    return (
        <>
            <h1>Toolbox</h1>
            <div className="components-container">   
                <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
                    Input Node
                </div>
                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
                    Default Node
                </div>
                <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
                    Output Node
                </div>
            </div>
        </>
    );
};

