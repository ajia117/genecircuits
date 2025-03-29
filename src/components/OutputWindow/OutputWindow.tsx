import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { Panel as ReactFlowPanel } from '@xyflow/react'; 
import './OutputWindowStyles.css'

export default function OutputWindow({ onClose, windowSettings, setWindowSettings, outputData }: { onClose: () => void, windowSettings: any, setWindowSettings: any, outputData: any }) {
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
                        <p>{outputData.message}</p>
                    </div>
                    </div>
                
            </Rnd>
        </ReactFlowPanel>
    );
}
