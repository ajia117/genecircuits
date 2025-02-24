import React from 'react';

import { Handle as HandleComponent, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';

interface CustomNodeProps extends Record<string, unknown> {
    label: string;
    numInCnx: number;
    numOutCnx: number;
}

type CustomNodeData = Node<CustomNodeProps>;

const CustomNode = ({ data }: NodeProps<CustomNodeData>) => {
    // Calculate handle positions based on the number of connections
    const getHandleStyle = (index: number, total: number) => {
        // Calculate position as percentage from left
        const step = 100 / (total + 1);
        const left = step * (index + 1);

        return {
            left: `${left}%`,
            background: '#555',
            // Remove absolute positioning that might interfere
            position: 'relative' as const,
            transform: 'translateX(-50%)'
        };
    };
    console.log(data);

    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
            {/* Input Handles */}
            {Array.from({ length: data.numInCnx }, (_, i) => (
                <HandleComponent
                    key={`input-${i}`}
                    type="target"
                    position={Position.Top}
                    id={`input-${i}`}
                    style={getHandleStyle(i, data.numInCnx)}
                />
            ))}

            {/* Node Content */}
            <div className="flex justify-center items-center">
                <label className="text-sm font-medium text-gray-900">
                    {data.label}
                </label>
            </div>

            {/* Output Handles */}
            {Array.from({ length: data.numOutCnx }, (_, i) => (
                <Handle
                    key={`output-${i}`}
                    type="source"
                    position={Position.Bottom}
                    id={`output-${i}`}
                    style={getHandleStyle(i, data.numOutCnx)}
                />
            ))}
        </div>
    );
};

export default CustomNode;