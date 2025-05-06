import { CircuitTemplate } from "../../types";
import feedForwardLoop from "./feedForwardLoop";
import repressilator from "./repressilator";
import toggleSwitch from "./toggleSwitch";
import incoherentFeedForwardLoop from "./incoherentFeedForwardLoop";

export const prebuiltCircuitTemplates: CircuitTemplate[] = [
    toggleSwitch,
    repressilator,
    feedForwardLoop,
    incoherentFeedForwardLoop,
];
