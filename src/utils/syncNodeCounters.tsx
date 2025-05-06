import { Node } from '@xyflow/react';
import React from "react";

let nodeIdRef: React.MutableRefObject<number>;
let gateIdRef: React.MutableRefObject<number>;

// updates id counters when circuits are imported. don't want the counters to start at 0, want the ids to start at the next available number
export const setRefs = (refs: {
  nodeIdRef: React.MutableRefObject<number>,
  gateIdRef: React.MutableRefObject<number>
}) => {
  nodeIdRef = refs.nodeIdRef;
  gateIdRef = refs.gateIdRef;
};

export const syncNodeCounters = (nodes: Node[]) => {
  const maxNodeId = Math.max(
    ...nodes
      .filter((n) => n.type === "custom")
      .map((n) => parseInt(n.id, 10))
      .filter((id) => !isNaN(id)),
    -1
  );

  const maxGateId = Math.max(
    ...nodes
      .filter((n) => n.type === "and" || n.type === "or")
      .map((n) => parseInt(n.id.replace("g", ""), 10))
      .filter((id) => !isNaN(id)),
    -1
  );

  if (nodeIdRef && gateIdRef) {
    nodeIdRef.current = maxNodeId + 1;
    gateIdRef.current = maxGateId + 1;
  } else {
    console.warn("Refs not initialized before calling syncNodeCounters");
  }
};
