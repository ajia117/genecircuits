import os
import numpy as np
import scipy.integrate
import bokeh.io
import bokeh.models
import bokeh.plotting
import bokeh.palettes

bokeh.io.output_notebook()

def cascade_rhs(yz, t, beta_y, beta_z, gamma, n_x, n_y, x_fun, x_args):
    """
    Right-hand side for cascade X -> Y -> Z with a time-dependent x.
    """
    # Compute x as a step function evaluated at time t
    x = x_fun(t, *x_args)

    # Unpack y and z
    y, z = yz

    # Compute derivatives
    dy_dt = beta_y * x**n_x / (1 + x**n_x) - y
    dz_dt = gamma * (beta_z * y**n_y / (1 + y**n_y) - z)
    
    return np.array([dy_dt, dz_dt])

def x_pulse(t, period, high_time, x_0):
    """
    Generates a pulse train for X:
    - `period`: Total duration of one cycle
    - `high_time`: Time duration X is HIGH in each cycle
    - `x_0`: Maximum X value
    """
    return x_0 if (t % period) < high_time else 0  # Alternates ON/OFF

# Ensure "plots" directory exists
os.makedirs("plots", exist_ok=True)

# Time points
t = np.linspace(0, 20, 400)  # 20 seconds with 400 steps

# Parameters
beta_y, beta_z, gamma = 2.5, 1.0, 1.0  # Adjusted for sharp transitions
n_x, n_y = 1, 1  # Hill coefficients
x_0 = 1.0  # Maximum X value

# Pulse train settings (2s ON, 2s OFF)
pulse_period = 4  # Total cycle duration (2s ON + 2s OFF)
high_time = 2  # Time X is HIGH

# Initial condition
yz_0 = np.array([0.0, 0.0])

# Integrate ODES with a pulse train as input
args = (beta_y, beta_z, gamma, n_x, n_y, x_pulse, (pulse_period, high_time, x_0))
yz = scipy.integrate.odeint(cascade_rhs, yz_0, t, args=args)

# Extract y and z
y, z = yz.T

# Compute x separately for plotting
x = np.array([x_pulse(time, pulse_period, high_time, x_0) for time in t])

# Define colors
colors = bokeh.palettes.d3['Category10'][3]

# Create plot
p = bokeh.plotting.figure(width=600, height=300, x_axis_label="dimensionless time", y_axis_label="dimensionless conc.")

# Add lines for x, y, and z
p.line(t, x, line_width=2, color=colors[0], legend_label="x (pulsed)")
p.line(t, y, line_width=2, color=colors[1], legend_label="y")
p.line(t, z, line_width=2, color=colors[2], legend_label="z")

# Set legend position
p.legend.location = "top_right"

# Show plot
bokeh.io.output_file("plots/ffl_pulse_plot.html")
bokeh.io.show(p)
