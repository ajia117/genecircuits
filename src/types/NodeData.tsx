interface NodeData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    hillCoefficient: number;
    lossRate: number;
    beta: number;
    delay: number;
    inputs: number;
    outputs: number;
}

export default NodeData;