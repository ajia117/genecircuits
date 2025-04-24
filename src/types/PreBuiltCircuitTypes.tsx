import {Node, Edge} from "@xyflow/react";
import {ProteinData} from "./index";
import {MutableRefObject} from "react";

export interface CircuitTemplate {
    id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
    proteins: {[label: string]: ProteinData};
}

// Input type for the function
export interface ApplyCircuitTemplateProps {
    template: CircuitTemplate;
    proteins: {[label: string]: ProteinData};
    nodeIdRef: MutableRefObject<number>;
    gateIdRef: MutableRefObject<number>;
    setNodes: (updater: (nodes: Node[]) => Node[]) => void;
    setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
    setProteins: (updater: (proteins: {[label: string]: ProteinData}) => {[label: string]: ProteinData}) => void;
}