import {CircuitSettingsType, HillCoefficientData} from "./index";
import {EdgeMarkerType} from "@xyflow/react";

interface CircuitDataType {
    circuitSettings: CircuitSettingsType
    nodes: {
        proteinName?: unknown
        id: string
        type: string
    }[]
    edges: {
        id: string
        type: EdgeMarkerType
        source: string
        target: string
    }[]
    proteins: object
    hillCoefficients: HillCoefficientData[]
}
export default CircuitDataType;