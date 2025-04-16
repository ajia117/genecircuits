interface EdgeData extends Record<string, unknown>{
    id: string;
    source: string;
    target: string;
    sourceHandle: string;
    targetHandle: string;
    type: string;
    markerEnd: 'promote' | 'repress';
}

export default EdgeData;