---
id: syncNodeCounters
sidebar_label: syncNodeCounters
---

# `syncNodeCounters` Utility

Provides helper functions to synchronize and initialize node and gate ID counters when importing existing circuits into the builder.

## Functions

| Function | Description |
|:---------|:------------|
| `setRefs(refs)` | Initializes references for node and gate ID counters. |
| `syncNodeCounters(nodes)` | Finds the highest node and gate ID and updates the counters to avoid ID collisions. |


## Example

```ts
import { setRefs, syncNodeCounters } from '../utils/syncNodeCounters';

setRefs({ nodeIdRef, gateIdRef });
syncNodeCounters(nodes);
```

