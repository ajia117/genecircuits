import React, { createContext, useContext, useRef, ReactNode } from 'react';

// Define the context type
type ReactFlowContextType = {
    reactFlowInstance: React.RefObject<any> | null;
};

// Create the context with a default value
const ReactFlowContext = createContext<ReactFlowContextType>({
    reactFlowInstance: null,
});

// Create a provider component
type ReactFlowProviderProps = {
    children: ReactNode;
};

export const ReactFlowProvider = ({ children }: ReactFlowProviderProps) => {
    const reactFlowInstance = useRef(null);

    return (
        <ReactFlowContext.Provider value={{ reactFlowInstance }}>
            {children}
        </ReactFlowContext.Provider>
    );
};

// Create a hook to use the context
export const useReactFlowContext = () => useContext(ReactFlowContext);

export default ReactFlowContext;