import { Node, Edge } from "@xyflow/react";
import CircuitSettingsType from "../types/CircuitSettingsType";
import NodeData from "../types/NodeData";

// JSON to export and import individual circuits
export const formatCircuitExportJson = (
    circuitSettings: CircuitSettingsType,
    nodes: Node[],
    edges: Edge[],
    proteins: { [label: string]: NodeData }
) => {
    return {
        circuitSettings,
        nodes, 
        edges, 
        proteins
    };
};
