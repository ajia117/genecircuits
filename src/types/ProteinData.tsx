interface ProteinData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    lossRate: number;
    beta: number;
    // delay: number;
    inputs: number;
    outputs: number;
    inputFunctionType: 'steady-state' | 'pulse';
    inputFunctionData: {
        steadyStateValue: number;
        timeStart: number;
        timeEnd: number;
        pulsePeriod: number;
        amplitude: number;
        dutyCycle: number;
    }
}

export default ProteinData;