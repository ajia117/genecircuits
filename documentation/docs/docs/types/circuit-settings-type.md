---
id: circuit-settings-type
sidebar_label: CircuitSettings
---

# Circuit Settings Type

`CircuitSettingsType` defines basic settings for running a simulation, such as project name, total duration, and number of time points.

---

## Example

```js
{
  projectName: "Test Circuit",
  simulationDuration: 60,
  numTimePoints: 100
}
```

---

## Keys and Values

| Key | Type | Required |
|:----|:-----|:---------|
| `projectName` | `string` | Yes |
| `simulationDuration` | `number` | Yes |
| `numTimePoints` | `number` | Yes |
