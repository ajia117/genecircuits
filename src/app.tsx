import { createRoot } from 'react-dom/client';
import './index.css';
import CircuitBuilderFlow from "./CircuitBuilderFlow";
import { ReactFlowProvider } from "@xyflow/react";
import { ToolboxProvider } from "./context";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { CircuitProvider, SelectionStateProvider, WindowStateProvider, HillCoefficientProvider, useCircuitContext } from './hooks';
import React, { useEffect, useState } from 'react';
import {AlertProvider} from "./components/Alerts/AlertProvider";
import LoadingScreen from './LoadingScreen';

const rootElement = document.getElementById('root');

function ProvidersWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CircuitProvider>
            <AlertProvider>
                <SelectionStateProvider>
                    <WindowStateProvider>
                        <HillCoefficientProviderWrapper>
                            {children}
                        </HillCoefficientProviderWrapper>
                    </WindowStateProvider>
                </SelectionStateProvider>
            </AlertProvider>
        </CircuitProvider>
    );
}

function HillCoefficientProviderWrapper({ children }: { children: React.ReactNode }) {
    const { usedProteins } = useCircuitContext();
    return <HillCoefficientProvider usedProteins={usedProteins}>{children}</HillCoefficientProvider>;
}

function AppContent() {
    const [backendReady, setBackendReady] = useState<boolean | null>(null);

    useEffect(() => {
        window.electron.getBackendStatus().then((status: boolean) => {
            if (status) {
                setBackendReady(true);
            }
        });
        window.electron.onBackendReady((ready: boolean) => {
            setBackendReady(ready);
        });

        return () => {
            // Cannot removeListener since preload only gave us onBackendReady as a wrapper
        };
    }, []);

    if (backendReady === null) return <LoadingScreen />;
    if (!backendReady) return <div>Error starting backend server</div>;

    return <CircuitBuilderFlow />;
}


if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ReactFlowProvider>
            <ToolboxProvider>
                <Theme appearance='light' accentColor='jade' radius='large' scaling='95%'>
                    <ProvidersWrapper>
                        {/* <CircuitBuilderFlow /> */}
                        {/* <ThemePanel /> */}
                        <AppContent />
                    </ProvidersWrapper>
                </Theme>
            </ToolboxProvider>
        </ReactFlowProvider>
    );
} else {
    console.error("Root element not found!");
}
