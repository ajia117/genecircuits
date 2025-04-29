// context/CircuitContext.tsx
import React, { createContext, useContext, ReactNode, useCallback, useRef, useEffect, useState } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { ProteinData } from '../types';
import { setRefs } from '../utils';

interface CircuitState {
  nodes: ReturnType<typeof useNodesState>[0];
  setNodes: ReturnType<typeof useNodesState>[1];
  onNodesChange: ReturnType<typeof useNodesState>[2];
  edges: ReturnType<typeof useEdgesState>[0];
  setEdges: ReturnType<typeof useEdgesState>[1];
  onEdgesChange: ReturnType<typeof useEdgesState>[2];
  proteins: { [label: string]: ProteinData };
  setProteins: React.Dispatch<React.SetStateAction<{ [label: string]: ProteinData }>>;
  usedProteins: Set<string>;
  setUsedProteins: React.Dispatch<React.SetStateAction<Set<string>>>;
  nodeIdRef: React.MutableRefObject<number>;
  gateIdRef: React.MutableRefObject<number>;
  getId: (nodeType: string) => string;
  getProteinData: (label: string) => ProteinData | null;
  setProteinData: (label: string, data: ProteinData) => void;
}

const CircuitContext = createContext<CircuitState | null>(null);

export const CircuitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [proteins, setProteins] = useState<{ [label: string]: ProteinData }>({});
    const [usedProteins, setUsedProteins] = useState<Set<string>>(new Set());

    const nodeIdRef = useRef(0);
    const gateIdRef = useRef(0);

    useEffect(() => {
        setRefs({ nodeIdRef, gateIdRef });
    }, []);

    const getId = useCallback((nodeType: string): string => {
        if (nodeType === 'and' || nodeType === 'or') {
            return `g${gateIdRef.current++}`;
        } else if (nodeType === 'custom') {
            return `${nodeIdRef.current++}`;
        }
        return `unknown-${Math.random().toString(36).substr(2, 5)}`;
    }, []);

    useEffect(() => {
        const labels = new Set(
            nodes
                .filter((node) => node.type === 'custom' && typeof node.data?.label === 'string')
                .map((node) => node.data?.label as string)
            );
        setUsedProteins(labels);
    }, [nodes]);

    const getProteinData = useCallback((label: string) => proteins[label] ?? null, [proteins]);
    const setProteinData = useCallback((label: string, data?: ProteinData) => {
        setProteins((prev) => {
            const newProteins = { ...prev };
            if (data === undefined) {
                delete newProteins[label];
            } else {
                newProteins[label] = data;
            }
            return newProteins;
        });
    }, []);

    return (
        <CircuitContext.Provider value={{
            nodes, setNodes, onNodesChange,
            edges, setEdges, onEdgesChange,
            proteins, setProteins, getProteinData, setProteinData,
            usedProteins, setUsedProteins,
            nodeIdRef, gateIdRef, getId
        }}>
            {children}
        </CircuitContext.Provider>
    );
};

export const useCircuitContext = () => {
    const context = useContext(CircuitContext);
    if (!context) {
        throw new Error('useCircuitContext must be used within a CircuitProvider');
    }
    return context;
};
