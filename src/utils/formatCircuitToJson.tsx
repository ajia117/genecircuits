import { Node, Edge } from "@xyflow/react";

export const formatCircuitToJson = (nodes: Node[], edges: Edge[]) => {
    return {
        nodes: nodes.map((node: Node) => ({
            id: node.id,
            type: node.type || "default",
            position: node.position,
            data: node.data,
        })),
        edges: edges.map((edge: Edge) => ({
            id: edge.id,
            type: edge.markerEnd, //TODO: make consistent 'arrow' or 'repress'
            source: edge.source,
            target: edge.target,
            label: edge.label || "",
        }))
    };
};
