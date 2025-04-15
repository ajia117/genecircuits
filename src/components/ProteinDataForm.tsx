import { Dispatch, SetStateAction } from "react";
import NodeData from "../types/NodeData";
import {
    Flex,
    TextField,
    Text,
    SegmentedControl, 
    Slider, 
} from "@radix-ui/themes"

interface ProteinDataProps {
    mode: 'edit' | 'create'
    proteinData: NodeData,
    setProteinData: Dispatch<SetStateAction<NodeData>>;
}

const ProteinDataForm: React.FC<ProteinDataProps> = ({
    mode,
    proteinData,
    setProteinData
}: ProteinDataProps) => {

    const numericProps: { key: keyof NodeData; label: string; min: number; max: number; step: number }[] = [
        { key: 'initialConcentration', label: 'Initial Concentration', min: 0, max: 100, step: 1 },
        { key: 'lossRate', label: 'Loss Rate', min: 0, max: 5, step: 0.1 },
        { key: 'beta', label: 'Beta', min: 0, max: 10, step: 0.1 },
        // { key: 'delay', label: 'Delay', min: 0, max: 20, step: 1 }
    ];

    return (
        <>
            {mode === "create" ?
                <Flex direction="column" gap="2">
                    <Text as="div" weight="bold">Protein Name</Text>
                    <TextField.Root
                        placeholder="e.g., GFP, LacI"
                        type="text"
                        value={proteinData.label ?? ""}
                        onChange={(e) =>
                            setProteinData({ ...proteinData, label: e.target.value })
                        }
                    />
                </Flex>
            :
                <Flex direction="column">
                    <Text weight="bold" size="4">Protein Properties</Text>
                    <Text as="div" weight="regular" color="gray">Editing: <Text weight="regular" color="gray" >{proteinData.label}</Text></Text>
                </Flex>
            }
            {/* <Flex direction="column" gap="2">
                <Text as="div" weight="bold">Protein Type</Text>
                <SegmentedControl.Root defaultValue="pulse"> 
                    <SegmentedControl.Item value="pulse">Pulse</SegmentedControl.Item>
                    <SegmentedControl.Item value="steady-state">Steady State</SegmentedControl.Item>
                </SegmentedControl.Root>
            </Flex> */}

            {/* Dynamically generated sliders and fields */}
            {numericProps.map(({ key, label, min, max, step }) => {
                const rawValue = proteinData[key];
                const numericValue = typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue : "";

                return (
                    <Flex direction="column" gap="2" key={key}>
                        <Flex direction="row" justify="between" align="center">
                            <Text as="div" weight="bold">{label}</Text>
                            <TextField.Root
                                type="number"
                                style={{ maxWidth: '100px' }}
                                value={numericValue}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setProteinData({
                                        ...proteinData,
                                        [key]: val === "" ? undefined : parseFloat(val)
                                    });
                                }}
                            />
                        </Flex>
                        <Slider
                            min={min}
                            max={max}
                            step={step}
                            value={[typeof numericValue === "number" ? numericValue : 0]}
                            onValueChange={(value) =>
                                setProteinData({
                                    ...proteinData,
                                    [key]: value[0]
                                })
                            }
                        />
                    </Flex>
                );
            })}

            {/* Num inputs/outputs */}
            <Flex direction="row" gap="2">
                <Flex direction="column" gap="2">
                    <Text as="div" weight="bold">Inputs</Text>
                    <TextField.Root
                        type="number"
                        value={
                            typeof proteinData.inputs === 'number' && !isNaN(proteinData.inputs)
                                ? proteinData.inputs
                                : ""
                        }
                        onChange={(e) => {
                            const val = e.target.value;
                            setProteinData({
                                ...proteinData,
                                inputs: val === "" ? undefined : parseInt(val)
                            });
                        }}
                    />
                </Flex>
                <Flex direction="column" gap="2">
                    <Text as="div" weight="bold">Outputs</Text>
                    <TextField.Root
                        type="number"
                        value={
                            typeof proteinData.outputs === 'number' && !isNaN(proteinData.outputs)
                                ? proteinData.outputs
                                : ""
                        }
                        onChange={(e) => {
                            const val = e.target.value;
                            setProteinData({
                                ...proteinData,
                                outputs: val === "" ? undefined : parseInt(val)
                            });
                        }}
                    />
                </Flex>
            </Flex>
        </>
    )
}

export default ProteinDataForm;