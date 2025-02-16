import React, { useCallback, useState, useEffect, useRef } from "react";
import { 
    ReactFlow, 
    Background, 
    Controls, 
    applyEdgeChanges, 
    applyNodeChanges, 
    addEdge, 
    NodeChange, 
    EdgeChange, 
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

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, type: "default", data: { label: 'default' } },
    { id: '2', position: { x: 100, y: 100 }, type: "input", data: { label: 'input' } },
    { id: '3', position: { x: 100, y: 200 }, type: "output", data: { label: 'output' } },
];

const initialEdges: Edge[] = [];

let id = 4
const getId = () => `${id++}`; // creates id for the next node

export default function CircuitBuilderFlow() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [type, setType] = useDnD();
    // const [nodes, setNodes] = useState(initialNodes);
    // const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Stores clicked edge ID

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    // Handler for clicking an edge
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        console.log("Clicked edge ID:", edge.id);
        setSelectedEdgeId(edge.id); // Store the clicked edge ID
    }, []);

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      }, []);
    
    // add new node
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
    
            const nodeType = event.dataTransfer.getData("application/reactflow") || type;
            if (!nodeType || typeof nodeType !== "string") {
                console.error("Invalid node type:", nodeType);
                return;
            }
            
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
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
    const changeMarkerType = useCallback((markerType: MarkerType) => {
        if (!selectedEdgeId) return; // No edge selected

        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === selectedEdgeId
                    ? { ...edge, markerEnd: { type: markerType, width: 20, height: 20, color: "orange" } }
                    : edge
            )
        );
    }, [selectedEdgeId]);

    useEffect(() => {
        console.log(edges);
    }, [edges]);

    return (
        <>
        <div className="circuit-builder-flow">
            <Toolbox/>
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
                    style={{ backgroundColor: "#F7F9FB" }}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>

            {/* TOOLBAR */}
            {/* <div>
                <button onClick={createNode}>Add Node</button>
            </div> */}

        </div>
        {/* Marker Selection UI */}
        {selectedEdgeId && (
                <div>
                    <p>Change Marker for Edge ID: {selectedEdgeId}</p>
                    <button onClick={() => changeMarkerType(MarkerType.Arrow)}>Promote</button>
                    <button onClick={() => changeMarkerType(null)}>Repress</button>
                    {/* <button onClick={() => changeMarkerType(MarkerType.Circle)}>Circle</button> */}
                </div>
            )}
        </>
    );
}
