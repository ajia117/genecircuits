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
import ProteinDataForm from "./ProteinDataForm";

interface ProteinWindowProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreate: (newData: NodeData) => void;
}  

export default function CreateProteinWindow({ open, onOpenChange, onCreate }: ProteinWindowProps) {
    const genericNodeData: NodeData = {
        label: null,
        initialConcentration: 1,
        lossRate: 1,
        beta: 1,
        // delay: 0,
        inputs: 1,
        outputs: 1
    };
    const [nodeData, setNodeData] = useState<NodeData>(genericNodeData);

    // const numericProps: { key: keyof NodeData; label: string; min: number; max: number; step: number }[] = [
    //     { key: 'initialConcentration', label: 'Initial Concentration', min: 0, max: 100, step: 1 },
    //     { key: 'lossRate', label: 'Loss Rate', min: 0, max: 5, step: 0.1 },
    //     { key: 'beta', label: 'Beta', min: 0, max: 10, step: 0.1 },
    //     // { key: 'delay', label: 'Delay', min: 0, max: 20, step: 1 }
    // ];

    const handleCancel = () => {
        setNodeData(genericNodeData)
    }

    const handleCreate = () => {
        if (!nodeData.label || nodeData.label.trim() === '') {
            alert("Protein label is required");
            return;
        } 
        else if (nodeData.inputs === 0) { nodeData.inputs = 1 }
        else if (nodeData.outputs === 0) { nodeData.outputs = 1 }

      
        onCreate(nodeData);
        setNodeData(genericNodeData); // reset for next time
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange} >
            <Dialog.Content maxWidth="600px">
                <Flex justify="between">
                    <Dialog.Title mt="1">Create New Protein</Dialog.Title>
                    <Dialog.Close><IconButton variant="ghost" color="gray"><X /></IconButton></Dialog.Close>
                </Flex>
                <Dialog.Description mb="3">Define the properties of your new protein. You can modify these parameters later.</Dialog.Description>

                <Grid columns={{initial: "2"}} gap="4">
                    <ProteinDataForm mode="create" proteinData={nodeData} setProteinData={setNodeData} />
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