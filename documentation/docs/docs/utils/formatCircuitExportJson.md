---
id: formatCircuitExportJson
sidebar_label: formatCircuitExportJson
---

# `formatCircuitExportJson` Utility

Formats the in-memory circuit (settings, nodes, edges, proteins) into a JSON object for **saving** or **exporting**.

## Function Signature

```ts
formatCircuitExportJson(
  circuitSettings: CircuitSettingsType,
  nodes: Node[],
  edges: Edge[],
  proteins: { [label: string]: ProteinData }
): object
```

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `circuitSettings` | `CircuitSettingsType` | General simulation settings |
| `nodes` | `Node[]` | List of circuit nodes |
| `edges` | `Edge[]` | List of circuit edges |
| `proteins` | `{ [label: string]: ProteinData }` | Protein data for simulation |

## Example

```ts
import { formatCircuitExportJson } from '../utils/formatCircuitExportJson';

const exportData = formatCircuitExportJson(circuitSettings, nodes, edges, proteins);
```