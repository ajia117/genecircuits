import React, {useCallback, useRef, useMemo, useEffect} from "react";
import {
    ReactFlow,
    Background,
    Controls,
    Edge,
    Node,
    Connection,
    useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './index.css';
import { RepressMarker, PromoteMarker } from "./assets";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { syncNodeCounters } from "./utils";
import HillCoefficientData from "./types/HillCoefficientType";
import ProteinData from "./types/ProteinData";
import {
    Toolbox, 
    PropertiesWindow, 
    OutputWindow, 
    Ribbon, 
    AndGateNode, 
    OrGateNode, 
    CustomNode,
    HillCoefficientMatrix,
    PrebuiltCircuits,
    SelfConnectingEdge
} from './components';
import {
    Tabs,
    Box,
    ScrollArea
} from '@radix-ui/themes'
import {ApplyCircuitTemplateProps, CircuitTemplate, AppNode} from "./types";
import { useCircuitContext, useSelectionStateContext, useHillCoefficientContext, useWindowStateContext } from "./hooks";
import hillCoefficientType from "./types/HillCoefficientType";


export default function CircuitBuilderFlow() {
    const reactFlowWrapper = useRef(null);
    const { screenToFlowPosition } = useReactFlow();
    const nodeTypes = useMemo(() => ({
        custom: CustomNode,
        and: AndGateNode,
        or: OrGateNode
    }), []);
    const edgeTypes = useMemo(() => ({
        selfConnecting: SelfConnectingEdge,
    }), []);

    const circuit = useCircuitContext();
    const {
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        proteins, setProteins, setProteinData,
        usedProteins, setUsedProteins,
        nodeIdRef, gateIdRef, getId
    } = circuit;


    const selection = useSelectionStateContext();
    const {
        // Utility functions
        resetSelectedStateData,
        selectNode,
        selectEdge
    } = selection;

    const {
        hillCoefficients,
        setHillCoefficients
    } = useHillCoefficientContext();

    const {
        // Output window
        showOutputWindow,

        // Hill coefficient matrix
        showHillCoeffMatrix,
        setShowHillCoeffMatrix,

        // Tab state
        activeTab,
        setActiveTab,

        // Circuit settings
        setCircuitSettings
    } = useWindowStateContext();

    // Handler for circuit imports
    useEffect(() => {
        const handleCircuitImport = (event: CustomEvent) => {
            const {
                circuitSettings: importedSettings,
                nodes: importedNodes,
                edges: importedEdges,
                proteins: importedProteins
            } = event.detail;
    
            // Replace circuit settings (safe default fallback)
            setCircuitSettings({
                projectName: importedSettings?.projectName ?? "Untitled Project",
                simulationDuration: importedSettings?.simulationDuration ?? 20,
                numTimePoints: importedSettings?.numTimePoints ?? 10
            });

            // Overwrite old data on import
            setNodes((importedNodes ?? []).map((node: AppNode) => {
                if (node.type === 'custom') {
                    // Ensure all ProteinData fields are present
                    return {
                        ...node,
                        data: {
                            label: node.data?.label ?? '',
                            initialConcentration: node.data?.initialConcentration ?? 0,
                            lossRate: node.data?.lossRate ?? 0,
                            beta: node.data?.beta ?? 1,
                            inputs: node.data?.inputs ?? 0,
                            outputs: node.data?.outputs ?? 0,
                            inputFunctionType: node.data?.inputFunctionType ?? '',
                            inputFunctionData: node.data?.inputFunctionData ?? {},
                        }
                    } as AppNode;
                } else {
                    return {
                        ...node,
                        data: null
                    } as AppNode;
                }
            }) as AppNode[]);
            setEdges((importedEdges ?? []).map((edge: Edge) => ({
                ...edge,
                sourceHandle: edge.sourceHandle ?? undefined
            })) as Edge[]);
            setProteins(importedProteins ?? {});
    
            // Sync node ID counters to avoid ID conflict
            syncNodeCounters([...nodes, ...(importedNodes ?? [])]);

            // Reset controller state variables
            resetSelectedStateData();
        };
    
        window.addEventListener("circuitImport", handleCircuitImport as EventListener);
    
        return () => {
            window.removeEventListener("circuitImport", handleCircuitImport as EventListener);
        };
    }, [setNodes, setEdges, setProteins, setCircuitSettings, nodes]);
    

    // Handler for connecting nodes
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds: Edge[]) => {
                const filteredEdges = eds.filter((edge: Edge) => !(edge.source === params.source && edge.target === params.target));
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

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        selectNode(node.id, node.type);
        setActiveTab("properties");
    };
    const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
        selectEdge(edge.id);
        setActiveTab("properties");
    }, [selection, setActiveTab]);
    const onPaneClick = useCallback(() => {
        resetSelectedStateData();
    }, [selection]);

    // Handler for resetting logic when switching tabs
    useEffect(() => {
        if (activeTab !== "properties") {
            resetSelectedStateData();
        }
    }, [activeTab]);


    // Handler for dragging a component from toolbox to workspace
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);
    
    // Handler called when a node is dropped into the React Flow pane
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

            let newNode: AppNode;
    
            if (nodeType === "custom") {
                const rawData = JSON.parse(event.dataTransfer.getData("application/node-data")) as ProteinData;
                delete rawData.id;
                // Remove `id` if present — prevent conflict
                const nodeData = rawData;

                newNode = {
                    id: getId(nodeType),
                    type: nodeType,
                    position,
                    data: nodeData,
                };
        
                if (nodeData.label) {
                    setProteinData(nodeData.label, nodeData);
                    if (!usedProteins.has(nodeData.label)) {
                        const updatedSet = new Set(usedProteins);
                        updatedSet.add(nodeData.label);
                        setUsedProteins(updatedSet);
                    }
                }
            } else { // if logic gate
                newNode = {
                    id: getId(nodeType),
                    type: nodeType,
                    position,
                    data: null,
                };
            }
            setNodes((nds: AppNode[]) => [...nds, newNode]);
        }, [screenToFlowPosition, setNodes, setProteinData, getId, usedProteins, setUsedProteins]);

    // Initializes the hillCoefficients array values when new usedProteins list is updated
    useEffect(() => {
        const updated: HillCoefficientData[] = [];

        const labels = Array.from(usedProteins).sort();

        labels.forEach((source) => {
            labels.forEach((target) => {
            const id = `${source}-${target}`;
            const alreadyExists = hillCoefficients.some((h: HillCoefficientData) => h.id === id);
            if (!alreadyExists) {
                updated.push({ id, value: 1 }); // default value
            }
            });
        });

        if (updated.length > 0) {
            setHillCoefficients(prev => [...prev, ...updated]);
        }
    }, [usedProteins]);

    const applyCircuitTemplate = ({
        template,
        proteins,
        nodeIdRef,
        gateIdRef,
        setNodes,
        setEdges,
        setProteins,
        setHillCoefficients
    }: ApplyCircuitTemplateProps): void => {
        // Track original ID to new ID mapping
        const idMap: {[originalId: string]: string} = {};

        // Create new nodes with updated IDs and positions
        const newNodes: AppNode[] = (template.nodes as AppNode[]).map((node: AppNode) => {
            // Generate new ID based on node type
            const newId: string = node.type === 'custom' ?
                `${nodeIdRef.current++}` :
                `g${gateIdRef.current++}`;

            idMap[node.id] = newId;

            // Calculate position offset to center the template in the visible viewport
            const xOffset = 100;
            const yOffset = 100;

            return {
                ...node,
                id: newId,
                position: {
                    x: node.position.x + xOffset,
                    y: node.position.y + yOffset
                }
            };
        });

        // Create new edges with updated source/target IDs
        const newEdges: Edge[] = (template.edges as Edge[]).map((edge: Edge) => {
            const newSource: string = idMap[edge.source];
            const newTarget: string = idMap[edge.target];

            return {
                ...edge,
                id: `edge-${newSource}-${newTarget}`,
                source: newSource,
                target: newTarget
            };
        });


        // Add the new proteins
        const mergedProteins: {[label: string]: ProteinData} = {...proteins};

        // Handle potential protein label conflicts
        Object.entries(template.proteins).forEach(([label, proteinData]) => {
            mergedProteins[label] = proteinData;
        });

        // Update state
        setNodes((prevNodes: AppNode[]) => [...prevNodes, ...newNodes]);
        setEdges((prevEdges: Edge[]) => [...prevEdges, ...newEdges]);
        setProteins(() => mergedProteins);
        setHillCoefficients((prevCoeffs: hillCoefficientType[]) => [...prevCoeffs, ...template.hillCoefficients]);
    };

    const handleApplyCircuitTemplate = useCallback((template: CircuitTemplate): void => {
        // Call the typed function with all required parameters
        applyCircuitTemplate({
            template,
            proteins,
            nodeIdRef,
            gateIdRef,
            setNodes,
            setEdges,
            setProteins,
            setHillCoefficients
        });
    }, [nodes, edges, proteins, nodeIdRef, gateIdRef, setNodes, setEdges, setProteins]);

    // Display output window
    const renderOutputWindow = () => {
        return <OutputWindow/>;
    };

    return (
        <>
            {/* load marker end svgs */}
            <RepressMarker />
            <PromoteMarker /> 

            {/* TOP MENU FUNCTION BUTTONS */}
            <Ribbon
            />

            {/* HILL COEFFICIENT MATRIX WINDOW */}
            <HillCoefficientMatrix 
                open={showHillCoeffMatrix} 
                onOpenChange={setShowHillCoeffMatrix} 
                usedProteins={usedProteins} 
                hillCoefficients={hillCoefficients}
                setHillCoefficients={setHillCoefficients}
            />

            {/* TOOLBOX AND REACT FLOW */}
            <div className="bottom-container">
                <PanelGroup className="circuit-builder-container" direction="horizontal">
                    {/* Left Pane (Toolbox + Properties Window) */}
                    <Panel className="left-pane min-w-128" defaultSize={30} minSize={23} maxSize={50}>
                        <div className="flex flex-col h-full">
                            {/* Tab Navigation */}
                            <Tabs.Root
                                defaultValue="toolbox"
                                value={activeTab}
                                onValueChange={setActiveTab as (value: string) => void}
                                className="h-full"
                            >
                                <Tabs.List>
                                    <Tabs.Trigger value="toolbox">Toolbox</Tabs.Trigger>
                                    <Tabs.Trigger value="properties">Properties</Tabs.Trigger>
                                    <Tabs.Trigger value="circuits">Circuits</Tabs.Trigger>
                                </Tabs.List>
                            

                                {/* Tab Content */}
                                <ScrollArea
                                    type="scroll"
                                    scrollbars="vertical"
                                    style={{
                                        maxHeight: 'calc(100vh - 100px)',
                                    }}
                                >
                                <Box px="4" mt="6" className="h-full overflow-y-auto">
                                    {/* TOOLBOX */}
                                    <Tabs.Content value="toolbox">
                                        <Toolbox/>
                                    </Tabs.Content>

                                    {/* PROPERTIES */}
                                    <Tabs.Content value="properties">
                                        <PropertiesWindow />
                                    </Tabs.Content>

                                    {/* CIRCUITS */}
                                    <Tabs.Content value="circuits">
                                        <PrebuiltCircuits
                                            applyCircuitTemplate={handleApplyCircuitTemplate}
                                        />
                                    </Tabs.Content>
                                </Box>
                                </ScrollArea>
                            </Tabs.Root>

                            
                        </div>
                    </Panel>

                    <PanelResizeHandle className="resize-handle-vertical"/>

                    {/* Right Pane (circuit building workspace area) */}
                    <Panel className="flow-wrapper" ref={reactFlowWrapper} defaultSize={80} minSize={50} maxSize={90}>
                        {showOutputWindow && renderOutputWindow()}
                        
                        <ReactFlow className="react-flow"
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
