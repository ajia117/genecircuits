import React, { createContext, useContext, ReactNode } from 'react';
import { useWindowState } from '../hooks';

const WindowStateContext = createContext<ReturnType<typeof useWindowState> | null>(null);

export const WindowStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const windowState = useWindowState();
  return (
    <WindowStateContext.Provider value={windowState}>
      {children}
    </WindowStateContext.Provider>
  );
};

export const useWindowStateContext = () => {
  const context = useContext(WindowStateContext);
  if (!context) {
    throw new Error('useWindowStateContext must be used within a WindowStateProvider');
  }
  return context;
}; 