// ProjectDataType.tsx
// Type for saving projects

import { Node, Edge } from "@xyflow/react";
import { CircuitSettingsType, ProteinData, HillCoefficientData } from "./index";

export interface ProjectDataType {
    circuitSettings: CircuitSettingsType;
    nodes: Node[];
    edges: Edge[];
    proteins: { [label: string]: ProteinData };
    hillCoefficients: HillCoefficientData[];
}

export default ProjectDataType;