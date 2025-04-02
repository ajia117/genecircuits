import numpy as np
from protein import PROTEIN_ARRAY
from simulate import run_simulation
import bokeh.application
from   bokeh.io import output_file
import bokeh.plotting as bp

bokeh.io.output_notebook()

"""
Protein 0 -> Protein 1
Protein 0 AND Protein 1 -> Protein 2
"""

# Run the simulation
duration = 20
n = 1000
# Time points
t = np.linspace(0, duration, n)

final_concentrations = run_simulation(t)

# Set up color palette
colors = bokeh.palettes.d3['Category10'][10]

# Pluck out x, y and z
transposed_conc = final_concentrations.transpose()

# Set up plot
plot = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless concentrations')

for i in range(len(PROTEIN_ARRAY)):
    protein = PROTEIN_ARRAY[i]
    conc = transposed_conc[i]
    plot.line(t, conc, line_width=2, color=colors[i], legend_label=protein.getName())

# Place the legend
plot.legend.location = 'bottom_right'

# Plot the input proteins

#Show plot
output_file("plots/simulation_results.html")
layout = bokeh.layouts.column(plot)
bokeh.io.show(layout)