import React from "react";

export default function OutputWindow({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                    ✖
                </button>
                <h1 className="text-lg font-semibold">Simulation Output</h1>
                <p className="mt-2">Here is the output of the simulation.</p>
            </div>
        </div>
    );
}
