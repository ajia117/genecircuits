---
id: protein-data
title: Protein Data Type
sidebar_label: ProteinData
---

# Protein Data Type

`ProteinData` defines the core attributes of proteins (transcription factors) in the circuit, including expression rates, loss rates, and input function behavior.

---

## Example

```js
{
  label: "ProteinA",
  initialConcentration: 50,
  lossRate: 1.5,
  beta: 2.0,
  inputs: 2,
  outputs: 1,
  inputFunctionType: "steady-state",
  inputFunctionData: {
    steadyStateValue: 80,
    timeStart: 0,
    timeEnd: 100,
    pulsePeriod: 0,
    amplitude: 0,
    dutyCycle: 0
  }
}
```

---

## Keys and Values

| Key | Type | Required |
|:----|:-----|:---------|
| `label` | `string` | Yes |
| `initialConcentration` | `number` | Yes |
| `lossRate` | `number` | Yes |
| `beta` | `number` | Yes |
| `inputs` | `number` | Yes |
| `outputs` | `number` | Yes |
| `inputFunctionType` | `'steady-state'` or `'pulse'` | Yes |
| `inputFunctionData` | `object` | Yes |
