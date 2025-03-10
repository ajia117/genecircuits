import React, { memo } from 'react';
import * as XYFlow from '@xyflow/react';
import { Position } from '@xyflow/react';
import OrGate from "../../assets/OrGate";

const OrGateNode = memo(() => {
    const handleLeftOffset = 2;
    const handleRightOffset = -4;

    return (
        <div className="relative bg-white ">
            {/* Input Handles */}
            <XYFlow.Handle
                key={`input-1`}
                type="target"
                position={Position.Left}
                id={`input-1`}
                style={{
                    'left': handleLeftOffset, // Increased offset for output handles
                    top: 'calc(50% + 17px)',
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
                    'left': handleLeftOffset, // Increased offset for output handles
                    top: 'calc(50% - 21px)',
                    transform: 'translateY(-50%)',
                    background: 'black',
                    zIndex: 10 // Ensure handles are above text
                }}
            />

            <OrGate />

            {/* Output Handle */}
            <XYFlow.Handle
                key={`output-1`}
                type="source"
                position={Position.Right}
                id={`output-1`}
                style={{
                    'right': handleRightOffset,
                    top: 'calc(50% - 3px)',
                    transform: 'translateY(-50%)',
                    background: 'black',
                    zIndex: 10 // Ensure handles are above text
                }}
            />
        </div>
    );
});

export default OrGateNode;