import numpy as np
from simulate import run_simulation
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

def x_pulse(t, t_0, t_f, tau, x_0, duty_cycle):
    """
    Returns x value for a pulse beginning at t = t_0 with a period of tau. 
    duty_cycle is the fraction of the period that the pulse is on. This should be between 0 and 1.
    x_0 is the amplitude of the pulse.
    t_f is when the pulse should stop.
    """
    # Find how far into the current period we are. Use floor to support floating point values.
    t_since_period_start = t - t_0 - ((t - t_0) // (tau))*(tau)

    return np.logical_and(t >= t_0, np.logical_and(t <= t_f, t_since_period_start <= tau*duty_cycle)) * x_0

x_args = (3.0, 19.0, 5.0, 2.0, 0.2)

# Create a list of proteins
proteinArray = [Protein(0, "Protein 0", 0.0, 1, 0.05, [], x_pulse, x_args), Protein(1, "Protein 1", 0.0, 4, 0.05, [Gate("act_hill", 0, 0)]), Protein(2, "Protein 2", 0.0, 1, 0.05, [Gate("aa_and", 0, 1)])]


# Run the simulation
duration = 20
n = 1000
# Time points
t = np.linspace(0, duration, n)

final_concentrations = run_simulation(t, proteinArray)

# Set up color palette
colors = bokeh.palettes.d3['Category10'][10]

# Set up plot
transposed_conc = final_concentrations.transpose()
plot = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless concentrations',
                          title='Backend.py: Concentrations')

for i in range(len(proteinArray)):
    protein = proteinArray[i]
     # Don't plot if it's not an output of the circuit
    if protein.mGates == []: 
        continue
    conc = transposed_conc[i]
    plot.line(t, conc, line_width=2, color=colors[i], legend_label=protein.getName())

# Place the legend
plot.legend.location = 'bottom_right'

# Plot the input proteins
plot_input = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless x',
                          title='Backend.py: Short input pulse')

# Populate glyphs TODO: loop through all proteins and plot if their external concentration functions aren't None
plot_input.line(t, x_pulse(t, 3.0, 19.0, 5.0, 2.0, 0.2), line_width=2)

#Show plot
output_file("plots/simulation_results_1.html")
layout = bokeh.layouts.column(plot, plot_input)
bokeh.io.show(layout)

# Repeat with long pulse:
# Set up parameters for the pulse
x_args = (3.0, 19.0, 5.0, 2.0, 0.5) # the only change is the duty cycle

# Update input gate's args
proteinArray[0].mExtConcFuncArgs = x_args

# Reset initial concentrations in protein array:
for protein in proteinArray:
    protein.setInternalConcentration(0.0) # TODO: create a reset function?

final_concentrations = run_simulation(t, proteinArray)

# Set up color palette
colors = bokeh.palettes.d3['Category10'][10]

# Pluck out x, y and z
transposed_conc = final_concentrations.transpose()

# Set up plot
plot = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless concentrations',
                          title='Backend.py: Concentrations')

for i in range(len(proteinArray)):
    protein = proteinArray[i]
    if protein.mGates == []: 
        continue
    conc = transposed_conc[i]
    plot.line(t, conc, line_width=2, color=colors[i], legend_label=protein.getName())

# Place the legend
plot.legend.location = 'bottom_right'

# Plot the input proteins
plot_input = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless x',
                          title='Backend.py: Long input pulse')

# Populate glyphs
plot_input.line(t, x_pulse(t, 3.0, 19.0, 5.0, 2.0, 0.5), line_width=2)

#Show plot
output_file("plots/simulation_results_2.html")
layout = bokeh.layouts.column(plot, plot_input)
bokeh.io.show(layout)
