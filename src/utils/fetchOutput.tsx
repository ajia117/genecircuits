// Add TypeScript interface for the window object
import CircuitDataType from "../types/CircuitDataType";
import SimulationResponse, {SimulationErrorResponse} from "../types/SimulationResponse";
import { FetchOutputResult } from "../types/FetchOutputReturnType";

declare global {
  interface Window {
    electron: {
      runSimulation: (circuitData: CircuitDataType) => Promise<SimulationResponse>;
    };
  }
}

let isCancelled = false;
function isErrorResponse(response: SimulationResponse): response is SimulationErrorResponse {
  return response.success === false;
}

// Function called when user clicks the 'Run Simulation' button. This function makes the API POST
// request to the backend then receives and parses the response to display.
export const fetchOutput = async (circuitJson: CircuitDataType): Promise<FetchOutputResult> => {
  try {
    isCancelled = false;
    
    // Call the IPC function exposed by preload.ts
    const response: SimulationResponse = await window.electron.runSimulation(circuitJson);

    if (isCancelled) {
      return { cancelled: true };
    }
    
    // Handle error responses
    if (isErrorResponse(response)) {
      console.error("Simulation error:", response.error);
      return { 
        type: "error", 
        error: response.error,
        details: response.traceback 
      };
    }

    // Handle success with image
    if (response.image) {
      const imageUrl = `data:image/png;base64,${response.image}`;
      return { 
        type: "image", 
        data: imageUrl,
        rawData: response.data // Also return raw data for potentially using in client-side charts
      };
    }

    // Return the data directly if no image
    return { 
      type: "data", 
      data: response.data 
    };
    
  } catch (error) {
    if (isCancelled) {
      return { cancelled: true };
    } else {
      console.error("Error in fetchOutput:", error);
      return { 
        type: "error", 
        error: error.message || "Unknown error" 
      };
    }
  }
};

export const abortFetch = () => {
  isCancelled = true;
};