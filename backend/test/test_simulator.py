import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import numpy as np
import pytest
from simulate import run_simulation, x_pulse
from protein import Protein, Gate
import bokeh.plotting as bp
from   bokeh.io import output_file
import bokeh.palettes

def runAllTests():
    test_ffl_simulation()
    test_xor_simulation()

def plot_results(t, final_concentrations, title):
    # Create a plot for the results
    p = bp.figure(width=500,
                  height=300,
                  x_axis_label='dimensionless time',
                  y_axis_label='dimensionless concentrations',
                  title=title)

    # Populate glyphs
    colors = bokeh.palettes.d3['Category10'][10]
    for i in range(final_concentrations.shape[1]):
        p.line(t, final_concentrations[:, i],
               line_width=2,
               color=colors[i],
               legend_label=f'Protein {i}')

    # Place the legend
    p.legend.location = 'bottom_right'

    # Show plot
    output_file(f"{title}.html")
    layout = bokeh.layouts.column(p)
    bokeh.io.show(layout)

def test_ffl_simulation():
    # Specify expected results. These are based on the ../biocircuits_experimentation/ffl_biocircuit.py script
    expected_short_concentrations = np.loadtxt("simulation_test_data/ffl_short_results.txt")
    expected_long_concentrations = np.loadtxt("simulation_test_data/ffl_long_results.txt")

    # Start with short pulse
    x_args = (0, 2, 2, 1.0, 0.5)

    # Create a list of proteins
    proteinArray = [Protein(0, "Protein 0", 0.0, 1, [], x_pulse, x_args), Protein(1, "Protein 1", 0.0, 1, [Gate("act_hill", firstInput=0)]), Protein(2, "Protein 2", 0.0, 1, [Gate("aa_and", firstInput=0, secondInput=1, firstHill=3, secondHill=3)])]

    # Run the simulation
    duration = 20
    n = 1000
    # Time points
    t = np.linspace(0, duration, n)

    final_concentrations = run_simulation(t, proteinArray)

    # write results to file
    with open("simulation_test_data/ffl_short_actual_results.log", "w") as f:
        np.savetxt(f, final_concentrations, comments='')

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
    # write results to file
    with open("simulation_test_data/ffl_long_actual_results.log", "w") as f:
        np.savetxt(f, final_concentrations, comments='')
     # compare results to expected
    assert np.allclose(final_concentrations, expected_long_concentrations, atol=1e-5)


def test_xor_simulation():
    # Specify expected results. These are based on the ../biocircuits_experimentation/xor_circuit.py script
    expected_concentrations = np.loadtxt("simulation_test_data/xor_results.txt")
    n = 1000
    # Time points
    t = np.linspace(0, 80, n)

    a_args = (0, 40, 30, 2, 0.5)
    b_args = (15, 50, 20, 2, 1)
    proteinArray = [Protein(0, "Protein A", 0.0, 0.0, [], x_pulse, a_args), Protein(1, "Protein B", 0.0, 0.00, [],  x_pulse, b_args), Protein(2, "Protein C", 0.0, 0.1, [Gate("aa_and", firstInput=0, secondInput=1)]), Protein(3, "Protein D", 0.0, 0.1, [Gate("aa_or", firstInput=0, secondInput=1)]), Protein(4, "Protein E", 0.0, 0.2, [Gate("ar_and", firstInput=3, secondInput=2, firstHill=2, secondHill=2)])]

    final_concentrations = run_simulation(t, proteinArray)
    
    # write results to file
    with open("simulation_test_data/xor_actual_results.log", "w") as f:
        np.savetxt(f, final_concentrations, comments='')
    
    assert np.allclose(final_concentrations, expected_concentrations, atol=1e-5)

