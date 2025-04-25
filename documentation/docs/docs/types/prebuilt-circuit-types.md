---
id: prebuilt-circuit-types
title: Prebuilt Circuit Types
sidebar_label: Prebuilt Circuits
---

# Prebuilt Circuit Types

These types define templates and functions used to import or apply ready-made genetic circuits into the builder.

---

## CircuitTemplate

Defines a reusable genetic circuit with nodes, edges, and protein mappings.

### Example

```js
{
  id: "template-1",
  name: "Basic Pulse Generator",
  description: "Simple 2-node repression pulse generator.",
  nodes: [...],
  edges: [...],
  proteins: { A: {...}, B: {...} }
}
```

---

### Keys and Values for `CircuitTemplate`

| Key | Type | Required |
|:----|:-----|:---------|
| `id` | `string` | Yes |
| `name` | `string` | Yes |
| `description` | `string` | Yes |
| `nodes` | `Node[]` | Yes |
| `edges` | `Edge[]` | Yes |
| `proteins` | `{ [label: string]: ProteinData }` | Yes |

---

## ApplyCircuitTemplateProps

Parameters passed to apply a `CircuitTemplate` into an existing workspace.

---

### Keys and Values for `ApplyCircuitTemplateProps`

| Key | Type | Required |
|:----|:-----|:---------|
| `template` | `CircuitTemplate` | Yes |
| `proteins` | `{ [label: string]: ProteinData }` | Yes |
| `nodeIdRef` | `MutableRefObject<number>` | Yes |
| `gateIdRef` | `MutableRefObject<number>` | Yes |
| `setNodes` | `(updater: (nodes: Node[]) => Node[]) => void` | Yes |
| `setEdges` | `(updater: (edges: Edge[]) => Edge[]) => void` | Yes |
| `setProteins` | `(updater: (proteins: {[label: string]: ProteinData}) => {[label: string]: ProteinData}) => void` | Yes |
