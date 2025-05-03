import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
  } from 'react';
  import { ProteinData } from '../types';
  
  // ---------- Internal Hook ----------
  function useSelectionStateInternal() {
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
    const [editingProtein, setEditingProtein] = useState<ProteinData | null>(null);
  
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
  
  export type SelectionState = ReturnType<typeof useSelectionStateInternal>;
  
  // ---------- Context + Provider ----------
  const SelectionStateContext = createContext<SelectionState | null>(null);
  
  export const SelectionStateProvider = ({ children }: { children: ReactNode }) => {
    const state = useSelectionStateInternal();
    return (
      <SelectionStateContext.Provider value={state}>
        {children}
      </SelectionStateContext.Provider>
    );
  };
  
  export const useSelectionStateContext = (): SelectionState => {
    const context = useContext(SelectionStateContext);
    if (!context) {
      throw new Error('useSelectionStateContext must be used within a SelectionStateProvider');
    }
    return context;
  };
  