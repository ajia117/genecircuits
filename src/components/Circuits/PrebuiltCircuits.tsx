import React from 'react';
import {CircuitTemplate} from '../../types';
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
import { prebuiltCircuitTemplates } from './prebuiltCircuitTemplates';

// Props for the PrebuiltCircuits component
interface PrebuiltCircuitsProps {
    applyCircuitTemplate: (template: CircuitTemplate) => void;
}

const PrebuiltCircuits: React.FC<PrebuiltCircuitsProps> = ({ applyCircuitTemplate }) => {
    return (
        <Flex direction="column" gap="4">
            <Text size="4" weight="bold">Prebuilt Circuit Templates</Text>
            <Text size="2" color="gray">
                Select a prebuilt circuit to add it to your workspace. These templates can help
                you get started with common genetic circuit patterns.
            </Text>

            <Grid columns="1" gap="3" mt="2">
                {prebuiltCircuitTemplates.map((template: CircuitTemplate) => (
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
                                    onClick={() => {
                                        console.log(template.hillCoefficients)
                                        applyCircuitTemplate(template)
                                    }}
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