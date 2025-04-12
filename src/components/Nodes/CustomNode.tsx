import React, { memo } from 'react';
import type { Node, NodeProps } from '@xyflow/react';
import * as XYFlow from '@xyflow/react';
import { Position } from '@xyflow/react';

interface CustomNodeProps extends Record<string, unknown> {
    label: string;
    inputs: number;
    outputs: number;
}

type CustomNodeData = Node<CustomNodeProps>;

const CustomNode = memo(({ id, data }: NodeProps<CustomNodeData>) => {
    const nodeData = {
        label: data?.label ?? "Unnamed",
        inputs: data?.inputs ?? 1,
        outputs: data?.outputs ?? 1,
    };
    
    // Get position for multiple handles
    const getHandleStyle = (index: number, total: number, isInput: boolean) => {
        const handleSize = 0;
        const handleOffset = -4;
        if (total <= 1) {
            return {
                [isInput ? 'left' : 'right']: handleOffset,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'black',
                zIndex: 10,
                height: `${handleSize}px`,
                width: `${handleSize}px`
            };
        }

        // For multiple handles, distribute them vertically
        const spacing = 7; // pixels between handles
        const totalHeight = (total - 1) * spacing;
        const startOffset = -totalHeight / 2;
        const position = startOffset + (index * spacing);

        return {
            [isInput ? 'left' : 'right']: handleOffset,
            top: 'calc(50% + ' + position + 'px)',
            transform: 'translateY(-50%)',
            background: 'black',
            zIndex: 10,
            height: `${handleSize}px`,
            width: `${handleSize}px`
        };
    };

    return (
        <div className="custom-node">
            <div className="relative px-6 py-2 shadow-md rounded-md bg-white border-2 border-gray-200 w-40">
                {/* Input Handles */}
                {Array.from({length: nodeData.inputs}, (_, i) => (
                    <XYFlow.Handle
                        key={`input-${i}`}
                        type="target"
                        position={Position.Left}
                        id={`input-${i}`}
                        style={getHandleStyle(i, nodeData.inputs, true)}
                        isConnectableStart={true}
                        isConnectableEnd={true}
                        isValidConnection={() => true}  // Allow all connections
                    />
                ))}

                {/* Label with truncation */}
                <div className="my-auto h-full">
                    <label className="text-sm font-medium text-gray-900 text-center w-full truncate mx-2">
                        {nodeData.label}
                    </label>
                </div>

                {/* Output Handles */}
                {Array.from({length: nodeData.outputs}, (_, i) => (
                    <XYFlow.Handle
                        key={`output-${i}`}
                        type="source"
                        position={Position.Right}
                        id={`output-${i}`}
                        style={getHandleStyle(i, nodeData.outputs, false)}
                        isConnectableStart={true}
                        isConnectableEnd={true}
                        isValidConnection={() => true}  // Allow all connections
                    />
                ))}
            </div>
        </div>
    );
});

export default CustomNode;