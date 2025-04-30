import React, { createContext, useContext, ReactNode } from 'react';
import { useCircuitState, CircuitState } from '../hooks/useCircuitState'; // Adjust path as needed

const CircuitContext = createContext<CircuitState | null>(null);

export const CircuitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const circuitState = useCircuitState();

    return (
        <CircuitContext.Provider value={circuitState}>
            {children}
        </CircuitContext.Provider>
    );
};

export const useCircuitContext = () => {
    const context = useContext(CircuitContext);
    if (!context) {
        throw new Error('useCircuitContext must be used within a CircuitProvider');
    }
    return context;
};