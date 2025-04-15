import React, {useCallback, useState, useRef, useMemo, useEffect} from "react";
import {
    ReactFlow,
    Background,
    Controls,
    Edge,
    Node,
    Connection,
    useNodesState,
    useEdgesState,
    useReactFlow,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './index.css';
import { RepressMarker, PromoteMarker } from "./assets";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import NodeData from "./types/NodeData";
import SelfConnectingEdge from "./components/Edges/SelfConnectingEdge";
import { syncNodeCounters, setRefs } from "./utils";

import { 
    Toolbox, 
    PropertiesWindow, 
    OutputWindow, 
    Ribbon, 
    AndGateNode, 
    OrGateNode, 
    CustomNode 
} from './components';
import {
    Tabs,
    Box,
    Text,
} from '@radix-ui/themes'


export default function CircuitBuilderFlow() {
    const reactFlowWrapper = useRef(null);
    const { screenToFlowPosition } = useReactFlow();

    const [nodes, setNodes, onNodesChange] = useNodesState([]); // List of all nodes in workspace
    const [edges, setEdges, onEdgesChange] = useEdgesState([]); // List of all edges in workspace
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Stores clicked edge ID
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Stores clicked node ID

    const [showOutputWindow, setShowOutputWindow] = useState<boolean>(false);
    const [outputWindowSettings, setOutputWindowSettings] = useState({x: 0, y: 0, width: 300, height:200})

    const [outputData, setOutputData] = useState(); // Holds data received from backend to be used as graph
    const [proteins, setProteins] = useState<{[label: string]: NodeData}>({});

    const [activeTab, setActiveTab] = useState('toolbox');

    const [circuitSettings, setCircuitSettings] = useState({
        projectName: "Untitled Project",
        simulationDuration: 20,
        numTimePoints: 10
    });
    

    const nodeTypes = useMemo(() => ({
        custom: CustomNode,
        and: AndGateNode,
        or: OrGateNode
    }), []);
    const edgeTypes = useMemo(() => ({
        selfConnecting: SelfConnectingEdge,
    }), []);

    // let nodeId = 0; // counter for protein nodes
    // let gateId = 0; // counter for gate nodes
    // const getId = (nodeType: string) => { // provide id for nodes
    //     if (nodeType == "and" || nodeType == "or") {
    //         return `g${gateId++}`
    //     } else if (nodeType == "custom") {
    //         return `${nodeId++}`
    //     }
    // }; // creates id for the next node

    // handle creating new ids for nodes and gates
    const nodeIdRef = useRef(0); // counter for protein nodes
    const gateIdRef = useRef(0); // counter for gate nodes
    const getId = (nodeType: string): string => {
        if (nodeType === "and" || nodeType === "or") {
          return `g${gateIdRef.current++}`;
        } else if (nodeType === "custom") {
          return `${nodeIdRef.current++}`;
        }
        return `unknown-${Math.random().toString(36).substr(2, 5)}`;
      };
    useEffect(() => {
        setRefs({ nodeIdRef, gateIdRef });
    }, []);

    // handler for circuit imports
    useEffect(() => {
        const handleCircuitImport = (event: CustomEvent) => {
            const { circuitSettings: importedSettings, nodes: importedNodes, edges: importedEdges, proteins: importedProteins } = event.detail;
    
            // Replace circuit settings (safe default fallback)
            setCircuitSettings(prev => ({
                projectName: importedSettings?.projectName ?? prev.projectName,
                simulationDuration: importedSettings?.simulationDuration ?? prev.simulationDuration,
                numTimePoints: importedSettings?.numTimePoints ?? prev.numTimePoints,
            }));
    
            // Merge nodes (or do overwrite depending on behavior you want)
            setNodes(prev => [...prev, ...(importedNodes ?? [])]);
    
            // Merge edges
            setEdges(prev => [...prev, ...(importedEdges ?? [])]);
    
            // Merge proteins
            setProteins(prev => ({
                ...prev,
                ...(importedProteins ?? {})
            }));
    
            // Sync node ID counters to avoid ID conflict
            syncNodeCounters([...nodes, ...(importedNodes ?? [])]);
        };
    
        window.addEventListener("circuitImport", handleCircuitImport as EventListener);
    
        return () => {
            window.removeEventListener("circuitImport", handleCircuitImport as EventListener);
        };
    }, [setNodes, setEdges, setProteins, setCircuitSettings, nodes]);
    

    // Handler for connecting nodes
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => {
                const filteredEdges = eds.filter(edge => !(edge.source === params.source && edge.target === params.target));
                const selfConnection = params.source === params.target;
                const newEdge: Edge = {
                        ...params,
                        id: `edge-${params.source}-${params.target}`,
                        type: `${selfConnection ? 'selfConnecting' : 'default'}`,
                        markerEnd: "promote"
                    };
                
                return [...filteredEdges, newEdge];
            });
        },
        [setEdges]
    );
    
    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
    }, []);

    // Handler for clicking a node
    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id); // Store the clicked node ID
        setSelectedEdgeId(null);
    };

    // Handler for clicking an edge
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        setSelectedEdgeId(edge.id); // Store the clicked edge ID
        setSelectedNodeId(null);
    }, []);

    const getSelectedNode = () => {
        return nodes.find(node => node.id === selectedNodeId) as Node<NodeData>;
    };

    // const changeLabelData = (name: string, value: string | number) => {
    //     // get label for node data you want to change
    //     const labelToChange = nodes.find((node) => node.id === selectedNodeId).data.label
    //     // only change the name and value of the label
    //     setProteins(prevMap => ({
    //         ...prevMap,
    //         [labelToChange]: {
    //             ...prevMap[labelToChange],
    //             [name]: value
    //         }
    //     }));
    // };

    // change node-specific data, such as input and output handles
    // const changeNodeData = (name: string, value: string | number) => {
    //     setNodes((nodes) =>
    //         nodes.map((node) =>
    //             node.id === selectedNodeId ? {
    //                 ...node,
    //                 data: {
    //                     ...node.data,
    //                     [name]: value
    //                 }
    //             } : node
    //         )
    //     );
    // };


    // Handler for dragging a component from toolbox to workspace
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Function to change edge type of the selected edge
    const changeMarkerType = useCallback((markerType: string) => {
        if (!selectedEdgeId) return; // No edge selected

        setEdges((eds) =>
            eds.map((edge) =>
                edge.id === selectedEdgeId
                    ? {
                        ...edge,
                        markerEnd: markerType === "repress"
                            ? "repress"
                            : "promote"
                    }
                    : edge
            )
        );
    }, [selectedEdgeId]);

    // return data if label in proteins
    // const getLabelData = (label: string) => {
    //     if(label in proteins) {
    //         return proteins[label];
    //     }
    //     return null;
    // }

    // get all data from a given protein label
    const getProteinData = (label: string) => proteins[label] ?? null;

    // set label data if exists, or add to nodeLabelData if not
    // const setLabelData = (label: string, data: NodeData) => {
    //     setProteins(prevMap => ({
    //         ...prevMap,
    //         [label]: data
    //     }));
    // }
    const setProteinData = (label: string, data: NodeData) => {
        setProteins((prev) => ({
          ...prev,
          [label]: data,
        }));
      };

    // get data from the selected node
    const getSelectedProteinData = () => {
        const node = getSelectedNode();
        if(node)
            return getProteinData(node.data.label)
    }

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
    
            const nodeType = event.dataTransfer.getData("application/reactflow");
            if (!nodeType || typeof nodeType !== "string") {
                console.error("Invalid node type:", nodeType);
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            let newNode: Node;
    
            if (nodeType === "custom") {
                const rawData = JSON.parse(event.dataTransfer.getData("application/node-data")) as NodeData;

                // Remove `id` if present — prevent conflict
                const { id, ...nodeData } = rawData;

                newNode = {
                    id: getId(nodeType),
                    type: nodeType,
                    position,
                    data: nodeData,
                };
        
                if (nodeData.label) {
                    setProteinData(nodeData.label, nodeData);
                }
            } else { // if logic gate
                newNode = {
                    id: getId(nodeType),
                    type: nodeType,
                    position,
                    data: {},
                };
            }
            setNodes((nds) => [...nds, newNode]);
        }, [screenToFlowPosition, setNodes, setProteinData]);

    // display output window
    const renderOutputWindow = () => {
        return <OutputWindow onClose={() => setShowOutputWindow(false)} outputData={outputData} windowSettings={outputWindowSettings} setWindowSettings={setOutputWindowSettings} />;
    };

    return (
        <>
            {/* load marker end svgs */}
            <RepressMarker />
            <PromoteMarker /> 

            {/* TOP MENU FUNCTION BUTTONS */}
            <Ribbon
                proteins={proteins} setProteins={setProteins}
                nodes={nodes} setNodes={setNodes}
                edges={edges} setEdges={setEdges}
                showOutputWindow={showOutputWindow} 
                setShowOutputWindow={setShowOutputWindow}
                circuitSettings={circuitSettings}
                setCircuitSettings={setCircuitSettings}
                setOutputData={setOutputData}
            />
            
            <div className="bottom-container">
                <PanelGroup className="circuit-builder-container" direction="horizontal">
                    {/* Left Pane (Toolbox + Properties Window) */}
                    <Panel className="left-pane min-w-128" defaultSize={30} maxSize={50}>
                        <div className="flex flex-col h-full">
                            {/* Tab Navigation */}
                            <Tabs.Root defaultValue="toolbox" className="h-full">
                                <Tabs.List>
                                    <Tabs.Trigger value="toolbox">Toolbox</Tabs.Trigger>
                                    <Tabs.Trigger value="properties">Properties</Tabs.Trigger>
                                    <Tabs.Trigger value="circuits">Circuits</Tabs.Trigger>
                                </Tabs.List>
                            

                                {/* Tab Content */}
                                <Box px="4" mt="6" className="h-full overflow-y-auto">
                                    {/* TOOLBOX */}
                                    <Tabs.Content value="toolbox">
                                        <Toolbox
                                            proteins={proteins}
                                            setProteinData={setProteinData}
                                            getProteinData={getProteinData}
                                        />
                                    </Tabs.Content>

                                    {/* PROPERTIES */}
                                    <Tabs.Content value="properties">
                                        {/* <PropertiesWindow
                                            key={`${selectedNodeId || ''}-${selectedEdgeId || ''}`}
                                            changeMarkerType={changeMarkerType}
                                            changeLabelData={changeLabelData}
                                            changeNodeData={changeNodeData}
                                            selectedEdgeId={selectedEdgeId}
                                            selectedNodeId={selectedNodeId}
                                            selectedNode={getSelectedNode()}
                                            selectedNodeData={getSelectedNodeLabelData()}
                                        /> */}
                                    </Tabs.Content>

                                    {/* CIRCUITS */}
                                    <Tabs.Content value="circuit">
                                        <Text size="4" weight="bold">Prebuilt Circuits</Text>
                                    </Tabs.Content>
                                </Box>
                            </Tabs.Root>

                            
                        </div>
                    </Panel>

                    <PanelResizeHandle className="resize-handle-vertical"/>

                    {/* Right Pane (circuit building workspace area) */}
                    <Panel className="flow-wrapper" ref={reactFlowWrapper} defaultSize={80} minSize={50} maxSize={90}>
                        {showOutputWindow && renderOutputWindow()}
                        
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onConnect={onConnect}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onNodeClick={onNodeClick}
                            onEdgeClick={onEdgeClick}
                            onPaneClick={onPaneClick}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            fitView
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </Panel>
                </PanelGroup>
            </div>
        </>
    );
}
