---
id: formatBackendJson
sidebar_label: formatBackendJson
---

# `formatBackendJson` Utility

Prepares and transforms the circuit data into the format expected by the **backend API** for simulation requests.

## Function Signature

```ts
formatBackendJson(
  circuitSettings: CircuitSettingsType,
  nodes: Node[],
  edges: Edge[],
  proteins: { [label: string]: ProteinData },
  hillCoefficients: HillCoefficientData[]
): object
```

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `circuitSettings` | `CircuitSettingsType` | Simulation settings |
| `nodes` | `Node[]` | Nodes in the workspace |
| `edges` | `Edge[]` | Connections between nodes |
| `proteins` | `{ [label: string]: ProteinData }` | Protein data involved |
| `hillCoefficients` | `HillCoefficientData[]` | Hill function parameters for edges |


## Example

```ts
import { formatBackendJson } from '../utils/formatBackendJson';

const backendData = formatBackendJson(circuitSettings, nodes, edges, proteins, hillCoefficients);
```