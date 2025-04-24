# From this example: http://be150.caltech.edu/2020/content/lessons/08_repressilator.html#:~:text=def%20repressilator_rhs(x%2C%20t%2C%20beta%2C%20n)%3A 
# Which appears to use three rep hill functions

import numpy as np
import scipy.integrate
import bokeh.plotting
import bokeh.palettes
from scipy.interpolate import interp1d

def repressilator_rhs(x, t, beta, n):
    """
    Returns 3-array of (dx_1/dt, dx_2/dt, dx_3/dt)
    """
    x_1, x_2, x_3 = x

    return np.array(
        [
            beta / (1 + x_3 ** n) - x_1,
            beta / (1 + x_1 ** n) - x_2,
            beta / (1 + x_2 ** n) - x_3,
        ]
    )


# Initial condiations
x0 = np.array([1, 1, 1.2])

# Number of points to use in plots
n_points = 1000

# Build the plot
def repressilator_plot(beta, n, t_max):
    # Solve for species concentrations
    t = np.linspace(0, t_max, n_points)
    x = scipy.integrate.odeint(repressilator_rhs, x0, t, args=(beta, n))

    # Save results to file
    with open("repressilator_results.txt", "w") as f:
        np.savetxt(f, x, comments="")

    colors = bokeh.palettes.d3["Category10"][3]

    p = bokeh.plotting.figure(
        frame_width=550, frame_height=200, x_axis_label="t", x_range=[0, t_max]
    )

    for i, x_vals in enumerate(x.transpose()):
        p.line(
            t, x_vals, line_width=2, color=colors[i], legend_label=str(i + 1)
        )

    p.legend.location = "top_left"

    return p


# Set up parameters
beta = 5
n = 3
t_max = 10
# Call solver
p = repressilator_plot(beta, n, t_max)
# Show plot
bokeh.plotting.output_file("repressilator_plot.html")
bokeh.plotting.show(p)

