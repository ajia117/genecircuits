

interface SimpleNodeData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    hillCoefficient: number;
}
interface ComplexNodeData extends Record<string, unknown>{
    label: string;
    initialConcentration: number;
    hillCoefficient: number;
    threshold: number;
    degradationRate: number;
    delay: number;
}
type NodeData = SimpleNodeData | ComplexNodeData;

export default NodeData;