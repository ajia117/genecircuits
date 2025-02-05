import React, { useCallback, useState, useRef, useEffect } from "react";
import { ReactFlow, 
    Background, 
    Controls, 
    applyEdgeChanges, 
    applyNodeChanges, 
    OnNodesChange, 
    Edge,
    EdgeChange,
    Connection,
    addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


const initialNodes = [
    {
        id: '1',
        position: { x: 0, y: 0 }, 
        type: "default",
        data: { label: 'default' }, 
    },
    {
        id: '2',
        position: { x: 100, y: 100 },
        type: "input",
        data: { label: 'input' },
    },
    {
        id: '3',
        position: { x: 100, y: 200 },
        type: "output",
        data: { label: 'output' },
    }
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
      const onConnect = useCallback((params: any) => {
        setEdges((eds) => addEdge(params, eds))
      },[]);

      useEffect(() => {
        console.log(edges)
      }, [edges])

      // handler to create a new node. should generalize with params for all the types of custom nodes
      const createNode = useCallback(() => {
            setNodes((nodes: any) => {
                return [
                    ...nodes,
                    {
                        id: Math.random().toString(),
                        position: {x:200, y:200},
                        type: "default",
                        data: { label: "new node" }
                    },
                ];
            })
        }, []);

        const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
            console.log("Clicked edge ID:", edge.id);
        }, []);

    return(
        <>
        <div style={{height: 300, width: "100%"}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeClick={onEdgeClick}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>

        {/* TOOLBAR HERE */}
        <div>
            <button onClick={createNode}>Add Node</button>
        </div>

        </>
    );
}