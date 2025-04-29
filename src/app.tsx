import { createRoot } from 'react-dom/client';
import './index.css';
import CircuitBuilderFlow from "./CircuitBuilderFlow";
import { ReactFlowProvider } from "@xyflow/react";
import { ToolboxProvider } from "./components/Toolbox/ToolboxContext";
import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { CircuitProvider, SelectionStateProvider, WindowStateProvider, HillCoefficientProvider, useCircuitContext } from './context';
import React from 'react';

const rootElement = document.getElementById('root');

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CircuitProvider>
            <SelectionStateProvider>
                <WindowStateProvider>
                    <HillCoefficientProviderWrapper>
                        {children}
                    </HillCoefficientProviderWrapper>
                </WindowStateProvider>
            </SelectionStateProvider>
        </CircuitProvider>
    );
}

function HillCoefficientProviderWrapper({ children }: { children: React.ReactNode }) {
    const { usedProteins } = useCircuitContext();
    return <HillCoefficientProvider usedProteins={usedProteins}>{children}</HillCoefficientProvider>;
}

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ReactFlowProvider>
            <ToolboxProvider>
                <Theme appearance='light' accentColor='jade' radius='large' scaling='95%'>
                    <ProvidersWrapper>
                        <CircuitBuilderFlow />
                        {/* <ThemePanel /> */}
                    </ProvidersWrapper>
                </Theme>
            </ToolboxProvider>
        </ReactFlowProvider>
    );
} else {
    console.error("Root element not found!");
}
