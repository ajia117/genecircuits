import ProteinData from "../types/ProteinData";
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
    onCreate: (newData: ProteinData) => void;
}  

export default function CreateProteinWindow({ open, onOpenChange, onCreate }: ProteinWindowProps) {
    const genericNodeData: ProteinData = {
        label: null,
        initialConcentration: 1,
        lossRate: 1,
        beta: 1,
        // delay: 0,
        inputs: 1,
        outputs: 1
    };
    const [newProteinData, setNewProteinData] = useState<ProteinData>(genericNodeData);

    // const numericProps: { key: keyof ProteinData; label: string; min: number; max: number; step: number }[] = [
    //     { key: 'initialConcentration', label: 'Initial Concentration', min: 0, max: 100, step: 1 },
    //     { key: 'lossRate', label: 'Loss Rate', min: 0, max: 5, step: 0.1 },
    //     { key: 'beta', label: 'Beta', min: 0, max: 10, step: 0.1 },
    //     // { key: 'delay', label: 'Delay', min: 0, max: 20, step: 1 }
    // ];

    const handleCancel = () => {
        setNewProteinData(genericNodeData)
    }

    const handleCreate = () => {
        if (!newProteinData.label || newProteinData.label.trim() === '') {
            alert("Protein label is required");
            return;
        } 
        else if (newProteinData.inputs === 0) { newProteinData.inputs = 1 }
        else if (newProteinData.outputs === 0) { newProteinData.outputs = 1 }

      
        onCreate(newProteinData);
        setNewProteinData(genericNodeData); // reset for next time
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
                    <ProteinDataForm mode="create" proteinData={newProteinData} setProteinData={setNewProteinData} />
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