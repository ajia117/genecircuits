import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProteinDataForm from '../components/ProteinDataForm';
import { ProteinData } from '../types';

const genericNodeData: ProteinData = {
    label: 'TestProtein',
    initialConcentration: 1,
    lossRate: 1,
    beta: 1,
    inputs: 1,
    outputs: 1,
    inputFunctionType: 'steady-state',
    inputFunctionData: {
        steadyStateValue: 0,
        timeStart: 0,
        timeEnd: 1,
        pulsePeriod: 1,
        amplitude: 1,
        dutyCycle: 0.5,
    }
};

describe('ProteinDataForm validation', () => {
    test('reports valid on mount and shows no error', async () => {
        const onValidityChange = jest.fn();
        const Wrapper = () => {
            const [data, setData] = React.useState<ProteinData>(genericNodeData);
            return (
                <div>
                    <ProteinDataForm mode="create" proteinData={data} setProteinData={setData} onValidityChange={onValidityChange} />
                </div>
            );
        };

        render(<Wrapper />);

        // initially no error message
        expect(screen.queryByText(/The following fields must be non-negative/)).not.toBeInTheDocument();

        // onValidityChange should be called with true (valid)
        await waitFor(() => expect(onValidityChange).toHaveBeenCalledWith(true));
    });

    test('shows error and highlights field when value becomes negative', async () => {
        const onValidityChange = jest.fn();
        const Wrapper = () => {
            const [data, setData] = React.useState<ProteinData>(genericNodeData);
            return (
                <div>
                    <ProteinDataForm mode="create" proteinData={data} setProteinData={setData} onValidityChange={onValidityChange} />
                    <button data-testid="make-negative" onClick={() => setData({ ...data, lossRate: -5 })}>Make Negative</button>
                </div>
            );
        };

        render(<Wrapper />);

        // click the button to set a negative value
        fireEvent.click(screen.getByTestId('make-negative'));

        // expect error message to appear
        await waitFor(() => expect(screen.getByText(/The following fields must be non-negative/)).toBeInTheDocument());

        // onValidityChange should be called with false
        await waitFor(() => expect(onValidityChange).toHaveBeenCalledWith(false));

        // find the Loss Rate label and its associated input and check style
        const label = screen.getByText('Loss Rate');
        const container = label.closest('div');
        const input = container ? container.querySelector('input') as HTMLInputElement | null : null;
        expect(input).not.toBeNull();
        if (input) {
            expect(input).toHaveStyle('border: 1px solid red');
        }
    });
});
