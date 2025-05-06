export interface SimulationData {
    proteinNames: string[];
    timePoints: number[];
    concentrations: number[][];
}

interface SimulationSuccessResponse {
    success: true;
    data: SimulationData;
    image?: string; // Base64 string
}

export interface SimulationErrorResponse {
    success: false;
    error: string;
    traceback: string;
}

type SimulationResponse = SimulationErrorResponse | SimulationSuccessResponse;
export default SimulationResponse;