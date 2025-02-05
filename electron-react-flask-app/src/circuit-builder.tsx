import React, { useCallback, useState, useEffect } from "react";
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
    MarkerType 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, type: "default", data: { label: 'default' } },
    { id: '2', position: { x: 100, y: 100 }, type: "input", data: { label: 'input' } },
    { id: '3', position: { x: 100, y: 200 }, type: "output", data: { label: 'output' } },
];

const initialEdges: Edge[] = [];

export default function CircuitBuilder() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Stores clicked edge ID

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        []
    );

    // Handler for clicking an edge
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        console.log("Clicked edge ID:", edge.id);
        setSelectedEdgeId(edge.id); // Store the clicked edge ID
    }, []);

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
        <>
            <div style={{ height: 300, width: "100%" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onEdgeClick={onEdgeClick} // <-- Click handler
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>

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
        </>
    );
}
