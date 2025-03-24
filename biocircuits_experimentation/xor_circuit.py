# based on code from http://be150.caltech.edu/2019/handouts/02_intro_to_python_for_biological_circuits.html 
import numpy as np
import scipy.integrate
import biocircuits
import bokeh.application
from   bokeh.io import output_file
import bokeh.plotting as bp

bokeh.io.output_notebook()

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

def custom_a_func(t):
    return x_pulse(t, 0, 40, 30, 2, 0.5)

def custom_b_func(t):
    return x_pulse(t, 15, 50, 20, 2, 1) # always on between t = 10, 50

# Simulates a basic feed forward loop in which x activates y and z, and y activates z. x and y are both needed for z to go high.
# y slowly activates z, while x quickly activates z. This makes the output z resistant to noise in x.

"""
Logical expression: OUT = NOT (A AND B) AND (D OR E) = XOR(A,B)
Simple circuit layout: 

A ----> 
        AND(C) ---|
B ----> 
                    AND(E)
A ----> 
        OR(D) --->
B ---->

"""

def xor(cde, t, hill_abcd, loss_cde):
    # Generate input pulses for a and b
    a = custom_a_func(t)
    b = custom_b_func(t)
   
    # Unpack abcde params
    c, d, e = cde
    n_a, n_b, n_c, n_d = hill_abcd
    l_c, l_d, l_e = loss_cde

    # Compute production rates
    dc_dt = biocircuits.aa_and(a, b, n_a, n_b) - l_c*c
    dd_dt = biocircuits.aa_or(a, b, n_a, n_b) - l_d*d
    de_dt = biocircuits.ar_and(d, c, n_d, n_c) - l_e*e
    
    # Return the result as a NumPy array
    return np.array([dc_dt, dd_dt, de_dt])

# Number of time points we want for the solutions
n = 1000

# Time points
t = np.linspace(0, 80, n)

# Initial concentrations of c, d, and e
cde_0 = np.array([0.0, 0.0, 0.0])

# Parameters
# Set hill coefficients to 1
hill_abcd = (1, 1, 2, 2) # a and b are the inputs
# Set degrdation rate
loss_cde = (0.1, 0.1, 0.2)

args = (hill_abcd, loss_cde)

# Call solver
cde_concentrations = scipy.integrate.odeint(xor, cde_0, t, args=args)

# Set up color palette
colors = bokeh.palettes.d3['Category10'][10]
# Pluck out x, y and z
c, d, e = cde_concentrations.transpose()
# Set up plot
p = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless c, d, e')

# Populate glyphs
p.line(t, c, line_width=2, color=colors[1], legend_label='c')
p.line(t, d,line_width=2, color=colors[2], legend_label='d')
p.line(t, e,line_width=2, color=colors[3], legend_label='e')

# Place the legend
p.legend.location = 'bottom_right'

# Plot the pulse
p_a = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless a')

# Populate glyphs
p_a.line(t, custom_a_func(t), line_width=2) # TODO: update

# Plot the pulse
p_b = bp.figure(width=500,
                          height=300,
                          x_axis_label='dimensionless time',
                          y_axis_label='dimensionless b')

# Populate glyphs
p_b.line(t, custom_b_func(t), line_width=2) # TODO: update


#Show plot
output_file("plots/xor.html")
layout = bokeh.layouts.column(p, p_a, p_b)
bokeh.io.show(layout)