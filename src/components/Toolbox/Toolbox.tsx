import React, { useMemo, useState } from 'react';
import { useCircuitContext, useSelectionStateContext, useWindowStateContext, useHillCoefficientContext } from '../../hooks';
import { ProteinData } from "../../types";
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
    IconButton,
    DropdownMenu
} from '@radix-ui/themes'
import {
    Plus,
    Ampersands,
    Tally2,
    Search,
    Ellipsis
} from 'lucide-react'

export const Toolbox: React.FC = () => {
    const { proteins, setProteinData, setNodes } = useCircuitContext();
    const { setEditingProtein } = useSelectionStateContext();
    const { setActiveTab } = useWindowStateContext();
    const { setHillCoefficients, hillCoefficients } = useHillCoefficientContext();

    const [searchTerm, setSearchTerm] = useState(''); // Stores user input from the protein search bar
    const [showCreateProteinWindow, setShowCreateProteinWindow] = useState(false);

    // Called when the create protein button is clicked
    const handleCreateProtein = (data: ProteinData) => {
        if (proteins[data.label]) {
            alert("That protein already exists!");
            return;
        }
        setProteinData(data.label, data); // adds new protein to the list
    };

    // Called when user starts dragging a node, triggers onDrop in CircuitBuilderFlow when done
    const onDragStart = (e: React.DragEvent, type: string, data?: ProteinData) => {
        e.dataTransfer.setData("application/reactflow", type);
        if (type === "custom" && data) {
            e.dataTransfer.setData("application/node-data", JSON.stringify(data));
            e.dataTransfer.setData("application/node-in", String(data.inputs));
            e.dataTransfer.setData("application/node-out", String(data.outputs));
        }
        e.dataTransfer.effectAllowed = "move";
    };
    

    // Filters the protein list when user searches
    const filteredProteins = useMemo(() => {
        return Object.entries(proteins)
            .filter(([label]) => label.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(([label, data]) => ({ id: label, label, ...data }));
    }, [proteins, searchTerm]);

    // Handler to delete a protein and its associated node(s)
    const handleDeleteProtein = (label: string) => {
        // Remove protein from proteins object
        setProteinData(label, undefined);
        // Remove nodes with this protein label
        setNodes((prevNodes) => prevNodes.filter(node => !(node.data && typeof node.data === 'object' && 'label' in node.data && node.data.label === label)));
        // Remove all hill coefficients involving this protein
        setHillCoefficients((prev) => prev.filter(h => !h.id.startsWith(label + '-') && !h.id.endsWith('-' + label)));
    };

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
                    style={{
                        maxHeight: 'calc(100vh - 450px)',
                        border: '1px solid var(--gray-a6)',
                        borderRadius: 'var(--radius-3)',
                        padding: '0.5rem',
                        width: 'auto'
                    }}
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
                            onDragStart={(e: React.DragEvent) => {onDragStart(e, "custom", protein)}}
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
                                    <Text weight="medium" size="2">{protein.label}</Text>
                                    {/* <Text size="1" color="gray">{protein.label}</Text> */}
                                </Flex>

                                {/* Protein Card Options. Ellipsis button */}
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <IconButton
                                            variant='ghost'
                                            color='gray'
                                        >
                                            <Ellipsis size={20} />
                                        </IconButton>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content>
                                        <DropdownMenu.Item onClick={() => {
                                            setEditingProtein && setEditingProtein(protein)
                                            setActiveTab('properties')
                                        }}>Edit</DropdownMenu.Item>
                                        <DropdownMenu.Item color="red" onClick={() => handleDeleteProtein(protein.label)}>Delete</DropdownMenu.Item>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                                
                            </Flex>
                        </Box>
                    ))}
                    </Grid>
                )}
                </ScrollArea>

            </Flex>

            <CreateProteinWindow open={showCreateProteinWindow} onOpenChange={setShowCreateProteinWindow} onCreate={handleCreateProtein}/>
        </Flex>
    );
};

export default Toolbox;
