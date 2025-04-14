import { Node, Edge } from "@xyflow/react";
import CircuitSettingsType from "../types/CircuitSettingsType";
import NodeData from "../types/NodeData";

export const formatCircuitToJson = (
    circuitSettings: CircuitSettingsType,
    nodes: Node[],
    edges: Edge[],
    proteins: { [label: string]: NodeData }
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
                position: node.position,
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
