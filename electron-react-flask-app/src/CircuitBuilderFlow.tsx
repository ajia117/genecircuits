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
    { id: 'node_1', position: { x: 0, y: 0 }, type: "default", data: { label: 'default' } },
    { id: 'node_2', position: { x: 100, y: 100 }, type: "input", data: { label: 'input' } },
    { id: 'node_3', position: { x: 100, y: 200 }, type: "output", data: { label: 'output' } },
];

const initialEdges: Edge[] = [];

let id = 4
const getId = () => `node_${id++}`; // creates id for the next node

export default function CircuitBuilderFlow() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();
    const [type, setType] = useDnD();
    // const [nodes, setNodes] = useState(initialNodes);
    // const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Stores clicked edge ID

    // const onNodesChange = useCallback(
    //     (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    //     []
    // );

    // const onEdgesChange = useCallback(
    //     (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     []
    // );

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

    // Handler to create a new node
    const createNode = useCallback(() => {
        setNodes((nodes) => [
            ...nodes,
            {
                id: Math.random().toString(),
                position: { x: 200, y: 200 },
                type: "default",
                data: { label: "new node" }
            },
        ]);
    }, []);

    return (
        <div className="circuit-builder-flow">
            <div className="flow-wrapper" ref={reactFlowWrapper} style={{ height: 300}}>
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
            <Toolbox/>

            {/* TOOLBAR */}
            <div>
                <button onClick={createNode}>Add Node</button>
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
        </div>
    );
}
