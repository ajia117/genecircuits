import NodeData from "../types/NodeData";
import {
    Dialog,
    Flex,
    IconButton,
    Grid,
    Slider,
    TextField,
    Text,
    SegmentedControl,
    Button
} from "@radix-ui/themes"
import {
    X,
    Plus,
} from "lucide-react"
import { useState } from "react";

interface ProteinDataProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}  

export default function CreateProteinWindow({ open, onOpenChange }: ProteinDataProps) {
    const genericNodeData: NodeData = {
        label: null,
        initialConcentration: 1,
        hillCoefficient: 1,
        lossRate: 1,
        beta: 1,
        delay: 0,
        inputs: 1,
        outputs: 1
    };
    const [nodeData, setNodeData] = useState<NodeData>(genericNodeData);

    const numericProps: { key: keyof NodeData; label: string; min: number; max: number; step: number }[] = [
        { key: 'initialConcentration', label: 'Initial Concentration', min: 0, max: 100, step: 1 },
        { key: 'hillCoefficient', label: 'Hill Coefficient', min: 0, max: 4, step: 0.1 },
        { key: 'lossRate', label: 'Loss Rate', min: 0, max: 5, step: 0.1 },
        { key: 'beta', label: 'Beta', min: 0, max: 10, step: 0.1 },
        { key: 'delay', label: 'Delay', min: 0, max: 20, step: 1 }
    ];

    const handleCancel = () => {
        setNodeData(genericNodeData)
    }

    const handleCreate = () => {
        
    }

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content maxWidth="600px">
                <Flex justify="between">
                    <Dialog.Title mt="1">Create New Protein</Dialog.Title>
                    <Dialog.Close><IconButton variant="ghost" color="gray"><X /></IconButton></Dialog.Close>
                </Flex>
                <Dialog.Description mb="3">Define the properties of your new protein. You can modify these parameters later.</Dialog.Description>

                <Grid columns={{initial: "2"}} gap="4">
                    <Flex direction="column" gap="2" mt="4">
                        <Text as="div" weight="bold">Protein Label</Text>
                        <TextField.Root 
                            placeholder="e.g., GFP, LacI"
                            type="text"
                            value={nodeData.label ?? ""}
                            onChange={(e) => setNodeData({...nodeData, label: e.target.value})}
                        />
                    </Flex>
                    <Flex direction="column" gap="2" mt="4">
                        <Text as="div" weight="bold">Protein Type</Text>
                        <SegmentedControl.Root defaultValue="pulse"> 
                            <SegmentedControl.Item value="pulse">Pulse</SegmentedControl.Item>
                            <SegmentedControl.Item value="steady-state">Steady State</SegmentedControl.Item>
                        </SegmentedControl.Root>
                    </Flex>

                    {/* Dynamically generated sliders and fields */}
                    {numericProps.map(({ key, label, min, max, step }) => (
                        <Flex direction="column" gap="2" key={key}>
                            <Flex direction="row" justify="between" align="center">
                                <Text as="div" weight="bold">{label}</Text>
                                <TextField.Root
                                    type="number"
                                    style={{ maxWidth: '100px' }}
                                    value={nodeData[key] as number}
                                    onChange={(e) => setNodeData({...nodeData, [key]: parseFloat(e.target.value) || 0})}
                                />
                            </Flex>
                            <Slider
                                min={min} max={max} step={step}
                                value={[nodeData[key] as number]}
                                onValueChange={(value) => setNodeData({...nodeData, [key]: value[0]})}
                            />
                        </Flex>
                    ))}

                    {/* Num inputs/outputs */}
                    <Flex direction="row" gap="2">
                        <Flex direction="column" gap="2">
                            <Text as="div" weight="bold">Inputs</Text>
                            <TextField.Root 
                                type="number"
                                value={nodeData.inputs}
                                onChange={(e) => setNodeData({...nodeData, inputs: parseInt(e.target.value)})}
                            />
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text as="div" weight="bold">Outputs</Text>
                            <TextField.Root 
                                type="number"
                                value={nodeData.outputs}
                                onChange={(e) => setNodeData({...nodeData, outputs: parseInt(e.target.value)})}
                            />
                        </Flex>
                    </Flex>
                </Grid>

                <Flex justify="end" gap="3" mt="8">
                    <Dialog.Close>
                        <Button variant="surface" color="gray" size="3" onClick={handleCancel}>Cancel</Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button size="3" onClick={handleCreate}><Plus/>Create Protein</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}