---
id: edge-data
sidebar_label: EdgeData
---

# Edge Data Type

`EdgeData` defines the structure for edges (connections) between nodes in the circuit, including source/target information and interaction type.

---

## Example

```js
{
  id: "edge-1",
  source: "nodeA",
  target: "nodeB",
  sourceHandle: "bottom",
  targetHandle: "top",
  type: "custom",
  markerEnd: "promote"
}
```

---

## Keys and Values

| Key | Type | Required |
|:----|:-----|:---------|
| `id` | `string` | Yes |
| `source` | `string` | Yes |
| `target` | `string` | Yes |
| `sourceHandle` | `string` | Yes |
| `targetHandle` | `string` | Yes |
| `type` | `string` | Yes |
| `markerEnd` | `'promote'` or `'repress'` | Yes |
