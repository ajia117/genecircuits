import scipy.integrate
from protein import PROTEIN_ARRAY


# TODO: leave descriptor
def simulation_iter(concentrations, t):
    # print("Concentrations at time: " + str(t))
    # print(concentrations)

    # Update external concentrations of each protein. Update concentrations of each protein
    for protein in PROTEIN_ARRAY:
        protein.setExternalConcentration(t)
        protein.setInternalConcentration(concentrations[protein.getID()])

    # For each protein in proteins, calculate their production rate
    production_rates = [0.0] * len(PROTEIN_ARRAY)
    for protein in PROTEIN_ARRAY:
        production_rates[protein.getID()] = protein.calcProdRate()

    # Return the result as a NumPy array
    return production_rates


def run_simulation(t):
    # Initial concentrations each protein
    initial_concentrations = [0.0] * len(PROTEIN_ARRAY)
    for protein in PROTEIN_ARRAY:
        initial_concentrations[protein.getID()] = protein.getInternalConcentration()

    # Integrate!
    final_concentrations =  scipy.integrate.odeint(simulation_iter, initial_concentrations, t)
    return final_concentrations