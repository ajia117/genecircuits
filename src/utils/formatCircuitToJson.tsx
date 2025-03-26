import { Node, Edge } from "@xyflow/react";

export const formatCircuitToJson = (circuitSettings: any, nodes: Node[], edges: Edge[]) => {
    return {
        circuitSettings,
        nodes: nodes.map((node: Node) => ({
            id: node.id,
            type: node.type || "default",
            position: node.position,
            data: node.data,
        })),
        edges: edges.map((edge: Edge) => ({
            id: edge.id,
            type: edge.markerEnd,
            source: edge.source,
            target: edge.target,
        }))
    };
};
