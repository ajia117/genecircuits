import React from "react";
import { Rnd } from "react-rnd";
import { Panel as ReactFlowPanel } from '@xyflow/react'; 
import './OutputWindowStyles.css'

export default function OutputWindow({ onClose }: { onClose: () => void }) {
    return (

        <ReactFlowPanel>
            <Rnd
                default={{
                    x: 400,
                    y: 100,
                    width: 300,
                    height: 200,
                }}
                minWidth={300}
                minHeight={200}
                bounds="window"
                dragHandleClassName="drag-handle"
                className="output-overlay"
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
                    </div>
                    </div>
                
            </Rnd>
        </ReactFlowPanel>
    );
}
