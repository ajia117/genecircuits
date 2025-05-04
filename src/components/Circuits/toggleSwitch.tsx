import { CircuitTemplate } from "../../types";

export const toggleSwitch: CircuitTemplate =
{
    id: 'toggle-switch',
    name: 'Toggle Switch',
    description: 'A genetic toggle switch with mutual repression',
    nodes: [
        {
            id: "2",
            type: "custom",
            position: {
                x: 225,
                y: 75
            },
            data: {
                label: "ProteinA",
                initialConcentration: 1,
                lossRate: 0.2,
                beta: 1,
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
                width: 73,
                height: 35
            },
            selected: false
        },
        {
            id: "3",
            type: "custom",
            position: {
                x: 225.5,
                y: 169
            },
            data: {
                label: "ProteinB",
                initialConcentration: 0,
                lossRate: 0.2,
                beta: 1,
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
                width: 73,
                height: 35
            },
            selected: true,
            dragging: false
        }
    ],
    edges: [
        {
            source: "3",
            sourceHandle: "output-0",
            target: "2",
            targetHandle: "input-0",
            id: "edge-3-2",
            type: "default",
            markerEnd: "repress",
            selected: false
        },
        {
            source: "2",
            sourceHandle: "output-0",
            target: "3",
            targetHandle: "input-0",
            id: "edge-2-3",
            type: "default",
            markerEnd: "repress",
            selected: false
        }
    ],
    proteins: {
        ProteinA: {
            label: "ProteinA",
            initialConcentration: 1,
            lossRate: 0.2,
            beta: 1,
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
        ProteinB: {
            label: "ProteinB",
            initialConcentration: 0,
            lossRate: 0.2,
            beta: 1,
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
};

export default toggleSwitch;