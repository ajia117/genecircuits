import { useState } from "react"
import axios from "axios";

export default function Body() {
    const [message, setMessage] = useState(null)

    const testServer = async () => {
      try {
          const response = await fetch("http://127.0.0.1:5000/test", {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
          });

          if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
          }

          const data = await response.json();
          setMessage(data.message);
      } catch (error) {
          console.error("Error fetching data:", error);
          setMessage("Failed to connect to the server.");
      }
    };

    return (
        <>
            <h1>Electron-React-Flask Test</h1>
            <button onClick={testServer}>Get random number!</button>

            <p>{message ? message : ""}</p>
        </>
    )
}