import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ProteinData } from "../types";
import {
    Flex,
    TextField,
    Text,
    SegmentedControl, 
    Slider, 
} from "@radix-ui/themes"

interface ProteinDataProps {
    mode: 'edit' | 'create'
    proteinData: ProteinData | null,
    setProteinData: Dispatch<SetStateAction<ProteinData>>;
}

const ProteinDataForm: React.FC<ProteinDataProps> = ({
    mode,
    proteinData,
    setProteinData,
}: ProteinDataProps) => {
    const [inputFunctionType, setInputFunctionType] = useState<'steady-state' | 'pulse'>(proteinData.inputFunctionType);

    const proteinDataProps: { key: keyof ProteinData; label: string; min: number; max: number; step: number }[] = [
        { key: 'initialConcentration', label: 'Initial Concentration', min: 0, max: 100, step: 1 },
        { key: 'lossRate', label: 'Loss Rate', min: 0, max: 5, step: 0.1 },
        { key: 'beta', label: 'Beta', min: 0, max: 10, step: 0.1 },
    ];

    const pulseFunctionDataProps: { key: keyof ProteinData['inputFunctionData']; label: string; min: number; max: number; step: number }[] = [
        { key: 'timeStart', label: 'Pulse Start Time', min: 0, max: 1000, step: 1 },
        { key: 'timeEnd', label: 'Pulse End Time', min: 0, max: 1000, step: 1 },
        { key: 'pulsePeriod', label: 'Pulse Period/Duration (tau)', min: 0, max: 10, step: 0.1 },
        { key: 'amplitude', label: 'Pulse Height', min: 0, max: 100, step: 1 },
        { key: 'dutyCycle', label: 'Duty Cycle', min: 0, max: 1, step: 0.01 },
    ];

    // Display the input function type fields based on user selected type
    const renderInputFunctionTypeFields = () => {
        if (proteinData.inputFunctionType === "steady-state") {
            const numericValue = proteinData.inputFunctionData?.steadyStateValue ?? "";
    
            return (
                <Flex direction="column" gap="2" key={'steadyStateValue'}>
                    <Flex direction="row" justify="between" align="center">
                        <Text as="div" weight="bold">Steady State Value</Text>
                        <TextField.Root
                            type="number"
                            style={{ maxWidth: '100px' }}
                            value={numericValue}
                            onChange={(e) => {
                                const val = e.target.value;
                                setProteinData({
                                    ...proteinData,
                                    inputFunctionData: {
                                        ...proteinData.inputFunctionData,
                                        steadyStateValue: val === "" ? undefined : parseFloat(val)
                                    }
                                });
                            }}
                        />
                    </Flex>
                    <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[typeof numericValue === "number" ? numericValue : 0]}
                        onValueChange={(value) =>
                            setProteinData({
                                ...proteinData,
                                inputFunctionData: {
                                    ...proteinData.inputFunctionData,
                                    steadyStateValue: value[0]
                                }
                            })
                        }
                    />
                </Flex>
            );
        } else if (proteinData.inputFunctionType === "pulse") {
            return pulseFunctionDataProps.map(({ key, label, min, max, step }) => {
                const rawValue = proteinData.inputFunctionData?.[key];
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
                                        inputFunctionData: {
                                            ...proteinData.inputFunctionData,
                                            [key]: val === "" ? undefined : parseFloat(val)
                                        }
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
                                    inputFunctionData: {
                                        ...proteinData.inputFunctionData,
                                        [key]: value[0]
                                    }
                                })
                            }
                        />
                    </Flex>
                );
            });
        }
        return null;
    };
    


    return (
        <>
            {mode === "create" ?
                <>
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
                </>
            :
                <Flex direction="column">
                    <Text weight="bold" size="4">Protein Properties</Text>
                    <Text as="div" weight="regular" color="gray">Editing: <Text weight="regular" color="gray" >{proteinData.label}</Text></Text>
                </Flex>
            }

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

            {/* Dynamically generated sliders and fields */}
            {proteinDataProps.map(({ key, label, min, max, step }) => {
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

            {/* Input Function Type */}
            <Flex direction="column" gap="2">
                <Text as="div" weight="bold">Input Function Type</Text>
                <SegmentedControl.Root
                    value={proteinData.inputFunctionType}
                    onValueChange={(val) =>
                        setProteinData({
                            ...proteinData,
                            inputFunctionType: val as 'steady-state' | 'pulse'
                        })
                    }
                >
                    <SegmentedControl.Item value="steady-state">Steady State</SegmentedControl.Item>
                    <SegmentedControl.Item value="pulse">Pulse</SegmentedControl.Item>
                </SegmentedControl.Root>
            </Flex>

        {renderInputFunctionTypeFields()}

        {/* Submit buttons */}


        </>
    )
}

export default ProteinDataForm;