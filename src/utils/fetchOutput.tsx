let controller = new AbortController();

export const fetchOutput = async (circuitJson: any) => { //TODO: set type
    try {
        controller = new AbortController();
        const response = await fetch("http://127.0.0.1:5000/run-simulation", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(circuitJson),
            signal: controller.signal
        });

        // console.log(response)
        if (!response.ok) {
            throw new Error("Failed to fetch output");
        }

        // const data = await response.json();
        // console.log("Simulation Output:", data);
        // return data

        const contentType = response.headers.get("content-type");

        if (contentType.includes("image/png")) {
            const blob = await response.blob(); // ✅ Handle image response
            const imageUrl = URL.createObjectURL(blob);
            return { type: "image", data: imageUrl };
        } else {
            const data = await response.json(); // ✅ Handle JSON response
            return { type: "json", data };
        }
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
