import { Node, Edge } from "@xyflow/react";
import CircuitSettingsType from "../types/CircuitSettingsType";
import ProteinData from "../types/ProteinData";

export const formatBackendJson = (
    circuitSettings: CircuitSettingsType,
    nodes: Node[],
    edges: Edge[],
    proteins: { [label: string]: ProteinData }
) => {
    return {
        circuitSettings,
        nodes: nodes.map((node: Node) => {
            const isCustom = node.type === "custom";
            const label = node.data?.label;
            const proteinData = isCustom && typeof label === "string" ? proteins[label] : null;

            return {
                id: node.id,
                type: node.type || "default",
                ...(isCustom && proteinData // add data for non-gate nodes. maintains consistency for all nodes of the same protein
                    ? { data: { ...proteinData, label } }
                    : {})
            };
        }),
        edges: edges.map((edge: Edge) => ({
            id: edge.id,
            type: edge.markerEnd,
            source: edge.source,
            target: edge.target,
        }))
    };
};