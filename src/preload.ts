import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use IPC
contextBridge.exposeInMainWorld('electron', {
  runSimulation: (circuitData: any) => ipcRenderer.invoke('run-simulation', circuitData),
});