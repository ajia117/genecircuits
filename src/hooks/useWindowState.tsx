import { useState, useCallback } from 'react';
import { FetchOutputImage} from "../types/FetchOutputReturnType";
import WindowSettingsType from "../types/WindowSettingsType";

export function useWindowState() {
    const [showOutputWindow, setShowOutputWindow] = useState<boolean>(false);
    const [outputWindowSettings, setOutputWindowSettings] = useState<WindowSettingsType>({
        x: 0,
        y: 0,
        width: 300,
        height: 200
    });

    const [showHillCoeffMatrix, setShowHillCoeffMatrix] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('toolbox');
    const [outputData, setOutputData] = useState<FetchOutputImage | null>();

    const [circuitSettings, setCircuitSettings] = useState({
        projectName: "Untitled Project",
        simulationDuration: 20,
        numTimePoints: 10
    });

    const toggleOutputWindow = useCallback(() => {
        setShowOutputWindow(prev => !prev);
    }, []);

    const toggleHillCoeffMatrix = useCallback(() => {
        setShowHillCoeffMatrix(prev => !prev);
    }, []);

    const resetWindowPositions = useCallback(() => {
        setOutputWindowSettings({
            x: 0,
            y: 0,
            width: 300,
            height: 200
        });
    }, []);

    return {
        // Output window
        showOutputWindow,
        setShowOutputWindow,
        toggleOutputWindow,
        outputWindowSettings,
        setOutputWindowSettings,

        // Hill coefficient matrix
        showHillCoeffMatrix,
        setShowHillCoeffMatrix,
        toggleHillCoeffMatrix,

        // Tab state
        activeTab,
        setActiveTab,

        // Output data
        outputData,
        setOutputData,

        // Circuit settings
        circuitSettings,
        setCircuitSettings,

        // Utility functions
        resetWindowPositions
    };
}