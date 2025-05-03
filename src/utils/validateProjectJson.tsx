// utils/validateProjectJson.ts
// Validate the imported project JSON file

import { validate } from "jsonschema";

export function validateProjectJson(json: any): string | null {
  const result = validate(json, projectDataSchema);
  if (result.errors.length > 0) {
    const firstError = result.errors[0];
    return `Invalid file: ${firstError.stack}`;
  }
  return null;
}


// schema used to validate the imported project JSON
const projectDataSchema = {
    type: "object",
    required: ["circuitSettings", "nodes", "edges", "proteins"],
    properties: {
        circuitSettings: {
            type: "object",
            required: ["projectName", "simulationDuration", "numTimePoints"],
            properties: {
                projectName: { type: "string" },
                simulationDuration: { type: "number" },
                numTimePoints: { type: "number" }
            }
        },
        nodes: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "type", "position", "data", "measured"],
                properties: {
                    id: { type: "string" },
                    type: { type: "string" },
                    position: {
                    type: "object",
                    required: ["x", "y"],
                    properties: {
                        x: { type: "number" },
                        y: { type: "number" }
                    }
                },
                data: { type: "object" },
                measured: {
                    type: "object",
                    required: ["width", "height"],
                    properties: {
                        width: { type: "number" },
                        height: { type: "number" }
                    }
                }
                }
            }
        },
        edges: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "source", "target", "markerEnd", "sourceHandle", "targetHandle"],
                properties: {
                    id: { type: "string" },
                    source: { type: "string" },
                    sourceHandle: { type: "string" },
                    target: { type: "string" },
                    targetHandle: { type: "string" },
                    markerEnd: { type: "string" }
                }
            }
        },
        proteins: {
            type: "object",
            patternProperties: {
                "^.*$": {
                    type: "object",
                    required: [
                        "label",
                        "initialConcentration",
                        "lossRate",
                        "beta",
                        "inputs",
                        "outputs",
                        "inputFunctionType",
                        "inputFunctionData"
                    ],
                    properties: {
                        label: { type: "string" },
                        initialConcentration: { type: "number" },
                        lossRate: { type: "number" },
                        beta: { type: "number" },
                        inputs: { type: "number" },
                        outputs: { type: "number" },
                        inputFunctionType: { type: "string" },
                        inputFunctionData: {
                            type: "object",
                            properties: {
                            steadyStateValue: { type: "number" },
                            timeStart: { type: "number" },
                            timeEnd: { type: "number" },
                            pulsePeriod: { type: "number" },
                            amplitude: { type: "number" },
                            dutyCycle: { type: "number" }
                            }
                        }
                    }
                }
            }
        },
        hillCoefficients: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "value"],
                properties: {
                    id: { type: "string" },
                    value: { type: "number" }
                }
            }
        }
    },
    additionalProperties: false
};
    
export default projectDataSchema;
    