def test_i1_ffl_simulation():
    # Specify expected results. These are based on the ../biocircuits_experimentation/xor_circuit.py script
    expected_concentrations = np.loadtxt("simulation_test_data/i1_ffl_results.txt")
    n = 200
    gamma = 1
    n_xy, n_yz = 3, 3
    n_xz = 5
    t_stepdown = np.inf
    duration = 10
    x_0 = 1.0
    t = np.linspace(0, duration, n)
    x_args = (0.04, t_stepdown,duration, x_0, 1)

    proteinArray = [Protein(0, "Protein X", 0.0, 0.0, [], x_pulse, x_args), Protein(1, "Protein Y", 0.0, gamma, [Gate("act_hill", firstInput=0, firstHill=n_xy)], None, None, 3), Protein(2, "Protein Z", 0.0, gamma, [Gate("ar_and", firstInput=0, secondInput=1, firstHill=n_xz, secondHill=n_yz)], None, None)]

    final_concentrations = run_simulation(t, proteinArray)
    plot_results(t, final_concentrations, "I1 FFL Simulation Results")

    # write out to file
    with open("simulation_test_data/i1_ffl_actual_results.log", "w") as f:
        np.savetxt(f, final_concentrations, comments='')
    assert np.allclose(final_concentrations, expected_concentrations, atol=1e-1) # Tolerance is 0.1

def test_repressilator():
    # Specify expected results. These are based on the ../biocircuits_experimentation/xor_circuit.py script
    expected_concentrations = np.loadtxt("simulation_test_data/repressilator_results.txt")
    n = 1000
    gamma = 1
    n_all = 3
    beta_all = 5
    duration = 10
    x0 = np.array([1, 1, 1.2])
    t = np.linspace(0, duration, n)

    proteinArray = [Protein(0, "Protein 1", x0[0], gamma, [Gate("rep_hill", firstInput=2, firstHill=n_all)], None, None, beta_all), Protein(1, "Protein 2", x0[1], gamma, [Gate("rep_hill", firstInput=0, firstHill=n_all)], None, None, beta_all), Protein(2, "Protein 3", x0[2], gamma, [Gate("rep_hill", firstInput=1, firstHill=n_all)], None, None, beta_all)]

    final_concentrations = run_simulation(t, proteinArray)
    plot_results(t, final_concentrations, "Repressilator Simulation Results")

    # write out to file
    with open("simulation_test_data/repressilator_actual_results.log", "w") as f:
        np.savetxt(f, final_concentrations, comments='')
    assert np.allclose(final_concentrations, expected_concentrations, atol=1e-12)

def test_toggle_switch():
    n = 600
    duration = 30
    t = np.linspace(0, duration, n)

    gamma = 1.0
    hill_n = 3
    beta = 1.5  

    proteins = [
        Protein(0, "A", 1.0, gamma, [Gate("rep_hill", firstInput=1, firstHill=hill_n)], None, None, beta),
        Protein(1, "B", 1.2, gamma, [Gate("rep_hill", firstInput=0, firstHill=hill_n)], None, None, beta),
    ]

    conc = run_simulation(t, proteins)
    plot_results(t, conc, "Toggle Switch Simulation Results")
    assert conc.shape == (n, 2)
    assert np.all(np.isfinite(conc))
    assert conc.min() > -1e-9
    assert conc[-1, 1] > conc[-1, 0]  # Protein B > Protein A at the end


def test_toggle_switch_opposite_concentrations():
    n = 600
    duration = 30
    t = np.linspace(0, duration, n)

    gamma = 1.0
    hill_n = 3
    beta = 1.5  

    proteins = [
        Protein(0, "A", 1.2, gamma, [Gate("rep_hill", firstInput=1, firstHill=hill_n)], None, None, beta),
        Protein(1, "B", 1.0, gamma, [Gate("rep_hill", firstInput=0, firstHill=hill_n)], None, None, beta),
    ]

    conc = run_simulation(t, proteins)
    plot_results(t, conc, "Toggle Switch Simulation Results")
    assert conc.shape == (n, 2)
    assert np.all(np.isfinite(conc))
    assert conc.min() > -1e-9
    assert conc[-1, 0] > conc[-1, 1]

# TODO: handle command line args, to run individual tests if desired
def main():
    print("Running all test cases...")
    pytest.main(["-v", "test_simulator.py::test_ffl_simulation", "test_simulator.py::test_xor_simulation", "test_simulator.py::test_i1_ffl_simulation", "test_simulator.py::test_repressilator", "test_simulator.py::test_toggle_switch", "test_simulator.py::test_toggle_switch_opposite_concentrations"])

# Run the script
if __name__ == '__main__':
    main()