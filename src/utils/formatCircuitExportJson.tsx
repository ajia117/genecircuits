import { Node, Edge } from "@xyflow/react";
import CircuitSettingsType from "../types/CircuitSettingsType";
import ProteinData from "../types/ProteinData";

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
