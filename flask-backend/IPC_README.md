# IPC Backend Implementation for Genetic Circuit Tool

This folder contains the Python backend code that communicates with the Electron frontend using Inter-Process Communication (IPC).

## Architecture Overview

1. **IPC Server (ipc_server.py)**:
   - Replaces the Flask HTTP server with a direct IPC mechanism
   - Communicates with the Electron main process via stdin/stdout
   - Handles simulation requests and returns results

2. **Simulation Logic**:
   - The core simulation code remains unchanged
   - `simulate.py`, `parser.py`, and `protein.py` are used by the IPC server

## Communication Protocol

1. Messages follow a simple binary protocol:
   - 4-byte length prefix (little endian)
   - JSON message body

2. Request format:
   ```json
   {
     "command": "run_simulation",
     "data": { /* Circuit JSON data */ },
     "requestId": "unique-id-generated-by-main-process"
   }
   ```

3. Response format:
   ```json
   {
     "success": true,
     "image": "base64-encoded-png-image",
     "data": {
       "proteinNames": ["A", "B", "C"],
       "timePoints": [0, 0.1, 0.2, ...],
       "concentrations": [[1, 0, 0], [0.9, 0.1, 0], ...]
     },
     "requestId": "same-id-from-request"
   }
   ```

## Running in Development Mode

1. The Electron app looks for IPC server script at:
   - Development: `flask-backend/ipc_server.py`
   - Production: From package resources

2. The IPC server requires Python with the following dependencies:
   - numpy
   - matplotlib
   - biocircuits library

## Compared to Previous HTTP Approach

1. **Advantages**:
   - Lower latency (no HTTP overhead)
   - Better security (no open ports)
   - More reliable process management
   - Simpler deployment (no need to manage a separate HTTP server)

2. **Implementation Notes**:
   - The frontend API remains largely compatible
   - The `fetchOutput.tsx` function now uses Electron IPC instead of HTTP
   - No Flask dependencies required