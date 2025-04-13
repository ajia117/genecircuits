import React, {useState} from 'react';
import CreatableSelect from "react-select/creatable";
import NodeData from "../../types/NodeData";
import '../../index.css';
import CreateProteinWindow from '../CreateProteinWindow';
import {
    Box,
    Text,
    Flex,
    Button,
    TextField,
    ScrollArea,
    Grid,
    IconButton
} from '@radix-ui/themes'
import {
    Plus,
    Ampersands,
    Tally2,
    Search,
    Ellipsis
} from 'lucide-react'

interface ToolboxProps {
    labels: string[];
    getLabelData: (label: string) => NodeData;
}

interface OptionType {
    readonly label: string;
    value: string | number;
}

export const Toolbox: React.FC<ToolboxProps> = ({
        labels,
        getLabelData
     }) => {

    const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
    const [isNewLabel, setIsNewLabel] = useState(false);
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
    const [searchTerm, setSearchTerm] = useState(''); // stores user input for protein search
    const [showCreateProteinWindow, setShowCreateProteinWindow] = useState(false);


    const createOption = (label: string): OptionType => ({
        label,
        value: label
    });
    const [labelOptions, setLabelOptions] = useState<OptionType[]>(
        labels.map(createOption)
    );

    const handleInputChange = (key: string, value: string | number) => {
        setNodeData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCreate = (inputValue: string) => {
        // return if option already exists without trailing/leading whitespace
        const option = labelOptions.find(option => option.label === inputValue.trim());
        if(option) {
            setSelectedOption(option);
            return;
        }

        // add new option to list of labels
        const newOption = createOption(inputValue);
        setLabelOptions([...labelOptions, newOption]);
        setSelectedOption(newOption);
        setIsNewLabel(true);
        setNodeData({
            ...genericNodeData,
            label: inputValue
        });
    };

    // don't always allow the create string option to appear
    const isValidCreateString = (inputValue: string) => {
        return inputValue !== "" && !labelOptions.find(option => option.label === inputValue.trim());
    }

    // this is for changing to an already existing label
    const handleChange = (inputValue: OptionType | null) => {
        setSelectedOption(inputValue);

        if(!inputValue) {
            // Reset form when cleared
            setNodeData(genericNodeData);
            setIsNewLabel(false);
            return;
        }
        const data = getLabelData(inputValue.label);

        // if someone made a label, but never dropped a node, still allow them to change its values
        // getLabelData only returns data if a node was dropped
        if(!data) {
            setSelectedOption(inputValue);
            setIsNewLabel(true);
            setNodeData({
                ...genericNodeData,
                label: inputValue.label
            });
        }
        else {
            setIsNewLabel(false);
            setNodeData({
                ...data,
                label: inputValue.label
            });
        }

    };

    // start dragging node, calls to onDrop in CircuitBuilderFlow when done
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        // store type, should always be "custom", "and", or "or"
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/node-data", JSON.stringify(nodeData));
        if(nodeType === "custom") {
            event.dataTransfer.setData("application/node-in", String(nodeData.inputs));
            event.dataTransfer.setData("application/node-out", String(nodeData.outputs));
        }
        event.dataTransfer.effectAllowed = "move";
    };

    // filters the protein list when user searches
    const filteredProteins = labels
    .filter((label) =>
        label.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((label) => {
        const data = getLabelData(label);
        return {
            id: label,
            name: label,
            ...data
        };
    });

    // generate HTML for form
    const getLabelForm = () => {
        // make sure that if a node is dropped, you cannot edit the data anymore
        const dropped = getLabelData(selectedOption.label);

        return Object.entries(nodeData).map(([key, value]) => {
            if(key === 'label') return;
            if(key === 'inputs' || key === 'outputs') {
                return (
                    <div key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:<br/>
                    <input
                        name={key}
                        type="number"
                        min = {0}
                        max = {4}
                        value={value as number || '0'}
                        onChange={(e) => handleInputChange(key, Number(e.target.value))}
                    /><br/>
                </div>
            )}
            const isReadOnly = (!!dropped || !isNewLabel);
            return (
                <div key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:<br/>
                    <input
                        readOnly={isReadOnly}
                        name={key}
                        type="range"
                        min={0}
                        max={1}
                        step={.01}
                        value={value as number || '0'}
                        onChange={(e) => handleInputChange(key, isReadOnly ? value as number : Number(e.target.value))}
                        style={{ cursor: isReadOnly ? "not-allowed" : "grab"}}
                    />
                    <input
                        readOnly={isReadOnly}
                        name={key}
                        type="number"
                        min={0}
                        max={1}
                        step={.01}
                        value={value as number || '0'}
                        onChange={(e) => handleInputChange(key, Number(e.target.value))}
                        style={{ cursor: isReadOnly ? "not-allowed" : ""}}
                    /><br/>
                </div>
            )
        });
    }

    return (
        <Flex direction="column">
            {/* LOGIC GATES */}
            <Text size="4" weight="bold">Logic Gates</Text>
            <Flex direction="column" gap="2" my="4">
                <Box
                    className='dndnode'
                    draggable
                    onDragStart={(e: React.DragEvent) => onDragStart(e, 'and')}
                >
                    <Flex align="center" gap="4">
                        <Ampersands size={20} className='gate-icon'/> <Text weight="medium" size="3">AND Node</Text>
                    </Flex>
                </Box>
                <Box
                    className='dndnode'
                    draggable
                    onDragStart={(e: React.DragEvent) => onDragStart(e, 'or')}
                >
                    <Flex align="center" gap="4">
                        <Tally2 size={20} className='gate-icon'/> <Text weight="medium" size="3">OR Node</Text>
                    </Flex>
                </Box>
            </Flex>

            {/* PROTIEN NODES */}
            <Flex direction="row" justify="between" mt="5">
                <Text size="4" weight="bold">Proteins</Text>
                {/* Create new node button */}
                <Button variant='ghost'
                    onClick={() => setShowCreateProteinWindow(true)}
                >
                    <Plus /> <Text size="4" weight="bold">New</Text>
                </Button>
            </Flex>

            <Flex direction="column" gap="2" mt="4">
                <TextField.Root size="3" variant="surface" placeholder="Search proteins..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                >
                    <TextField.Slot>
                        <Search size={20} />
                    </TextField.Slot>
                </TextField.Root>

                <ScrollArea
                    type="auto"
                    scrollbars="vertical"
                    // style={{
                    //     maxHeight: '300px',
                    //     border: '1px solid var(--gray-a6)',
                    //     borderRadius: 'var(--radius-3)',
                    //     padding: '0.5rem',
                    //     width: 'auto'
                    // }}
                >
                {filteredProteins.length === 0 ? (
                    <Box p="3" style={{ color: 'var(--gray-a9)', textAlign: 'center', fontSize: '13px' }}>
                        No proteins found. Try creating one.
                    </Box>
                ) : (
                    <Grid
                        columns={{ initial: "2", sm: "2" }}
                        gap="3"
                    >
                    {filteredProteins.map((protein) => (
                        <Box
                            key={protein.id}
                            draggable
                            onDragStart={(e: React.DragEvent) => onDragStart(e, 'custom')}
                            style={{
                                cursor: 'grab',
                                border: '1px solid var(--gray-a6)',
                                borderRadius: 'var(--radius-3)',
                                padding: '0.5rem',
                                backgroundColor: 'var(--color-surface)',
                                transition: 'background-color 0.2s ease',
                            }}
                            className="protein-grid-item"
                        >
                            <Flex direction="row" justify="between" align="center">
                                <Flex direction="column">
                                    <Text weight="medium" size="2">{protein.name}</Text>
                                    <Text size="1" color="gray">{protein.name}</Text> {/* TODO: change to protein type */}
                                </Flex>

                                <IconButton
                                    variant='ghost'
                                    color='gray'
                                    onClick={() => {}}
                                >
                                    <Ellipsis size={20} />
                                </IconButton>
                            </Flex>
                        </Box>
                    ))}
                    </Grid>
                )}
                </ScrollArea>

            </Flex>

            <CreateProteinWindow open={showCreateProteinWindow} onOpenChange={setShowCreateProteinWindow} />

        {/* </Flex> */}
        {/* <>
            <div className="components-container">
                <div className="mt-4 p-4 bg-gray-50 rounded shadow-sm">
                    <h3 className="text-lg font-medium mb-3">Choose existing Protein or Create New</h3>
                    <div className="space-y-3">
                        <CreatableSelect
                            isClearable
                            onChange={handleChange}
                            onCreateOption={handleCreate}
                            options={labelOptions}
                            value={selectedOption}
                            isValidNewOption={isValidCreateString}
                            formatCreateLabel={(inputValue) => `Create "${inputValue.trim()}"`}
                        />

                        {selectedOption && getLabelForm()}
                    </div>
                    <br/>
                    {selectedOption &&
                        <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'custom')} draggable>
                            Drag Node
                        </div>
                    }
                </div>

            </div>
        </> */}
        </Flex>
    );
};

export default Toolbox;
