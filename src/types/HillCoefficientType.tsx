interface HillCoefficientData extends Record<string, unknown>{
    id: string; // source-target (e.g., "A-B")
    value: number;
}

export default HillCoefficientData;