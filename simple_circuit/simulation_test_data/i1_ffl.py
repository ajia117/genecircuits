import biocircuits.apps
import bokeh.io
import numpy as np
from scipy.interpolate import interp1d

# Code from: https://biocircuits.github.io/chapters/04_ffls.html#The-I1-FFL-with-AND-logic-gives-an-accelerated-response:~:text=a%20pulse%20generator.-,The%20I1%2DFFL%20with%20AND%20logic%20gives%20an%20accelerated%20response,-%EF%83%81
# biocircuits.apps.plot_ffl defined here: https://github.com/justinbois/biocircuits/blob/master/biocircuits/apps/ffl.py 

# Parameter values
beta = 1 # We have not yet implemented beta, but their example uses beta = 5
gamma = 1
kappa = 1 # We will not use kappa, so set it to 1
n_xy, n_yz = 3, 3
n_xz = 5
t = np.linspace(0, 10, 200)

# Set up and solve
p, cds, cds_x = biocircuits.apps.plot_ffl(
    beta,
    gamma,
    kappa,
    n_xy,
    n_xz,
    n_yz,
    ffl="i1",
    logic="and",
    t=t,
    t_step_down=np.inf,
    normalized=False,
)

# Uncomment to see plot

colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"]
p.line(
    t, 1 - np.exp(-t), line_width=2, color=colors[4], legend_label="unregulated",
)

bokeh.io.show(p)

# x = cds_x.data["x"]
y = cds.data["y"][1:] # first element is redundant. size should be 200
z = cds.data["z"][1:] # first element is redundant. size should be 200

# the cds_x array is not the same size as the y and z arrays, because x is a step function
# Interpolate x values from cds_x onto the time grid t, which is the same for y and z
t_x = cds_x.data["t"]
x_vals = cds_x.data["x"]

# Create interpolation function
x_interp_func = interp1d(t_x, x_vals, bounds_error=False, fill_value="extrapolate")

# Interpolated x values on the same grid as y and z
x_on_uniform_t = x_interp_func(t)

# Create list of tuples (each row = [x, y, z])
combined = list(zip(x_on_uniform_t, y, z))

# Save to file as text
with open("i1_ffl_results.txt", "w") as f:
    np.savetxt(f, combined, delimiter="\t", comments='')
