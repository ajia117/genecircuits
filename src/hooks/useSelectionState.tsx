// hooks/useSelectionState.tsx
import { useState, useCallback } from 'react';

export function useSelectionState() {
    // State for tracking selected elements
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
    const [editingProtein, setEditingProtein] = useState<any | null>(null);

    const resetSelectedStateData = useCallback(() => {
        setSelectedEdgeId(null);
        setSelectedNodeId(null);
        setSelectedNodeType(null);
        setEditingProtein(null);
    }, []);

    const hasSelection = useCallback(() => {
        return selectedNodeId !== null || selectedEdgeId !== null;
    }, [selectedNodeId, selectedEdgeId]);

    const selectNode = useCallback((nodeId: string, nodeType: string | null) => {
        resetSelectedStateData();
        setSelectedNodeId(nodeId);
        setSelectedNodeType(nodeType);
    }, [resetSelectedStateData]);

    const selectEdge = useCallback((edgeId: string) => {
        resetSelectedStateData();
        setSelectedEdgeId(edgeId);
    }, [resetSelectedStateData]);

    return {
        selectedEdgeId,
        selectedNodeId,
        selectedNodeType,
        editingProtein,

        setEditingProtein,

        resetSelectedStateData,
        hasSelection,
        selectNode,
        selectEdge
    };
}