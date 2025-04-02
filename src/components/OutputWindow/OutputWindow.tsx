import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { Panel as ReactFlowPanel } from '@xyflow/react'; 
import './OutputWindowStyles.css'

export default function OutputWindow({ onClose, windowSettings, setWindowSettings, outputData }: { onClose: () => void, windowSettings: any, setWindowSettings: any, outputData: any }) {
    const [dimensions, setDimensions] = useState({ width: windowSettings.width, height: windowSettings.height });

    useEffect(() => {
        setDimensions({ width: windowSettings.width, height: windowSettings.height });
    }, [windowSettings.width, windowSettings.height]);

    return (
        <ReactFlowPanel>
            <Rnd
                default={{
                    x: windowSettings.x,
                    y: windowSettings.y,
                    width: windowSettings.width,
                    height: windowSettings.height,
                }}
                minWidth={300}
                minHeight={200}
                bounds="window"
                dragHandleClassName="drag-handle"
                className="output-overlay"
                onDragStop={(_, data) => {
                    setWindowSettings((prev: any) => ({ ...prev, x: data.x, y: data.y })); // Save position
                }}
                onResizeStop={(_, __, ref, ___, position) => {
                    setWindowSettings({
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        x: position.x,
                        y: position.y,
                    }); // Save size and position after resizing
                }}
            >
                {/* Drag Handle */}
                <div className="drag-handle cursor-move bg-gray-800 text-white p-2 flex justify-between">
                    <span className="font-semibold">Simulation Output</span>
                    <button 
                        onClick={onClose} 
                        className="close-button">
                        ✖
                    </button>
                    

                    {/* Output Content */}
                    <div className="flex-1 p-4 overflow-auto">
                        <p>This is where the simulation results will be displayed.</p>
                        {/* {outputData &&
                            <p>{JSON.stringify(outputData)}</p>
                        } */}
                        {outputData ? (
                            <img
                                src={outputData.data}
                                alt="Simulation Output"
                                className="object-contain"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    width: dimensions.width - 20,
                                    height: dimensions.height - 50
                                }}
                            />
                        ) : (
                            <p className="text-center text-gray-400">No simulation output available.</p>
                        )}
                        
                    </div>
                    </div>
                
            </Rnd>
        </ReactFlowPanel>
    );
}
