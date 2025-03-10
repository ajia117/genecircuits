import { createRoot } from 'react-dom/client';
import './index.css';
import CircuitBuilderFlow from "./CircuitBuilderFlow";
import { ReactFlowProvider } from "@xyflow/react";
import { ToolboxProvider } from "./components/Toolbox/ToolboxContext";

const root = createRoot(document.body);
root.render(
    <ReactFlowProvider>
        <ToolboxProvider>
            <CircuitBuilderFlow />
        </ToolboxProvider>
    </ReactFlowProvider>
);