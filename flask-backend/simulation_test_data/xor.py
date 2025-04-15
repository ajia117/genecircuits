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

def xor(abcde, t, hill_abcd, loss_cde):
    # Generate input pulses for a and b
    a = custom_a_func(t)
    b = custom_b_func(t)
   
    # Unpack abcde params
    _, _, c, d, e = abcde
    n_a, n_b, n_c, n_d = hill_abcd
    l_c, l_d, l_e = loss_cde

    # Compute production rates
    dc_dt = biocircuits.aa_and(a, b, n_a, n_b) - l_c*c
    dd_dt = biocircuits.aa_or(a, b, n_a, n_b) - l_d*d
    de_dt = biocircuits.ar_and(d, c, n_d, n_c) - l_e*e
    
    # Return the result as a NumPy array
    return np.array([0.0, 0.0, dc_dt, dd_dt, de_dt])

# Number of time points we want for the solutions
n = 1000

# Time points
t = np.linspace(0, 80, n)

# Initial concentrations of c, d, and e
abcde_0 = np.array([0.0, 0.0, 0.0, 0.0, 0.0])

# Parameters
# Set hill coefficients to 1
hill_abcd = (1, 1, 2, 2) # a and b are the inputs
# Set degrdation rate
loss_cde = (0.1, 0.1, 0.2)

args = (hill_abcd, loss_cde)

# Call solver
abcde_concentrations = scipy.integrate.odeint(xor, abcde_0, t, args=args)

# Add a and b values to the concentrations
a_vals = custom_a_func(t)
b_vals = custom_b_func(t)
# Combine values into a single array
abcde_concentrations[:, 0] += a_vals
abcde_concentrations[:, 1] += b_vals

# log concentratoins
with open("xor_results.txt", "w") as f:
    np.savetxt(f, abcde_concentrations, comments='')
