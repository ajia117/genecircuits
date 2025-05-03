import { CircuitTemplate } from "../../types";

export const prebuiltCircuitTemplates: CircuitTemplate[] = [
    {
        id: 'toggle-switch',
        name: 'Toggle Switch',
        description: 'A genetic toggle switch with mutual repression',
        nodes: [
            {
                id: '0',
                type: 'custom',
                position: { x: 100, y: 100 },
                data: { label: 'ProteinA' }
            },
            {
                id: '1',
                type: 'custom',
                position: { x: 300, y: 100 },
                data: { label: 'ProteinB' }
            }
        ],
        edges: [
            {
                id: 'edge-0-1',
                source: '0',
                target: '1',
                markerEnd: 'repress'
            },
            {
                id: 'edge-1-0',
                source: '1',
                target: '0',
                markerEnd: 'repress'
            }
        ],
        proteins: {
            'ProteinA': {
                label: 'ProteinA',
                initialConcentration: 1,
                lossRate: 0.2,
                beta: 1,
                inputs: 1,
                outputs: 1,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            },
            'ProteinB': {
                label: 'ProteinB',
                initialConcentration: 0,
                lossRate: 0.2,
                beta: 1,
                inputs: 1,
                outputs: 1,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            }
        }
    },
    {
        id: 'oscillator',
        name: 'Repressilator',
        description: 'A three-gene oscillating circuit',
        nodes: [
            {
                id: '0',
                type: 'custom',
                position: { x: 200, y: 100 },
                data: { label: 'Gene1' }
            },
            {
                id: '1',
                type: 'custom',
                position: { x: 100, y: 200 },
                data: { label: 'Gene2' }
            },
            {
                id: '2',
                type: 'custom',
                position: { x: 300, y: 200 },
                data: { label: 'Gene3' }
            }
        ],
        edges: [
            {
                id: 'edge-0-1',
                source: '0',
                target: '1',
                markerEnd: 'repress'
            },
            {
                id: 'edge-1-2',
                source: '1',
                target: '2',
                markerEnd: 'repress'
            },
            {
                id: 'edge-2-0',
                source: '2',
                target: '0',
                markerEnd: 'repress'
            }
        ],
        proteins: {
            'Gene1': {
                label: 'Gene1',
                initialConcentration: 0,
                lossRate: 0.2,
                beta: 1,
                inputs: 1,
                outputs: 1,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            },
            'Gene2': {
                label: 'Gene2',
                initialConcentration: 0,
                lossRate: 0.2,
                beta: 1,
                inputs: 1,
                outputs: 1,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            },
            'Gene3': {
                label: 'Gene3',
                initialConcentration: 1,
                lossRate: 0.2,
                beta: 1,
                inputs: 1,
                outputs: 1,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            }
        }
    },
    {
        id: 'feedforward-loop',
        name: 'Feed-Forward Loop',
        description: 'A coherent feed-forward loop circuit',
        nodes: [
            {
                id: '0',
                type: 'custom',
                position: { x: 200, y: 50 },
                data: {
                    label: 'Input',
                    inputs: 0,
                    outputs: 2, }
            },
            {
                id: '1',
                type: 'custom',
                position: { x: 100, y: 150 },
                data: { label: 'Intermediate',
                    inputs: 1,
                    outputs: 1, }
            },
            {
                id: '2',
                type: 'custom',
                position: { x: 300, y: 250 },
                data: { label: 'Output',
                    inputs: 1,
                    outputs: 0, }
            },
            {
                id: 'g0',
                type: 'and',
                position: { x: 300, y: 150 },
                data: {}
            }
        ],
        edges: [
            {
                id: 'edge-0-1',
                source: '0',
                sourceHandle: "output-1",
                target: "1",
                targetHandle: "input-0",
                markerEnd: 'promote'
            },
            {
                id: 'edge-0-g0',
                source: '0',
                sourceHandle: "output-0",
                target: "g0",
                targetHandle: "input-2",
                markerEnd: 'promote'
            },
            {
                id: 'edge-1-g0',
                source: '1',
                target: 'g0',
                markerEnd: 'promote'
            },
            {
                id: 'edge-g0-2',
                source: 'g0',
                target: '2',
                markerEnd: 'promote'
            }
        ],
        proteins: {
            'Input': {
                label: 'Input',
                initialConcentration: 0,
                lossRate: 0.1,
                beta: 1,
                inputs: 0,
                outputs: 2,
                inputFunctionType: 'pulse',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 1,
                    timeEnd: 3,
                    pulsePeriod: 10,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            },
            'Intermediate': {
                label: 'Intermediate',
                initialConcentration: 0,
                lossRate: 0.2,
                beta: 1,
                inputs: 1,
                outputs: 1,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            },
            'Output': {
                label: 'Output',
                initialConcentration: 0,
                lossRate: 0.3,
                beta: 1,
                inputs: 1,
                outputs: 0,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            }
        }
    },
    {
        id: 'incoherentfeedforward-loop',
        name: 'Incoherent Feed-Forward Loop',
        description: 'An incoherent feed-forward loop circuit',
        nodes: [
            {
                id: '0',
                type: 'custom',
                position: { x: 200, y: 50 },
                data: {
                    label: 'Input',
                    inputs: 0,
                    outputs: 2, }
            },
            {
                id: '1',
                type: 'custom',
                position: { x: 100, y: 150 },
                data: { label: 'Intermediate',
                    inputs: 1,
                    outputs: 1, }
            },
            {
                id: '2',
                type: 'custom',
                position: { x: 300, y: 250 },
                data: { label: 'Output',
                    inputs: 1,
                    outputs: 0, }
            },
            {
                id: 'g0',
                type: 'and',
                position: { x: 300, y: 150 },
                data: {}
            }
        ],
        edges: [
            {
                id: 'edge-0-1',
                source: '0',
                sourceHandle: "output-1",
                target: "1",
                targetHandle: "input-0",
                markerEnd: 'promote'
            },
            {
                id: 'edge-0-g0',
                source: '0',
                sourceHandle: "output-0",
                target: "g0",
                targetHandle: "input-2",
                markerEnd: 'promote'
            },
            {
                id: 'edge-1-g0',
                source: '1',
                target: 'g0',
                markerEnd: 'repress'
            },
            {
                id: 'edge-g0-2',
                source: 'g0',
                target: '2',
                markerEnd: 'promote'
            }
        ],
        proteins: {
            'Input': {
                label: 'Input',
                initialConcentration: 0,
                lossRate: 0.1,
                beta: 1,
                inputs: 0,
                outputs: 2,
                inputFunctionType: 'pulse',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 1,
                    timeEnd: 3,
                    pulsePeriod: 10,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            },
            'Intermediate': {
                label: 'Intermediate',
                initialConcentration: 0,
                lossRate: 0.2,
                beta: 1,
                inputs: 1,
                outputs: 1,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            },
            'Output': {
                label: 'Output',
                initialConcentration: 0,
                lossRate: 0.3,
                beta: 1,
                inputs: 1,
                outputs: 0,
                inputFunctionType: 'steady-state',
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5,
                }
            }
        }
    }
];
