import React, { memo } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import * as XYFlow from '@xyflow/react';
import { Handle, Position } from '@xyflow/react';

interface CustomNodeProps extends Record<string, unknown> {
    label: string;
    numInCnx: number;
    numOutCnx: number;
}

type CustomNodeData = Node<CustomNodeProps>;

const CustomNode = memo(({ data }: NodeProps<CustomNodeData>) => {
    // Get position for multiple handles
    const getHandleStyle = (index: number, total: number, isInput: boolean) => {
        const handleOffset = -4;
        if (total <= 1) {
            return {
                [isInput ? 'left' : 'right']: handleOffset, // Increased offset for output handles
                top: '50%',
                transform: 'translateY(-50%)',
                background: '#555',
                zIndex: 10 // Ensure handles are above text
            };
        }

        // For multiple handles, distribute them vertically
        const spacing = 10; // pixels between handles
        const totalHeight = (total - 1) * spacing;
        const startOffset = -totalHeight / 2;
        const position = startOffset + (index * spacing);

        return {
            [isInput ? 'left' : 'right']: handleOffset, // Increased offset for output handles
            top: 'calc(50% + ' + position + 'px)',
            transform: 'translateY(-50%)',
            background: '#555',
            zIndex: 10 // Ensure handles are above text
        };
    };

    return (
        <div className={`custom-node`}>
            <div className="relative px-6 py-2 shadow-md rounded-md bg-white border-2 border-gray-200 w-40">
                {/* Input Handles */}
                {Array.from({length: data.numInCnx}, (_, i) => (
                    <XYFlow.Handle
                        key={`input-${i}`}
                        type="target"
                        position={Position.Left}
                        id={`input-${i}`}
                        style={getHandleStyle(i, data.numInCnx, true)}
                    />
                ))}

                {/* Label with truncation */}
                <div className="my-auto h-full">
                    <label className="text-sm font-medium text-gray-900 text-center w-full truncate mx-2">
                        {data.label}
                    </label>
                </div>

                {/* Output Handles */}
                {Array.from({length: data.numOutCnx}, (_, i) => (
                    <XYFlow.Handle
                        key={`output-${i}`}
                        type="source"
                        position={Position.Right}
                        id={`output-${i}`}
                        style={getHandleStyle(i, data.numOutCnx, false)}
                    />
                ))}
            </div>
        </div>
    );
});

export default CustomNode;