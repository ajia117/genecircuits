import { CircuitTemplate } from "../../types";

export const repressilator: CircuitTemplate =
{
    id: 'oscillator',
    name: 'Repressilator',
    description: 'A three-gene oscillating circuit',
    nodes: [
        {
            id: "0",
            type: "custom",
            position: {
                x: 245.5,
                y: 59
            },
            data: {
                label: "Gene1",
                initialConcentration: 1,
                lossRate: 1,
                beta: 5,
                inputs: 1,
                outputs: 1,
                inputFunctionType: "steady-state",
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5
                }
            },
            measured: {
                width: 56,
                height: 35
            },
            selected: true,
            dragging: false
        },
        {
            id: "1",
            type: "custom",
            position: {
                x: 179,
                y: 174
            },
            data: {
                label: "Gene2",
                initialConcentration: 1,
                lossRate: 1,
                beta: 5,
                inputs: 1,
                outputs: 1,
                inputFunctionType: "steady-state",
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5
                }
            },
            measured: {
                width: 56,
                height: 35
            },
            selected: false,
            dragging: false
        },
        {
            id: "2",
            type: "custom",
            position: {
                x: 307.5,
                y: 174
            },
            data: {
                label: "Gene3",
                initialConcentration: 1.2,
                lossRate: 1,
                beta: 5,
                inputs: 1,
                outputs: 1,
                inputFunctionType: "steady-state",
                inputFunctionData: {
                    steadyStateValue: 0,
                    timeStart: 0,
                    timeEnd: 1,
                    pulsePeriod: 1,
                    amplitude: 1,
                    dutyCycle: 0.5
                }
            },
            measured: {
                width: 56,
                height: 35
            },
            selected: false,
            dragging: false
        }
    ],
    edges: [
        {
            source: "0",
            sourceHandle: "output-0",
            target: "1",
            targetHandle: "input-0",
            id: "edge-0-1",
            type: "default",
            markerEnd: "repress",
            selected: false
        },
        {
            source: "1",
            sourceHandle: "output-0",
            target: "2",
            targetHandle: "input-0",
            id: "edge-1-2",
            type: "default",
            markerEnd: "repress",
            selected: false
        },
        {
            source: "2",
            sourceHandle: "output-0",
            target: "0",
            targetHandle: "input-0",
            id: "edge-2-0",
            type: "default",
            markerEnd: "repress",
            selected: false
        }
    ],
    proteins: {
        Gene1: {
            label: "Gene1",
            initialConcentration: 1,
            lossRate: 1,
            beta: 5,
            inputs: 1,
            outputs: 1,
            inputFunctionType: "steady-state",
            inputFunctionData: {
                steadyStateValue: 0,
                timeStart: 0,
                timeEnd: 1,
                pulsePeriod: 1,
                amplitude: 1,
                dutyCycle: 0.5
            }
        },
        Gene2: {
            label: "Gene2",
            initialConcentration: 1,
            lossRate: 1,
            beta: 5,
            inputs: 1,
            outputs: 1,
            inputFunctionType: "steady-state",
            inputFunctionData: {
                steadyStateValue: 0,
                timeStart: 0,
                timeEnd: 1,
                pulsePeriod: 1,
                amplitude: 1,
                dutyCycle: 0.5
            }
        },
        Gene3: {
            label: "Gene3",
            initialConcentration: 1.2,
            lossRate: 1,
            beta: 5,
            inputs: 1,
            outputs: 1,
            inputFunctionType: "steady-state",
            inputFunctionData: {
                steadyStateValue: 0,
                timeStart: 0,
                timeEnd: 1,
                pulsePeriod: 1,
                amplitude: 1,
                dutyCycle: 0.5
            }
        }
    },
    hillCoefficients: [
        {
            id: "Gene1-Gene1",
            value: 1
        },
        {
            id: "Gene1-Gene2",
            value: 3
        },
        {
            id: "Gene2-Gene1",
            value: 1
        },
        {
            id: "Gene2-Gene2",
            value: 1
        },
        {
            id: "Gene1-Gene3",
            value: 1
        },
        {
            id: "Gene2-Gene3",
            value: 3
        },
        {
            id: "Gene3-Gene1",
            value: 3
        },
        {
            id: "Gene3-Gene2",
            value: 1
        },
        {
            id: "Gene3-Gene3",
            value: 1
        }
    ]
};

export default repressilator;