import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { Panel as ReactFlowPanel } from '@xyflow/react';
import { X, Maximize2, Minimize2, Move, RefreshCw, Download } from 'lucide-react';
import {
    Flex,
    Text,
    IconButton,
    Tooltip,
} from "@radix-ui/themes"
import './OutputWindowStyles.css';
import { useCircuitContext, useHillCoefficientContext, useWindowStateContext } from '../../context';
import { fetchOutput, formatBackendJson } from '../../utils';
import CircuitDataType from "../../types/CircuitDataType";
import WindowSettingsType from "../../types/WindowSettingsType";

const OutputWindow = () =>  {

    const {
        setShowOutputWindow,
        outputWindowSettings,
        setOutputWindowSettings,

        outputData,
    } = useWindowStateContext();

    const [isMaximized, setIsMaximized] = useState(false);
    const [preMaximizeSettings, setPreMaximizeSettings] = useState(null);
    const { nodes, edges, proteins } = useCircuitContext();
    const { hillCoefficients } = useHillCoefficientContext();
    const { circuitSettings, setOutputData } = useWindowStateContext();


    const handleMaximizeToggle = () => {
        if (isMaximized) {
            setOutputWindowSettings(preMaximizeSettings);
            setIsMaximized(false);
        } else {
            setPreMaximizeSettings({...outputWindowSettings});

            const maxWidth = window.innerWidth * 0.95;
            const maxHeight = window.innerHeight * 0.9;
            const x = window.innerWidth * 0.025;
            const y = window.innerHeight * 0.05;

            setOutputWindowSettings({
                width: maxWidth,
                height: maxHeight,
                x: x,
                y: y
            });

            setIsMaximized(true);
        }
    };

    const handleRerunSimulation = async () => {
        const circuitJson: CircuitDataType = formatBackendJson(circuitSettings, nodes, edges, proteins, hillCoefficients);
        const res = await fetchOutput(circuitJson);
        if ('type' in res && res.type === 'image') {
            setOutputData(res);
        } else {
            setOutputData(null);
        }
    };

    const handleDownloadOutput = () => {
        if (outputData && outputData.data) {
            const a = document.createElement('a');
            a.href = outputData.data;
            a.download = 'simulation_output.png';
            a.click();
        }
    };

    return (
        <ReactFlowPanel>
            <Rnd
                default={{
                    x: outputWindowSettings.x,
                    y: outputWindowSettings.y,
                    width: outputWindowSettings.width,
                    height: outputWindowSettings.height,
                }}
                size={{
                    width: outputWindowSettings.width,
                    height: outputWindowSettings.height
                }}
                position={{
                    x: outputWindowSettings.x,
                    y: outputWindowSettings.y
                }}
                minWidth={400}
                minHeight={300}
                bounds="window"
                dragHandleClassName="drag-handle"
                className="output-overlay"
                onDragStop={(_, data) => {
                    setOutputWindowSettings((prev: WindowSettingsType) => ({
                        ...prev,
                        x: data.x,
                        y: data.y
                    }));
                }}
                onResize={(_, __, ref, ___, position) => {
                    const newSettings = {
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        x: position.x,
                        y: position.y,
                    };
                    setOutputWindowSettings(newSettings);
                }}
            >
                <Flex direction="column" height="100%">
                    {/* HEADER W/ DRAG HANDLE */}
                    <Flex direction="row" align="center" justify="between" px="4" py="3" className="drag-handle">
                        <Flex direction="row" align="center" gap="2" className="title-section">
                            <Move size={16} strokeWidth={2} color="var(--accent-9)"/>
                            <Text size="3" weight="bold">Simulation Output</Text>
                        </Flex>

                        <Flex direction="row" justify="center" align="center" gap="3">
                            <Tooltip content="Export Output">
                                <IconButton variant="ghost" onClick={handleDownloadOutput}>
                                    <Download size={16} strokeWidth={2} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content="Refresh">
                                <IconButton variant="ghost" onClick={handleRerunSimulation}>
                                    <RefreshCw size={16} strokeWidth={2} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content={isMaximized ? "Restore" : "Maximize"}>
                                <IconButton
                                    variant="ghost"
                                    onClick={handleMaximizeToggle}
                                >
                                    {isMaximized ?
                                        <Minimize2 size={16} strokeWidth={2} /> :
                                        <Maximize2 size={16} strokeWidth={2} />
                                    }
                                </IconButton>
                            </Tooltip>
                            <IconButton variant="ghost" onClick={() => setShowOutputWindow(false)}>
                                <X size={16} strokeWidth={2} />
                            </IconButton>
                            
                        </Flex>
                    </Flex>
                

                {/* OUTPUT CONTENT */}
                {outputData ? (
                    <Flex direction="column" justify="center" px="4" py="3" gap="3" className="content-area" height="100%">
                        <img
                            src={outputData.data}
                            alt="Simulation Output"
                            className="output-image"
                        />
                    </Flex>
                ) : (
                    <Flex direction="column" justify="center" align="center" p="4" className="content-area" height="100%">
                        <Text style={{ color: 'var(--gray-a9)', textAlign: 'center', fontSize: '13px' }}>
                            No simulation output available. Run a simulation to see results here.
                        </Text>
                    </Flex>
                )}
                </Flex>
            </Rnd>
        </ReactFlowPanel>
    );
}
export default OutputWindow;