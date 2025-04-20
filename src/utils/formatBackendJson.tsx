import { Node, Edge } from "@xyflow/react";
import { ProteinData, HillCoefficientData, CircuitSettingsType } from "../types";

export const formatBackendJson = (
    circuitSettings: CircuitSettingsType,
    nodes: Node[],
    edges: Edge[],
    proteins: { [label: string]: ProteinData },
    hillCoefficients: HillCoefficientData[],
) => {
    // Get all unique protein labels used in the nodes
    const usedLabels = new Set<string>(
        nodes
            .filter((node) => node.type === "custom" && typeof node.data?.label === "string")
            .map((node) => node.data.label as string)
    );

    // Create a filtered proteins object for only used labels
    const includedProteins: { [label: string]: ProteinData } = {};
    usedLabels.forEach((label) => {
        if (proteins[label]) {
            includedProteins[label] = proteins[label];
        }
    });

    return {
        circuitSettings,
        nodes: nodes.map((node: Node) => {
            const isCustom = node.type === "custom";
            const label = node.data?.label;

            return {
                id: node.id,
                type: node.type || "default",
                ...(isCustom && label
                    ? { proteinName: label }
                    : {})
            };
        }),
        edges: edges.map((edge: Edge) => ({
            id: edge.id,
            type: edge.markerEnd,
            source: edge.source,
            target: edge.target,
        })),
        proteins: includedProteins,
        hillCoefficients
    };
};
