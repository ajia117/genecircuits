import numpy as np
from simulate import run_simulation, x_pulse
from protein import Protein, Gate
import bokeh.application
from   bokeh.io import output_file
import bokeh.plotting as bp

bokeh.io.output_notebook()

# TODO: generalize this to take in any circuit. For now, this tests the simulator with a ffl for short and long pulse
"""
Protein 0 AND Protein 1 -> Protein 2
Protein 2 AND Protein 3 -> Protein 4
"""

def plot_results(final_concentrations, t, proteinArray, concTitle = "Backend.py Concentrations", inputTitle = "Backend.py Inputs"):
    # Set up color palette
    colors = bokeh.palettes.d3['Category10'][10]

    transposed_conc = final_concentrations.transpose()
    # Plot output proteins
    plot_outputs = bp.figure(width=500,
                            height=300,
                            x_axis_label='dimensionless time',
                            y_axis_label='dimensionless concentrations',
                            title=concTitle)

    # Plot the input proteins
    plot_inputs = bp.figure(width=500,
                            height=300,
                            x_axis_label='dimensionless time',
                            y_axis_label='dimensionless x',
                            title=inputTitle)

    for i in range(len(proteinArray)):
        protein = proteinArray[i]
        if protein.mGates != []: 
            conc = transposed_conc[i]
            plot_outputs.line(t, conc, line_width=2, color=colors[i], legend_label=protein.getName())
        if protein.mExtConcFunc != None:
            plot_inputs.line(t, protein.mExtConcFunc(t, *protein.mExtConcFuncArgs), line_width=2, color=colors[i], legend_label=protein.getName())

    # Place the legend
    plot_outputs.legend.location = 'bottom_right'

    #Show plot
    output_file("plots/simulation_results_1.html")
    layout = bokeh.layouts.column(plot_outputs, plot_inputs)
    bokeh.io.show(layout)

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
plot_results(final_concentrations, t, proteinArray, "Backend.py: FFL", "Backend.py: Short Pulse Input")


# Repeat with long pulse:
# Set up parameters for the pulse
x_args = (0, 15, 20, 1.0, 0.5)

# Update input gate's args
proteinArray[0].mExtConcFuncArgs = x_args

# Reset initial concentrations in protein array:
for protein in proteinArray:
    protein.setInternalConcentration(0.0) # TODO: create a reset function?

final_concentrations = run_simulation(t, proteinArray)
plot_results(final_concentrations, t, proteinArray, "Backend.py: FFL", "Backend.py: Long Pulse Input")

# Repeat with XOR circuit (params from xor_circuit.py):
n = 1000

# Time points
t = np.linspace(0, 80, n)

a_args = (0, 40, 30, 2, 0.5)
b_args = (15, 50, 20, 2, 1)
proteinArray = [Protein(0, "Protein A", 0.0, 1, 0.0, [], x_pulse, a_args), Protein(1, "Protein B", 0.0, 1, 0.00, [],  x_pulse, b_args), Protein(2, "Protein C", 0.0, 2, 0.1, [Gate("aa_and", 0, 1)]), Protein(3, "Protein D", 0.0, 2, 0.1, [Gate("aa_or", 0, 1)]), Protein(4, "Protein E", 0.0, 0, 0.2, [Gate("ar_and", 3, 2)])]


final_concentrations = run_simulation(t, proteinArray)
plot_results(final_concentrations, t, proteinArray, "Backend.py: XOR")