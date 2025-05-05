import type { CircuitDataType } from '../types/CircuitDataType';
import type { SimulationResponse } from '../types/SimulationResponse';

declare global {
  interface Window {
    electron: {
      runSimulation: (circuitData: CircuitDataType) => Promise<SimulationResponse>;
      onBackendReady: (callback: (ready: boolean) => void) => void;
    };
  }
}

export {}; // required to make this a module