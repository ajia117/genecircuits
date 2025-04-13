import { Node, Edge } from "@xyflow/react";
import CircuitSettingsType from "../types/CircuitSettingsType";

export const formatCircuitToJson = (circuitSettings: CircuitSettingsType, nodes: Node[], edges: Edge[]) => {
    return {
        circuitSettings,
        nodes: nodes.map((node: Node) => {
            const isCustom = node.type === "custom";
            return {
                id: node.id,
                type: node.type || "default",
                position: node.position,
                ...(isCustom ? { data: node.data } : {}) // ignore data for logic gates
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
