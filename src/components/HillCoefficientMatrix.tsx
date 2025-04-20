import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  Table,
  Flex,
  Text,
  IconButton,
  Popover,
  Button,
  TextField,
  Callout
} from '@radix-ui/themes';
import { X, CircleAlert, CornerRightDown, ArrowRight } from 'lucide-react';
import { HillCoefficientData } from '../types';

interface HillCoefficientMatrixProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usedProteins: Set<string>;
  hillCoefficients: HillCoefficientData[];
  setHillCoefficients: Dispatch<SetStateAction<HillCoefficientData[]>>;
}

export default function HillCoefficientMatrix({
  open,
  onOpenChange,
  usedProteins,
  hillCoefficients,
  setHillCoefficients
}: HillCoefficientMatrixProps) {

    const getValue = (source: string, target: string): number => {
        const entry = hillCoefficients.find(h => h.id === `${source}-${target}`);
        return entry?.value ?? 1; // default to 1 if missing
    };

    const updateValue = (source: string, target: string, newValue: number) => {
        const id = `${source}-${target}`;
        setHillCoefficients(prev => {
        const index = prev.findIndex(h => h.id === id);
        if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...updated[index], value: newValue };
            return updated;
        } else {
            return [...prev, { id, value: newValue }];
        }
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content maxWidth="1000px">
            
            <Flex justify="between">
                <Dialog.Title mt="1">Hill Coefficient Matrix</Dialog.Title>
                <Dialog.Close><IconButton variant="ghost" color="gray"><X /></IconButton></Dialog.Close>
            </Flex>
            <Flex direction='column' gap='2' mb='3'>
            <Dialog.Description mb="3">
                Specify hill coefficients for each connection between proteins in your circuit. Each cell 
                represents a connection from a source protein (row) to a target protein (column).
            </Dialog.Description>
            <Callout.Root>
                <Callout.Icon><CircleAlert size={20} /></Callout.Icon>
                <Callout.Text weight='bold'>
                    Click on a cell to edit the hill coefficient value.
                </Callout.Text>
            </Callout.Root>
            </Flex>

            {/* MATRIX */}
            <Table.Root>
            {/* HEADER */}
            <Table.Header>
                <Table.Row>
                <Table.ColumnHeaderCell><Flex direction='row' align="center" gap='1'>
                    Target <CornerRightDown size={15}/> / Source <ArrowRight size={15}/>
                </Flex></Table.ColumnHeaderCell>
                {Array.from(usedProteins)
                    .sort((a, b) => a.localeCompare(b))
                    .map((label) => (
                    <Table.ColumnHeaderCell key={label}>{label}</Table.ColumnHeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            {/* BODY */}
            <Table.Body>
                {Array.from(usedProteins)
                .sort((a, b) => a.localeCompare(b))
                .map((source) => (
                    <Table.Row key={source}>
                    <Table.RowHeaderCell>{source}</Table.RowHeaderCell>
                    {Array.from(usedProteins)
                        .sort((a, b) => a.localeCompare(b))
                        .map((target) => {
                        const currentValue = getValue(source, target);
                        return (
                            <Table.Cell key={`${source}-${target}`}>
                            <Popover.Root>
                                <Popover.Trigger>
                                <Button size="1" variant="soft" color="gray">
                                    {currentValue !== undefined ? currentValue : '1'}
                                </Button>
                                </Popover.Trigger>
                                <Popover.Content>
                                <Flex direction="column" gap="2" p="2" style={{ width: '150px' }}>
                                    <Text size="2" weight="bold">
                                    {source} → {target}
                                    </Text>
                                    <TextField.Root
                                    type="number"
                                    placeholder="Enter value"
                                    value={currentValue ?? 1}
                                    onChange={(e) => {
                                        const newVal = parseFloat(e.target.value);
                                        if (!isNaN(newVal)) {
                                        updateValue(source, target, newVal);
                                        }
                                    }}
                                    />
                                </Flex>
                                </Popover.Content>
                            </Popover.Root>
                            </Table.Cell>
                        );
                        })}
                    </Table.Row>
                ))}
            </Table.Body>
            </Table.Root>
        </Dialog.Content>
        </Dialog.Root>
    );
}
