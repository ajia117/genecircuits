interface ComplexNodeData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    hillCoefficient: number;
    threshold: number;
    degradationRate: number;
    delay: number;
}
export default ComplexNodeData;