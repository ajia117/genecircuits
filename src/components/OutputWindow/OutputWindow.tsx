import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { Panel as ReactFlowPanel } from '@xyflow/react';
import { X, Maximize2, Minimize2, Move } from 'lucide-react';
import './OutputWindowStyles.css';

export default function OutputWindow({ onClose, windowSettings, setWindowSettings, outputData }: { onClose: () => void, windowSettings: any, setWindowSettings: any, outputData: any }) {
    const [dimensions, setDimensions] = useState({
        width: windowSettings.width,
        height: windowSettings.height
    });
    const [isMaximized, setIsMaximized] = useState(false);
    const [preMaximizeSettings, setPreMaximizeSettings] = useState(null);

    useEffect(() => {
        setDimensions({
            width: windowSettings.width,
            height: windowSettings.height
        });
    }, [windowSettings.width, windowSettings.height]);

    const handleMaximizeToggle = () => {
        if (isMaximized) {
            setWindowSettings(preMaximizeSettings);
            setIsMaximized(false);
        } else {
            setPreMaximizeSettings({...windowSettings});

            const maxWidth = window.innerWidth * 0.95;
            const maxHeight = window.innerHeight * 0.9;
            const x = window.innerWidth * 0.025;
            const y = window.innerHeight * 0.05;

            setWindowSettings({
                width: maxWidth,
                height: maxHeight,
                x: x,
                y: y
            });

            setIsMaximized(true);
        }
    };

    return (
        <ReactFlowPanel>
            <Rnd
                default={{
                    x: windowSettings.x,
                    y: windowSettings.y,
                    width: windowSettings.width,
                    height: windowSettings.height,
                }}
                size={{
                    width: windowSettings.width,
                    height: windowSettings.height
                }}
                position={{
                    x: windowSettings.x,
                    y: windowSettings.y
                }}
                minWidth={300}
                minHeight={268 /* size of min image */ + 32 /* padding */}
                bounds="window"
                dragHandleClassName="drag-handle"
                className="output-overlay"
                onDragStop={(_, data) => {
                    setWindowSettings((prev: any) => ({
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
                    setWindowSettings(newSettings);
                    setDimensions({
                        width: ref.offsetWidth,
                        height: ref.offsetHeight
                    });
                }}
            >
                {/* Header with drag handle */}
                <div className="drag-handle">
                    <div className="title-section">
                        <Move size={16} strokeWidth={2} />
                        <h3 className="title">Simulation Output</h3>
                    </div>

                    <div className="button-group">
                        <button
                            onClick={handleMaximizeToggle}
                            className="icon-button"
                            title={isMaximized ? "Restore" : "Maximize"}
                        >
                            {isMaximized ?
                                <Minimize2 size={16} strokeWidth={2} /> :
                                <Maximize2 size={16} strokeWidth={2} />
                            }
                        </button>

                        <button
                            onClick={onClose}
                            className="close-button"
                            title="Close"
                        >
                            <X size={16} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Content area */}
                <div className="content-area">
                    {outputData ? (
                        <img
                            src={outputData.data}
                            alt="Simulation Output"
                            className="output-image"
                        />
                    ) : (
                        <div className="no-data-message">
                            No simulation output available. Run a simulation to see results here.
                        </div>
                    )}
                </div>
            </Rnd>
        </ReactFlowPanel>
    );
}