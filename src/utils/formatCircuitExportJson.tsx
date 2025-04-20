import { Node, Edge } from "@xyflow/react";
import { CircuitSettingsType, ProteinData } from "../types";

// JSON to export and import individual circuits
export const formatCircuitExportJson = (
    circuitSettings: CircuitSettingsType,
    nodes: Node[],
    edges: Edge[],
    proteins: { [label: string]: ProteinData }
) => {
    return {
        circuitSettings,
        nodes, 
        edges, 
        proteins
    };
};
