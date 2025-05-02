import { useState, useCallback, useRef, useEffect } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { ProteinData } from '../types';
import { setRefs } from '../utils';

export function useCircuitState() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [proteins, setProteins] = useState<{[label: string]: ProteinData}>({});
    const [usedProteins, setUsedProteins] = useState<Set<string>>(new Set());

    const nodeIdRef = useRef(0);
    const gateIdRef = useRef(0);

    useEffect(() => {
        setRefs({ nodeIdRef, gateIdRef });
    }, []);

    const getId = useCallback((nodeType: string): string => {
        if (nodeType === "and" || nodeType === "or") {
            return `g${gateIdRef.current++}`;
        } else if (nodeType === "custom") {
            return `${nodeIdRef.current++}`;
        }
        return `unknown-${Math.random().toString(36).substring(2, 5)}`;
    }, []);

    useEffect(() => {
        const labels = new Set(
            nodes
                .filter((node) => node.type === "custom" && typeof node.data?.label === "string")
                .map((node) => node.data?.label as string)
                .filter((label) => label in proteins)
        );
        setUsedProteins(labels);
    }, [nodes, proteins]);

    const getProteinData = useCallback((label: string) => proteins[label] ?? null, [proteins]);
    const setProteinData = useCallback((label: string, data: ProteinData | undefined) => {
        setProteins((prev) => {
            if (data === undefined) {
                // Remove the protein from the object
                const { [label]: _, ...rest } = prev;
                return rest;
            } else {
                return {
                    ...prev,
                    [label]: data,
                };
            }
        });
    }, []);

    return {
        nodes, setNodes, onNodesChange,
        edges, setEdges, onEdgesChange,
        proteins, setProteins, getProteinData, setProteinData,
        usedProteins, setUsedProteins,
        nodeIdRef, gateIdRef, getId
    };
}
export type CircuitState = ReturnType<typeof useCircuitState>;