import React, { memo } from 'react';
import * as XYFlow from '@xyflow/react';
import { Position } from '@xyflow/react';
import AndGate from "../../assets/AndGate";

const AndGateNode = memo(() => {
    const handleOffset = -4;

    return (
        <div className="relative bg-white ">
            {/* Input Handles */}
            <XYFlow.Handle
                key={`input-1`}
                type="target"
                position={Position.Left}
                id={`input-1`}
                style={{
                    'left': handleOffset, // Increased offset for output handles
                    top: 'calc(50% + 18px)',
                    transform: 'translateY(-50%)',
                    background: 'black',
                    zIndex: 10 // Ensure handles are above text
                }}
            />
            <XYFlow.Handle
                key={`input-2`}
                type="target"
                position={Position.Left}
                id={`input-2`}
                style={{
                    'left': handleOffset, // Increased offset for output handles
                    top: 'calc(50% - 22px)',
                    transform: 'translateY(-50%)',
                    background: 'black',
                    zIndex: 10 // Ensure handles are above text
                }}
            />

            <AndGate />

            {/* Output Handle */}
            <XYFlow.Handle
                key={`output-1`}
                type="source"
                position={Position.Right}
                id={`output-1`}
                style={{
                    'right': handleOffset,
                    top: 'calc(50% - 3px)',
                    transform: 'translateY(-50%)',
                    background: 'black',
                    zIndex: 10 // Ensure handles are above text
                }}
            />
        </div>
    );
});

export default AndGateNode;