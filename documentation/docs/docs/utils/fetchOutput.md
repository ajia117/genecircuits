---
id: fetchOutput
sidebar_label: fetchOutput
---

# `fetchOutput` Utility

Handles sending the simulation request to the backend and managing cancellation during an ongoing simulation.

## Functions

### `fetchOutput(circuitJson)`

- Sends circuit JSON to the backend.
- Waits for and processes the response (image, data, or error).

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `circuitJson` | `formatBackendJson` Object | Backend JSON-formatted circuit data |

### `abortFetch()`

- Cancels a pending simulation fetch request.

## Example

```ts
import { fetchOutput, abortFetch } from '../utils/fetchOutput';

const circuitJson = formatBackendJson(circuitSettings, nodes, edges, proteins, hillCoefficients);
const result = await fetchOutput(circuitJson);
abortFetch(); // to cancel if needed
```