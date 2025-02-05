import React, { useCallback, useState, useRef } from "react";
import { ReactFlow, Background, Controls, applyEdgeChanges, applyNodeChanges, OnNodesChange, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


const initialNodes = [
    {
        id: '1',
        position: { x: 0, y: 0 }, 
        type: "default",
        data: { label: 'Hello' }, 
    },
    {
        id: '2',
        position: { x: 100, y: 100 },
        type: "default",
        data: { label: 'World' },
    },
];

const initialEdges: any[] | (() => any[]) = [];


export default function CircuitBuilder() {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
      );
      const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [],
      );
      const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [],
      );

    return(
        <div style={{height: 300, width: "100%"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}