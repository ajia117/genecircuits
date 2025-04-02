import numpy as np
import scipy.integrate

import biocircuits

import bokeh.application
import bokeh.application.handlers
import bokeh.io
import bokeh.models
import bokeh.plotting

bokeh.io.output_notebook()

def cascade_rhs(yz, t, beta_y, beta_z, gamma, n_x, n_y, x):
    """
    Right hand side for cascade X -> Y -> Z.  Return dy/dt and dz/dt.
    """
    # Unpack y and z
    y, z = yz
    
    # Compute dy/dt
    dy_dt = beta_y * x**n_x / (1 + x**n_x) - y
    
    # Compute dz/dt
    dz_dt = gamma * (beta_z * y**n_y / (1 + y**n_y) - z)
    
    # Return the result as a NumPy array
    return np.array([dy_dt, dz_dt])

# Number of time points we want for the solutions
n = 400

# Time points we want for the solution
t = np.linspace(0, 10, n)

# Initial condition
yz_0 = np.array([0.0, 0.0])

# Parameters
beta_y = 1.0
beta_z = 1.0
gamma = 1.0
n_x = 2
n_y = 2
x_0 = 2.0

# Package parameters into a tuple
args = (beta_y, beta_z, gamma, n_x, n_y, x_0)

# Integrate ODES
#yz = scipy.integrate.odeint(cascade_rhs, yz_0, t, args=args)

# Set up color palette for this notebook
colors = bokeh.palettes.d3['Category10'][10]

# Pluck out y and z
#y, z = yz.transpose()

def x_pulse(t, t_0, tau, x_0):
    """
    Returns x value for a pulse beginning at t = 0 
    and ending at t = t_0 + tau.
    """
    return np.logical_and(t >= t_0, t <= (t_0 + tau)) * x_0

def cascade_rhs_x_fun(yz, t, beta_y, beta_z, gamma, n_x, n_y, x_fun, x_args):
    """
    Right hand side for cascade X -> Y -> Z.  Return dy/dt and dz/dt.
    
    x_fun is a function of the form x_fun(t, *x_args), so x_args is a tuple
    containing the arguments to pass to x_fun.
    """
    # Compute x
    x = x_fun(t, *x_args)
    
    # Return cascade RHS with this value of x
    return cascade_rhs(yz, t, beta_y, beta_z, gamma, n_x, n_y, x)

def x_periodic(t, f, x_0):
    """
    Returns x value for periodic forcing of amplitude x_0 and frequency f.
    """
    if type(f) in [float, int]:
        return x_0 * (1 + np.sin(f * t))
    else:
        sin_sum = np.zeros_like(t)
        for freq, amp in zip(f, x_0):
            sin_sum += amp * (1 + np.sin(freq*t))
        return sin_sum

# Set up parameters for periodic forcing with f = 0.5 and x_0 = 2.
x_args = (0.5, 2.0)

# Package parameters into a tuple, now with high cooperativity
n_y = 10
args = (beta_y, beta_z, gamma, n_x, n_y, x_periodic, x_args)

# Time points
t = np.linspace(0, 40, 300)

# Initial condition
yz_0 = np.array([0.0, 0.0])

# Integrate ODES
yz = scipy.integrate.odeint(cascade_rhs_x_fun, yz_0, t, args=args)

# Pluck out y and z
y, z = yz.transpose()

# x
x = x_periodic(t, *x_args)
x /= x.max()

# Plot the results
p = bokeh.plotting.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless y, z')

# Populate glyphs
p.line(t, y, line_width=2, color=colors[0], legend_label='y')
p.line(t, z, line_width=2, color=colors[1], legend_label='z')
p.line(t, x, line_width=2, color=colors[2], alpha=0.2, legend_label='x (normalized)', line_join='bevel')

# Place the legend
p.legend.location = 'top_right'

#Show plot
bokeh.io.output_file("plots/ffl_plot.html")
bokeh.io.show(p)