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
import { HillCoefficientData, ProteinData } from "./types";
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
import {ApplyCircuitTemplateProps, CircuitTemplate} from "./types";
import { useCircuitState, useSelectionState, useHillCoefficients, useWindowState } from "./hooks";


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

    const circuit = useCircuitState();
    const {
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        proteins, setProteins, getProteinData, setProteinData,
        usedProteins, setUsedProteins,
        nodeIdRef, gateIdRef, getId
    } = circuit;


    const selection = useSelectionState();
    const {
        // State
        selectedEdgeId,
        selectedNodeId,
        selectedNodeType,
        editingProtein,

        // Setters
        setEditingProtein,

        // Utility functions
        resetSelectedStateData,
        selectNode,
        selectEdge
    } = selection;

    const hillCoeffs = useHillCoefficients(usedProteins);
    const {
        hillCoefficients,
        setHillCoefficients
    } = hillCoeffs;

    const windowState = useWindowState();
    const {
        // Output window
        showOutputWindow,
        setShowOutputWindow,
        outputWindowSettings,
        setOutputWindowSettings,

        // Hill coefficient matrix
        showHillCoeffMatrix,
        setShowHillCoeffMatrix,

        // Tab state
        activeTab,
        setActiveTab,

        // Output data
        outputData,
        setOutputData,

        // Circuit settings
        circuitSettings,
        setCircuitSettings
    } = windowState;

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
            setNodes(importedNodes ?? []);
            setEdges(importedEdges ?? []);
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


    // Returns entire Node object for the selected node (includes node ID)
    const getSelectedNode = () => {
        return nodes.find(node => node.id === selectedNodeId) as Node<ProteinData>;
    };

    // Returns protein data from the selected node
    const getSelectedProteinData = () => {
        const node = getSelectedNode();
        if(node)
            return getProteinData(node.data.label)
    }

    // Returns data from the selected edge
    const getSelectedEdgeData = () => {
        return edges.find(edge => edge.id === selectedEdgeId) ?? null;
    };

    // Function to change edge type of the selected edge
    const changeEdgeType = useCallback((markerType: string) => {
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

            let newNode: Node;
    
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
                    data: {},
                };
            }
            setNodes((nds) => [...nds, newNode]);
        }, [screenToFlowPosition, setNodes, setProteinData]);

    // Initializes the hillCoefficients array values when new usedProteins list is updated
    useEffect(() => {
        const updated: HillCoefficientData[] = [];

        const labels = Array.from(usedProteins).sort();

        labels.forEach((source) => {
            labels.forEach((target) => {
            const id = `${source}-${target}`;
            const alreadyExists = hillCoefficients.some(h => h.id === id);
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
                                      setProteins
                                  }: ApplyCircuitTemplateProps): void => {
        // Track original ID to new ID mapping
        const idMap: {[originalId: string]: string} = {};

        // Create new nodes with updated IDs and positions
        const newNodes: Node[] = template.nodes.map(node => {
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
        const newEdges: Edge[] = template.edges.map(edge => {
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
        setNodes((prevNodes: Node[]) => [...prevNodes, ...newNodes]);
        setEdges((prevEdges: Edge[]) => [...prevEdges, ...newEdges]);
        setProteins(() => mergedProteins);
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
        });
    }, [nodes, edges, proteins, nodeIdRef, gateIdRef, setNodes, setEdges, setProteins]);

    // Display output window
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
                showHillCoefficientMatrix={showHillCoeffMatrix} 
                setShowHillCoefficientMatrix={setShowHillCoeffMatrix}
                hillCoefficients={hillCoefficients}
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
                    <Panel className="left-pane min-w-128" defaultSize={30} maxSize={50}>
                        <div className="flex flex-col h-full">
                            {/* Tab Navigation */}
                            <Tabs.Root defaultValue="toolbox" value={activeTab} onValueChange={setActiveTab} className="h-full">
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
                                        <Toolbox
                                            proteins={proteins}
                                            setProteinData={setProteinData}
                                            getProteinData={getProteinData}
                                            editingProtein={editingProtein}
                                            setEditingProtein={setEditingProtein}
                                            setActiveTab={setActiveTab}
                                        />
                                    </Tabs.Content>

                                    {/* PROPERTIES */}
                                    <Tabs.Content value="properties">
                                        <PropertiesWindow 
                                            selectedNodeId={selectedNodeId}
                                            selectedNodeType={selectedNodeType}
                                            selectedEdgeId={selectedEdgeId}
                                            proteinData={getSelectedProteinData()}
                                            edgeData={getSelectedEdgeData()}
                                            setProteinData={setProteinData}
                                            setEdgeType={changeEdgeType}
                                            editingProtein={editingProtein}
                                            setEditingProtein={setEditingProtein}
                                            setActiveTab={setActiveTab}
                                        />
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
