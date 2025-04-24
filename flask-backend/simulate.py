import scipy.integrate
import numpy as np


# TODO: leave descriptor
def simulation_iter(concentrations, t, proteinArray):
    # Update external concentrations of each protein. Update concentrations of each protein
    for protein in proteinArray:
        protein.setExternalConcentration(t)
        protein.setInternalConcentration(concentrations[protein.mID])

    # For each protein in proteins, calculate their production rate
    production_rates = [0.0] * len(proteinArray)
    for protein in proteinArray:
        production_rates[protein.mID] = protein.calcProdRate(proteinArray)

    # Return the result as a NumPy array
    return production_rates


def run_simulation(t, proteinArray):
    # Initial concentrations each protein
    if not proteinArray or (proteinArray) == 0:
        return None
    initial_concentrations = [0.0] * len(proteinArray)
    for protein in proteinArray:
        initial_concentrations[protein.mID] = protein.getInternalConcentration()

    # Integrate!
    args = (proteinArray,)

    final_concentrations = scipy.integrate.odeint(simulation_iter, initial_concentrations, t, args)

    # Combine internal and external concentrations
    for i, protein in enumerate(proteinArray):
        if protein.mExtConcFunc is not None:
            final_concentrations[:, i] += protein.mExtConcFunc(t, *protein.mExtConcFuncArgs)
    return final_concentrations

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

def steady_state(t, val):
    return val