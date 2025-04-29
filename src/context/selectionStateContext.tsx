import React, { createContext, useContext, ReactNode } from 'react';
import { useSelectionState } from '../hooks/useSelectionState';

interface SelectionStateContextType extends ReturnType<typeof useSelectionState> {}

const SelectionStateContext = createContext<SelectionStateContextType | null>(null);

export const SelectionStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const selectionState = useSelectionState();
  return (
    <SelectionStateContext.Provider value={selectionState}>
      {children}
    </SelectionStateContext.Provider>
  );
};

export const useSelectionStateContext = () => {
  const context = useContext(SelectionStateContext);
  if (!context) {
    throw new Error('useSelectionStateContext must be used within a SelectionStateProvider');
  }
  return context;
}; 