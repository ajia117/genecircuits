from protein import Protein, Gate
import json
from collections import defaultdict

# Parser function
# TODO: this currently uses the node ids from the frontend as the input ids for the gates which is INCORRECT
# because these node ids have no meaning in the context of the simulator. Fix this :)
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
        inputs[str(id_map[edge['target']])].append((str(id_map[edge['source']]), edge['type']))

    protein_array = []
    current_protein_id = 0

    smush_gates = {}
    # set smush gates, which takes care of A --> gate --> B and makes it into A --> B
    for node_id, node in nodes.items():
        if node['type'] in ['and', 'or']:
            gate_family = node['type']
            input_sources = inputs.get(node_id, [])
            if len(input_sources) == 2:
                (firstId, firstType), (secondId, secondType) = input_sources[0], input_sources[1]
                first, second = int(firstId), int(secondId)
                # Infer gate type based on edge types
                if firstType == 'promote' and secondType == 'promote':
                    gate_type = f"aa_{gate_family}"
                    smush_gates[node_id] = Gate(gate_type, firstInput=first, secondInput=second)
                elif firstType == 'promote' and secondType == 'repress':
                    gate_type = f"ar_{gate_family}"
                    smush_gates[node_id] = Gate(gate_type, firstInput=first, secondInput=second)
                elif firstType == 'repress' and secondType == 'promote':
                    gate_type = f"ar_{gate_family}"
                    smush_gates[node_id] = Gate(gate_type, firstInput=second, secondInput=first)
                elif firstType == 'repress' and secondType == 'repress':
                    gate_type = f"rr_{gate_family}"
                    smush_gates[node_id] = Gate(gate_type, firstInput=second, secondInput=first)
                else:
                    raise ValueError(f"Unknown edge types for gate '{node_id}': {firstType}, {secondType}")
            else:
                raise ValueError(f"Gate '{node_id}' ({node['type']}) must have exactly two inputs, but got {len(input_sources)}.")

    for node_id, node in nodes.items():
        node_type = node['type']
        label = node['data']['label']
        init_conc = node['data']['initialConcentration']
        # We should receive hill coefficients on a input protien x output protein basis, not based on the input protein alone
        # TODO: once frontend gives us the proper format, parse the hill coefficients and add them to gate instantiation
        # hill = node['data']['hillCoefficient']
        degrad = node['data']['lossRate']

        gates = []

        if node_type in ['output', 'custom']:
            # Determine the input sources to this node
            input_sources = inputs.get(node_id, [])
            for src, edge_type in input_sources:
                if src in smush_gates:
                    gates.append(smush_gates[src])
                else: # the source is a protein (single act or rep)
                    if len(input_sources) != 1:
                        raise ValueError(f"Gate '{node_id}' ({node['type']}) must have exactly one input, but got {len(input_sources)}.")
                    if edge_type == "promote":
                        gates.append(Gate("act_hill", firstInput=int(src)))
                    elif edge_type == "repress":
                        gates.append(Gate("rep_hill", firstInput=int(src)))
                    else:
                        raise ValueError(f"Unknown edge type for gate '{node_id}': {edge_type}")
            
            # Check if the protein already exists
            found_protein = next((protein for protein in protein_array if protein.mName == label), None)
            if found_protein:
                found_protein.mGates.extend(gates)
                continue
            
            # Otherwise, create a new protein
            protein = Protein(current_protein_id, label, init_conc, degrad, gates)
            protein_array.append(protein)
            current_protein_id += 1

        elif node_type == 'input':
            # External protein
            # TODO: parse extConcFunc and extConcFuncArgs from json once frontend passes it
            extConcFunc = None
            extConcFuncArgs = None
           
            # Check if the protein already exists
            found_protein = next((protein for protein in protein_array if protein.mName == label), None)
            if found_protein:
                found_protein.mExtConcFunc = extConcFunc
                found_protein.mExtConcFuncArgs = extConcFuncArgs
                continue
            # Otherwise, construct the protein
            protein = Protein(current_protein_id, label, init_conc, degrad, [], extConcFunc, extConcFuncArgs)
            protein_array.append(protein)
            current_protein_id += 1
            
    with open("protein_log.txt", "a") as log_file:
        log_file.write("Output protein list:" + "\n")
        for protein in protein_array:
            log_file.write(f"Protein ID: {protein.mID}, Name: {protein.mName}, Degradation: {protein.mDegradation}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in protein.mGates ]}\n")

    return protein_array

#Example usage
if __name__ == "__main__":
    with open("animals.json") as f:
        data = json.load(f)

    proteins = parse_circuit(data)
    for p in proteins:
        print(f"Protein ID: {p.mID}, Name: {p.mName}, {(p.mInternalConc, p.mDegradation)}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in p.mGates ]}")

