

interface SimpleNodeData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    hillCoefficient: number;
}
interface ComplexNodeData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    hillCoefficient: number;
    delay: number;
    inputs: number;
    outputs: number;
}
type NodeData = ComplexNodeData | SimpleNodeData;

export default NodeData;