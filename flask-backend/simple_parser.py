from protein import Protein, Gate
import json
from collections import defaultdict

# Parser function
def parse_circuit(json_data):
    # Write protein_array to a log file
    with open("protein_log.txt", "w") as log_file:
        log_file.write("Received json" + "\n")
        log_file.write(json.dumps(json_data, indent=4) + "\n")
    
    id_map = {}
    currNodeID = 0
    currGateID = 0
    listOfNodes = [node for node in json_data['nodes']]
    nodes = {}

    for node in listOfNodes:
        if (node['type'] in ['input', 'output', 'custom']):
            nodes[str(currNodeID)] = node
            id_map[node['id']] = currNodeID
            currNodeID += 1
        else:
            nodes["G" + str(currGateID)] = node
            id_map[node['id']] = "G" + str(currGateID)
            currGateID += 1

    #nodes = {node['id']: node for node in json_data['nodes']}
    edges = json_data['edges']
            
    # Build adjacency list for inputs to each node
    inputs = defaultdict(list)

    
    for edge in edges:
        inputs[str(id_map[edge['target']])].append(str(id_map[edge['source']]))

    protein_array = []
    current_protein_id = 0

    smush_gates = {}
    # set smush gates, which takes care of A --> gate --> B and makes it into A --> B
    for node_id, node in nodes.items():
        if node['type'] in ['and', 'or']:
            gate_type = 'aa_and' if node['type'] == 'and' else 'aa_or'
            input_sources = inputs.get(node_id, [])
            if len(input_sources) >= 2:
                first, second = int(input_sources[0]), int(input_sources[1])
                smush_gates[node_id] = Gate(gate_type, first, second)
            else:
                raise ValueError(f"Gate '{node_id}' ({node['type']}) must have at least two inputs, but got {len(input_sources)}.")

    for node_id, node in nodes.items():
        node_type = node['type']
        label = node['data']['label']
        init_conc = node['data']['initialConcentration']
        hill = node['data']['hillCoefficient']
        degrad = node['data']['lossRate']

        gates = []

        if node_type in ['output', 'custom']:
            # Determine the input sources to this protein
            input_sources = inputs.get(node_id, [])
            for src in input_sources:
                if src in smush_gates:
                    gates.append(smush_gates[src])
                else:
                    if len(input_sources) != 1:
                        raise ValueError(f"Gate '{node_id}' ({node['type']}) must have exactly one input, but got {len(input_sources)}.")
                    gates.append(Gate("act_hill", int(src), int(src)))
            # Check if the protein already exists
            found_protein = next((protein for protein in protein_array if protein.mName == label), None)
            if found_protein:
                found_protein.mGates.extend(gates)
                continue
            
            # Otherwise, create a new protein
            protein = Protein(current_protein_id, label, init_conc, hill, degrad, gates)
            protein_array.append(protein)
            current_protein_id += 1

        elif node_type == 'input':
            # External protein
            found_protein = next((protein for protein in protein_array if protein.mName == label), None)
            if found_protein:
                # TODO: read in the user defined function for input concentration
                continue
            
            protein = Protein(current_protein_id, label, init_conc, hill, degrad, [])
            protein_array.append(protein)
            current_protein_id += 1

    # Write protein_array to a log file
    with open("protein_log.txt", "a") as log_file:
        log_file.write("Parsed protein list" + "\n")
        for protein in protein_array:
            log_file.write(f"Protein ID: {protein.mID}, Name: {protein.mName}, Hill: {protein.mHill}, Degradation: {protein.mDegradation}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in protein.mGates ]}\n")
    
    return protein_array

#Example usage
if __name__ == "__main__":
    with open("colors.json") as f:
        data = json.load(f)

    proteins = parse_circuit(data)
    for p in proteins:
        print(f"Protein ID: {p.mID}, Name: {p.mName}, {(p.mInternalConc, p.mHill, p.mDegradation)}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in p.mGates ]}")
