import numpy as np
import pytest
from simulate import run_simulation, x_pulse
from protein import Protein, Gate

def runAllTests():
    test_ffl_simulation()
    test_xor_simulation()

def test_ffl_simulation():
    # Specify expected results. These are based on the ../biocircuits_experimentation/ffl_biocircuit.py script
    expected_short_concentrations = np.loadtxt("../biocircuits_experimentation/tests/ffl_short_results.txt")
    expected_long_concentrations = np.loadtxt("../biocircuits_experimentation/tests/ffl_long_results.txt")

    # Start with short pulse
    x_args = (0, 2, 2, 1.0, 0.5)

    # Create a list of proteins
    # TODO: change hill coefficients to be dependent on combinations of two proteins
    proteinArray = [Protein(0, "Protein 0", 0.0, 3, 1, [], x_pulse, x_args), Protein(1, "Protein 1", 0.0, 3, 1, [Gate("act_hill", 0, 0)]), Protein(2, "Protein 2", 0.0, 3, 1, [Gate("aa_and", 0, 1)])]

    # Run the simulation
    duration = 20
    n = 1000
    # Time points
    t = np.linspace(0, duration, n)

    final_concentrations = run_simulation(t, proteinArray)

    # compare results to expected
    assert np.allclose(final_concentrations, expected_short_concentrations, atol=1e-5)

    # Repeat with long pulse:
    # Set up parameters for the pulse
    x_args = (0, 15, 20, 1.0, 0.5)

    # Update input gate's args
    proteinArray[0].mExtConcFuncArgs = x_args

    # Reset initial concentrations in protein array:
    for protein in proteinArray:
        protein.setInternalConcentration(0.0)

    final_concentrations = run_simulation(t, proteinArray)
     # compare results to expected
    assert np.allclose(final_concentrations, expected_long_concentrations, atol=1e-5)


def test_xor_simulation():
    # Specify expected results. These are based on the ../biocircuits_experimentation/xor_circuit.py script
    expected_concentrations = np.loadtxt("../biocircuits_experimentation/tests/xor_results.txt")
    n = 1000
    # Time points
    t = np.linspace(0, 80, n)

    a_args = (0, 40, 30, 2, 0.5)
    b_args = (15, 50, 20, 2, 1)
    proteinArray = [Protein(0, "Protein A", 0.0, 1, 0.0, [], x_pulse, a_args), Protein(1, "Protein B", 0.0, 1, 0.00, [],  x_pulse, b_args), Protein(2, "Protein C", 0.0, 2, 0.1, [Gate("aa_and", 0, 1)]), Protein(3, "Protein D", 0.0, 2, 0.1, [Gate("aa_or", 0, 1)]), Protein(4, "Protein E", 0.0, 0, 0.2, [Gate("ar_and", 3, 2)])]

    final_concentrations = run_simulation(t, proteinArray)
    assert np.allclose(final_concentrations, expected_concentrations, atol=1e-5)


# TODO: handle command line args, to run individual tests if desired
def main():
    print("Running all test cases...")
    pytest.main(["-v", "test_simulator.py::test_ffl_simulation", "test_simulator.py::test_xor_simulation"])

# Run the script
if __name__ == '__main__':
    main()