import React, {useCallback, useState, useRef, useMemo} from "react";
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

import { 
    Toolbox, 
    PropertiesWindow, 
    OutputWindow, 
    Ribbon, 
    AndGateNode, 
    OrGateNode, 
    CustomNode 
} from './components';
import NodeData from "./types/NodeData";

export default function CircuitBuilderFlow() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]); // List of all nodes in workspace
    const [edges, setEdges, onEdgesChange] = useEdgesState([]); // List of all edges in workspace
    const { screenToFlowPosition } = useReactFlow();
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null); // Stores clicked edge ID
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); // Stores clicked node ID
    const [showOutputWindow, setShowOutputWindow] = useState<boolean>(false);
    const [outputWindowSettings, setOutputWindowSettings] = useState({x: 0, y: 0, width: 300, height:200})

    const circuitSettings = {
        circuitName: "test circuit",
        simulationDuration: 20,
        numTimeSlots: 10
    }
    const [labelDataMap, setLabelDataMap] = useState<{[label: string]: NodeData}>({});

    const nodeTypes = useMemo(() => ({
        custom: CustomNode,
        and: AndGateNode,
        or: OrGateNode
    }), []);

    let id = 0;
    const getId = () => `${id++}`; // creates id for the next node

    // Handler for connecting nodes
    const onConnect = useCallback(
        (params: Connection) => {
            const newEdge: Edge = {
                ...params,
                id: `edge-${params.source}-${params.target}`, // Custom naming convention
                type: 'default',
                markerEnd: "promote"
            };
            setEdges((eds) => [...eds, newEdge]);
        },
        [setEdges]
    );
    
    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
    }, []);

    // Handler for clicking an edge
    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id); // Store the clicked node ID
        setSelectedEdgeId(null);
    };

    const getSelectedNode = () => {
        return nodes.find(node => node.id === selectedNodeId) as Node<NodeData>;
    };

    const changeLabelData = (name: string, value: string | number) => {
        // get label for node data you want to change
        const labelToChange = nodes.find((node) => node.id === selectedNodeId).data.label
        // only change the name and value of the label
        setLabelDataMap(prevMap => ({
            ...prevMap,
            [labelToChange]: {
                ...prevMap[labelToChange],
                [name]: value
            }
        }));
    };

    // change node-specific data, such as input and output handles
    const changeNodeData = (name: string, value: string | number) => {
        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === selectedNodeId ? {
                    ...node,
                    data: {
                        ...node.data,
                        [name]: value
                    }
                } : node
            )
        );
    };

    // Handler for clicking an edge
    const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        setSelectedEdgeId(edge.id); // Store the clicked edge ID
        setSelectedNodeId(null);
    }, []);

    // Handler for dragging a component from toolbox to workspace
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Add new node
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const nodeType = event.dataTransfer.getData("application/reactflow");
            const nodeData = JSON.parse(event.dataTransfer.getData("application/node-data")) as NodeData;
            if (!nodeType || typeof nodeType !== "string") {
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
                data: nodeData
            };
            setNodes((nds) => [...nds, newNode]);
            setLabelData(nodeData.label, nodeData);
        },
        [screenToFlowPosition],
    );

    // Function to change marker type of the selected edge
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

    // return data if label in labelDataMap
    const getLabelData = (label: string) => {
        if(label in labelDataMap) {
            return labelDataMap[label];
        }
        return null;
    }

    // set label data if exists, or add to nodeLabelData if not
    const setLabelData = (label: string, data: NodeData) => {
        setLabelDataMap(prevMap => ({
            ...prevMap,
            [label]: data
        }));
    }

    const renderOutputWindow = () => {
        return <OutputWindow onClose={() => setShowOutputWindow(false)} windowSettings={outputWindowSettings} setWindowSettings={setOutputWindowSettings} />;
    };

    const getSelectedNodeLabelData = () => {
        const node = getSelectedNode();
        if(node)
            return getLabelData(node.data.label)
    }

    return (
        <>
            {/* load marker end svgs */}
            <RepressMarker />
            <PromoteMarker /> 

            {/* TOP MENU FUNCTION BUTTONS */}
            <Ribbon 
                nodes={nodes} setNodes={setNodes}
                edges={edges} setEdges={setEdges}
                showOutputWindow={showOutputWindow} setShowOutputWindow={setShowOutputWindow}
                circuitSettings={circuitSettings}
            />
            
            <div className="bottom-container">
                <PanelGroup className="circuit-builder-container" direction="horizontal">
                {/* Left Pane (Toolbox + Properties Window) */}
                    <Panel className="left-pane min-w-128" defaultSize={30} maxSize={50}>
                        <PanelGroup direction="vertical">
                            <Panel className="toolbox-container" defaultSize={70} minSize={30} maxSize={90}>
                                <Toolbox
                                    labels={Object.keys(labelDataMap)}
                                    getLabelData={getLabelData}
                                />
                            </Panel>
                            <PanelResizeHandle className="resize-handle-horizontal" />
                            <Panel className="properties-window" defaultSize={30} minSize={30} maxSize={90}>
                                <h1 className={`m-0`}>Properties Window</h1>
                                {(selectedNodeId || selectedEdgeId) && <PropertiesWindow
                                    key={`${selectedNodeId || ''}-${selectedEdgeId || ''}`}
                                    changeMarkerType={changeMarkerType}
                                    changeLabelData={changeLabelData}
                                    changeNodeData={changeNodeData}
                                    selectedEdgeId={selectedEdgeId}
                                    selectedNodeId={selectedNodeId}
                                    selectedNode={getSelectedNode()}
                                    selectedNodeData={getSelectedNodeLabelData()}
                                />}
                            </Panel>
                        </PanelGroup>
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
