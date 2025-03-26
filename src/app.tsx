import { createRoot } from 'react-dom/client';
import './index.css';
import CircuitBuilderFlow from "./CircuitBuilderFlow";
import { ReactFlowProvider } from "@xyflow/react";
import { ToolboxProvider } from "./components/Toolbox/ToolboxContext";

const rootElement = document.getElementById('root');

// Check if the element exists to avoid null errors
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ReactFlowProvider>
            <ToolboxProvider>
                <CircuitBuilderFlow />
            </ToolboxProvider>
        </ReactFlowProvider>
    );
} else {
    console.error("Root element not found!");
}
