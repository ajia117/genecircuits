import domtoimage from 'dom-to-image';
import {CircuitSettingsType} from "../../types";


export const saveCircuitAsImage = async (
    type: 'png' | 'jpeg',
    circuitSettings: CircuitSettingsType
): Promise<void> => {

    if (type !== "png" && type !== "jpeg") {
        throw new Error("Unsupported image type. Use 'png' or 'jpeg'.");
    }

    // Find the circuit element
    const circuit = document.querySelector('.flow-wrapper') as HTMLElement;

    if (!circuit) {
        throw new Error('Could not find the circuit area to export.');
    }

    try {
        const options = {
            cacheBust: true,
            quality: 0.95,
            pixelRatio: 2,
            width: circuit.offsetWidth,
            height: circuit.offsetHeight,
            style: {
                '.react-flow__edge': {
                    visibility: 'visible',
                    opacity: '1'
                },
                '.react-flow__edge-path': {
                    stroke: '#000',
                    strokeWidth: '1px'
                }
            }
        };

        let dataUrl;
        if (type === 'png') {
            dataUrl = await domtoimage.toPng(circuit, options);
        } else {
            dataUrl = await domtoimage.toJpeg(circuit, options);
        }

        // Create and trigger download link
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${circuitSettings.projectName || 'circuit'}.${type}`;
        a.click();
    } catch (err) {
        console.error('Export error:', err);
        throw new Error(`Failed to export image: ${err instanceof Error ? err.message : String(err)}`);
    }
};