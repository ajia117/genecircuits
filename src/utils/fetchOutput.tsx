let controller = new AbortController();

export const fetchOutput = async (circuitJson: any) => { //TODO: set type
    try {
        controller = new AbortController();
        const response = await fetch("http://127.0.0.1:5000/test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(circuitJson),
            signal: controller.signal
        });

        
        if (!response.ok) {
            throw new Error("Failed to fetch output");
        }

        const data = await response.json();
        console.log("Simulation Output:", data);
        return data
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("Fetch request aborted");
        } else {
            console.error("Error fetching output:", error);
        }
    }
};

export const abortFetch = () => {
    controller.abort();
};
