interface ProteinData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    lossRate: number;
    beta: number;
    // delay: number;
    inputs: number;
    outputs: number;
}

export default ProteinData;