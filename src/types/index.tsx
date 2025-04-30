export { default as HillCoefficientData } from './HillCoefficientType';
export { default as ProteinData } from './ProteinData';
export { default as CircuitSettingsType } from './CircuitSettingsType';
export { CircuitTemplate, ApplyCircuitTemplateProps } from './PreBuiltCircuitTypes';
import { Node } from '@xyflow/react';
export { default as EdgeData } from './EdgeData';
export type GateNodeData = null;
export type AppNodeData = import('./ProteinData').default | GateNodeData;
export type AppNode = Node<AppNodeData>;