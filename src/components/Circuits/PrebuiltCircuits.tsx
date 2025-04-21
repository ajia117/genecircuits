import React from 'react';
import { Node, Edge } from '@xyflow/react';
import { ProteinData } from '../../types';
import {
    Box,
    Text,
    Flex,
    Grid,
    Button,
    Tooltip
} from '@radix-ui/themes';
import {
    Layers,
    Plus
} from 'lucide-react';

// Define interface for a circuit template
interface CircuitTemplate {
    id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
    proteins: {[label: string]: ProteinData};
}

// Props for the PrebuiltCircuits component
interface PrebuiltCircuitsProps {
    applyCircuitTemplate: (template: CircuitTemplate) => void;
}

// Prebuilt circuit templates
const circuitTemplates: CircuitTemplate[] = [
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
    }
];

const PrebuiltCircuits: React.FC<PrebuiltCircuitsProps> = ({ applyCircuitTemplate }) => {
    return (
        <Flex direction="column" gap="4">
            <Text size="4" weight="bold">Prebuilt Circuit Templates</Text>
            <Text size="2" color="gray">
                Select a prebuilt circuit to add it to your workspace. These templates can help
                you get started with common genetic circuit patterns.
            </Text>

            <Grid columns="1" gap="3" mt="2">
                {circuitTemplates.map((template) => (
                    <Box
                        key={template.id}
                        style={{
                            border: '1px solid var(--gray-a6)',
                            borderRadius: 'var(--radius-3)',
                            padding: '1rem',
                            backgroundColor: 'var(--color-surface)',
                            transition: 'background-color 0.2s ease',
                        }}
                        className="circuit-template-item"
                    >
                        <Flex direction="row" justify="between" align="center">
                            <Flex direction="column" gap="1">
                                <Flex align="center" gap="2">
                                    <Text weight="medium" size="3">{template.name}</Text>
                                </Flex>
                                <Text size="2" color="gray">{template.description}</Text>
                                <Flex gap="2" mt="2">
                                    <Text size="1" color="gray">
                                        <Layers size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                        {template.nodes.length} nodes
                                    </Text>
                                </Flex>
                            </Flex>

                            <Tooltip content="Add to workspace">
                                <Button
                                    variant="soft"
                                    onClick={() => applyCircuitTemplate(template)}
                                >
                                    <Plus size={16} />
                                    Add
                                </Button>
                            </Tooltip>
                        </Flex>
                    </Box>
                ))}
            </Grid>
        </Flex>
    );
};

export default PrebuiltCircuits;