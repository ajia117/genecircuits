from protein import Protein
from protein import InputProtein
from protein import Gate
import numpy as np
import scipy.integrate
import biocircuits
import bokeh.application
from   bokeh.io import output_file
import bokeh.plotting as bp

bokeh.io.output_notebook()

# TODO: leave descriptor
def simulation_iter(concentrations, t, proteins, inputs):
    # For each input in inputs, update their current concentration
    for input in inputs:
        concentrations[input.getID()] += input.getConcentration(t)

    # For each protein in proteins, calculate their production rate
    production_rates = [0.0] * len(proteins)
    for protein in proteins:
        production_rates[protein.getID()] = protein.CalcProdRate(concentrations)

    # Return the result as a NumPy array
    return production_rates


def run_simulation(protein_list, inputs_list, duration):
    # Number of time points we want for the solutions
    n = 1000

    # Time points
    t = np.linspace(0, duration, n)

    # Initial concentrations each protein
    initial_concentrations = [0.0] * len(protein_list)
    for protein in protein_list:
        initial_concentrations[protein.getID()] = protein.getInitialConcentration()

    args = (protein_list, inputs_list) # each input should also have a function corresponding to its concentration

    # Integrate!
    final_concentrations =  scipy.integrate.odeint(simulation_iter, initial_concentrations, t, args=args)
    return final_concentrations



"""
TODO:
Create a list of proteins and inputs
Call run_simulation
Show results
"""

# Create a list of proteins
proteins = [Protein(0, 0.0, 1, 0.05, [Gate('activation', 1, 0)]), Protein(1, 0.0, 4, 0.05, [Gate('activation', 0, 1)])]

# Create a list of inputs
inputs = [InputProtein(0), InputProtein(2)]

# Run the simulation
duration = 20
final_concentrations = run_simulation(proteins, inputs, duration)

# Set up color palette
colors = bokeh.palettes.d3['Category10'][10]

# Pluck out x, y and z
transposed_conc = final_concentrations.transpose()

# Set up plot
plot = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless concentrations')

# Place the legend
plot.legend.location = 'bottom_right'

for i in range(len(proteins)):
    protein = proteins[i]
    conc = transposed_conc[i]
    plot.line(duration, conc, line_width=2, color=colors[i], legend_label=protein.getID())


# Plot the input proteins
# TODO: replace mConc with the concentration function
for i in range(len(inputs)):
    input = inputs[i]
    plot.line(duration, input.mConc, line_width=2, color=colors[i + len(proteins)], legend_label=input.getID())

p_x = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless x')

#Show plot
output_file("plots/simulation_results.html")
layout = bokeh.layouts.column(plot, p_x)
bokeh.io.show(layout)