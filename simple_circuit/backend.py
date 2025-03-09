import numpy as np
from simulate import run_simulation
from protein import Protein, Gate
import bokeh.application
from   bokeh.io import output_file
import bokeh.plotting as bp

bokeh.io.output_notebook()

"""
Protein 0 AND Protein 1 -> Protein 2
Protein 2 AND Protein 3 -> Protein 4
"""

# Create a list of proteins
# Protein(3, "Protein 3", 0.0, 1, 0.05, [], 3.0), Protein(4, "Protein 4", 0.0, 1, 0.05, [Gate("aa_and", 2, 3)])
#PROTEIN_ARRAY = [Protein(0, "Protein 0", 0.0, 1, 0.05, [], 1.0), Protein(1, "Protein 1", 0.0, 1, 0.05, [], 2.0), Protein(2, "Protein 2", 0.0, 1, 0.05, [Gate("aa_and", 0, 1)]), Protein(3, "Protein 3", 0.0, 1, 0.05, [], 3), Protein(4, "Protein 4", 0.0, 1, 0.05, [Gate("aa_and", 2, 3)])]
proteinArray = [Protein(0, "Protein 0", 0.0, 1, 0.05, [], 1.0), Protein(1, "Protein 1", 0.0, 4, 0.05, [Gate("act_hill", 0, 0)]), Protein(2, "Protein 2", 0.0, 1, 0.05, [Gate("aa_and", 0, 1)])]


# Run the simulation
duration = 20
n = 1000
# Time points
t = np.linspace(0, duration, n)

final_concentrations = run_simulation(t, proteinArray)

# Set up color palette
colors = bokeh.palettes.d3['Category10'][10]

# Pluck out x, y and z
transposed_conc = final_concentrations.transpose()

# Set up plot
plot = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless concentrations')

for i in range(len(proteinArray)):
    protein = proteinArray[i]
    conc = transposed_conc[i]
    plot.line(t, conc, line_width=2, color=colors[i], legend_label=protein.getName())

# Place the legend
plot.legend.location = 'bottom_right'

# Plot the input proteins

#Show plot
output_file("plots/simulation_results.html")
layout = bokeh.layouts.column(plot)
bokeh.io.show(layout)