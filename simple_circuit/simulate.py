import scipy.integrate


# TODO: leave descriptor
def simulation_iter(concentrations, t, proteinArray):
    # print("Concentrations at time: " + str(t))
    # print(concentrations)


    # Update external concentrations of each protein. Update concentrations of each protein
    for protein in proteinArray:
        protein.setExternalConcentration(t)
        protein.setInternalConcentration(concentrations[protein.getID()])

    # For each protein in proteins, calculate their production rate
    production_rates = [0.0] * len(proteinArray)
    for protein in proteinArray:
        production_rates[protein.getID()] = protein.calcProdRate(proteinArray)

    # Return the result as a NumPy array
    return production_rates


def run_simulation(t, proteinArray):
    # Initial concentrations each protein
    initial_concentrations = [0.0] * len(proteinArray)
    for protein in proteinArray:
        initial_concentrations[protein.getID()] = protein.getInternalConcentration()

    # Integrate!
    args = (proteinArray,)
    final_concentrations =  scipy.integrate.odeint(simulation_iter, initial_concentrations, t, args)
    return final_concentrations