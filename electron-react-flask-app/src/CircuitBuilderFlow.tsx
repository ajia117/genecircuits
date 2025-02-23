import React, { useCallback, useState, useEffect, useRef } from "react";
import { 
    ReactFlow, 
    Background, 
    Controls, 
    addEdge, 
    Edge, 
    Connection, 
    MarkerType, 
    useNodesState,
    useEdgesState,
    useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDnD } from "./Toolbox/ToolboxContext";
import Toolbox from "./Toolbox/Toolbox";
import './index.css';
import RepressMarker from "./assets/RepressMarker";

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, type: "default", data: { label: 'A' } },
    { id: '2', position: { x: 100, y: 100 }, type: "input", data: { label: 'B' } },
    { id: '3', position: { x: 100, y: 200 }, type: "output", data: { label: 'C' } },
];

const initialEdges: Edge[] = [];

let id = 4
const getId = () => `${id++}`; // creates id for the next node

export default function CircuitBuilderFlow() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // List of all nodes in workspace
    const [edges, setEdges, onEdgesChange] = useEdgesState([]); // List of all edges in workspace
    const { screenToFlowPosition } = useReactFlow();
    const [type, setType] = useDnD(); // Stores node type that is being dragged and dropped
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Stores clicked edge ID

    // Handler for connecting nodes
    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    // Handler for clicking an edge
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        console.log("Clicked edge ID:", edge.id);
        setSelectedEdgeId(edge.id); // Store the clicked edge ID
    }, []);

    // Handler for dragging a component from toolbox to workspace
    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }, []);
    
    // Add new node
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
    
            const nodeType = event.dataTransfer.getData("application/reactflow") || type;
            if (!nodeType || typeof nodeType !== "string") { // get the node type
                console.error("Invalid node type:", nodeType);
                return;
            }
            
            const position = screenToFlowPosition({ // find drop location
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = { // properties of new node being added
                id: getId(),
                position,
                type: nodeType,
                data: { label: `${nodeType} node` },
            };
    
            setNodes((nds) => [...nds, newNode]);
        },
        [screenToFlowPosition, type],
    );

    // Function to change marker type of the selected edge
    const changeMarkerType = useCallback((markerType: any) => {
        if (!selectedEdgeId) return; // No edge selected

        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === selectedEdgeId
                    ? {
                        ...edge,
                        markerEnd: markerType === "repress" 
                            ? 'repress' // type is repress arrow
                            : { type: markerType, width: 20, height: 20, color: "black" }
                    }
                    : edge
            )
        );
    }, [selectedEdgeId]);

    useEffect(() => {
        console.log(edges);
    }, [edges]);

    return (
        <>
            <RepressMarker/> {/* import custom edge marker svg */}
            <div className="circuit-builder-container">
            
                {/* Left Pane (Toolbox + Properties Window) */}
                <div className="left-pane">
                    <div className="toolbox-container">
                        <Toolbox />
                    </div>
                    <div className="properties-window">
                        <p>Properties Window</p>
                        {selectedEdgeId && (
                            <>
                                <p>Change Marker for Edge ID: {selectedEdgeId}</p>
                                <button onClick={() => changeMarkerType(MarkerType.Arrow)}>Promote</button>
                                <button onClick={() => changeMarkerType("repress")}>Repress</button>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Pane (circuit building workspace area) */}
                <div className="flow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onEdgeClick={onEdgeClick} 
                        fitView
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>

            </div>
        
            {/* Marker Selection UI */}
            {selectedEdgeId && (
                <div>
                    <p>Change Marker for Edge ID: {selectedEdgeId}</p>
                    <button onClick={() => changeMarkerType(MarkerType.Arrow)}>Promote</button>
                    <button onClick={() => changeMarkerType("repress")}>Repress</button>
                </div>
            )}
        </>
    );
}
