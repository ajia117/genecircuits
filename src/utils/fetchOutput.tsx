// Add TypeScript interface for the window object
declare global {
  interface Window {
    electron: {
      runSimulation: (circuitData: any) => Promise<any>;
    };
  }
}

let isCancelled = false;

export const fetchOutput = async (circuitJson: any) => {
  try {
    isCancelled = false;
    
    // Call the IPC function exposed by preload.ts
    const response = await window.electron.runSimulation(circuitJson);

    if (isCancelled) {
      return { cancelled: true };
    }
    
    // Handle error responses
    if (!response.success) {
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