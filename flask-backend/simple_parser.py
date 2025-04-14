from protein import Protein, Gate
import json
from collections import defaultdict

# Parser function
# We should receive hill coefficients on a input protien x output protein basis, not based on the input protein alone
# TODO: once frontend gives us the proper format, parse the hill coefficients and add them to gate instantiation
def parse_circuit(json_data):
    try:
        if 'nodes' not in json_data or 'edges' not in json_data:
            raise ValueError("JSON must contain both 'nodes' and 'edges' fields.")
   
        # Write protein_array to a log file
        with open("protein_log.txt", "w") as log_file:
            log_file.write("Received json" + "\n")
            log_file.write(json.dumps(json_data, indent=4) + "\n")

        id_map = {}
        currNodeID = 0
        currGateID = 0
        listOfNodes = [node for node in json_data['nodes']]
        edges = json_data['edges']
        nodes = {}
        protein_array = []
        protein_map = {} # A map from protein name to protein id in the protein array
        current_protein_id = 0

        # Construct the list of nodes and protein array
        for node in listOfNodes:
            node_type = node.get('type')

            if node_type not in ['input', 'output', 'custom', 'and', 'or']:
                raise ValueError(f"Unsupported node type: {node_type}")

            if (node_type in ['input', 'output', 'custom']):
                nodes[str(currNodeID)] = node
                id_map[node['id']] = currNodeID
                currNodeID += 1

                # If no protein object exists for the protein of this node, create one. Wait to construct gates until all protein objects have been created.
                label = node['data']['label']
                if label not in protein_map:
                    try:
                        init_conc = node['data']['initialConcentration'] # should be consistent accross nodes of the same protein label
                        degrad = node['data']['lossRate'] # should be consistent accross nodes of the same protein label
                    except KeyError as e:
                        raise ValueError(f"Missing expected protein property: {e}")
                    
                    protein = Protein(current_protein_id, label, init_conc, degrad, [])
                    protein_array.append(protein)
                    protein_map[label] = current_protein_id
                    current_protein_id += 1
            else:
                nodes["G" + str(currGateID)] = node
                id_map[node['id']] = "G" + str(currGateID)
                currGateID += 1

                
        # Build adjacency list for inputs to each node
        inputs = defaultdict(list)
        for edge in edges:
            if not all(k in edge for k in ['source', 'target', 'type']):
                raise ValueError("Each edge must include 'source', 'target', and 'type'")
            inputs[str(id_map[edge['target']])].append((str(id_map[edge['source']]), edge['type']))

        smush_gates = {}
        # set smush gates, which takes care of A --> gate --> B and makes it into A --> B
        for node_id, node in nodes.items():
            if node['type'] in ['and', 'or']:
                gate_family = node['type']
                input_sources = inputs.get(node_id, [])
                if len(input_sources) != 2:
                    raise ValueError(f"Gate '{node_id}' ({node['type']}) must have exactly two inputs, got {len(input_sources)}")
                
                try:
                    (firstId, firstType), (secondId, secondType) = input_sources[0], input_sources[1]
                    # Get the protein ids from the input node ids
                    first = protein_map[nodes[firstId]['data']['label']]
                    second = protein_map[nodes[secondId]['data']['label']]
                except KeyError as e:
                    raise (f"Error resolving gate inputs: {e}")

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


        for node_id, node in nodes.items():
            node_type = node['type']
            label = node['data']['label']
            gates = []

            if node_type in ['output', 'custom']:
                # Determine the input sources to this node
                input_sources = inputs.get(node_id, [])

                if not input_sources:
                    raise ValueError(f"No inputs found for node '{label}'")
                
                for src, edge_type in input_sources:
                    if src in smush_gates:
                        gates.append(smush_gates[src])
                    else: # the source is a protein (single act or rep)
                        if len(input_sources) != 1:
                            raise ValueError(f"Gate '{node_id}' ({node['type']}) must have exactly one input, but got {len(input_sources)}.")
                        # Get the protein id from the node id
                        pID = protein_map[nodes[src]['data']['label']]
                        if edge_type == "promote":
                            gates.append(Gate("act_hill", firstInput=int(pID)))
                        elif edge_type == "repress":
                            gates.append(Gate("rep_hill", firstInput=int(pID)))
                        else:
                            raise ValueError(f"Unknown edge type for gate '{node_id}': {edge_type}")
                
                # Add the gates to the protein
                protein_array[protein_map[label]].mGates.extend(gates)

            elif node_type == 'input':
                # External protein
                # TODO: parse extConcFunc and extConcFuncArgs from json once frontend passes it
                extConcFunc = None
                extConcFuncArgs = None

                # Add these params to the protein object
                protein = protein_array[protein_map[label]]
                protein.mExtConcFunc = extConcFunc
                protein.mExtConcFuncArgs = extConcFuncArgs
                
        with open("protein_log.txt", "a") as log_file:
            log_file.write("Output protein list:" + "\n")
            for protein in protein_array:
                log_file.write(f"Protein ID: {protein.mID}, Name: {protein.mName}, Degradation: {protein.mDegradation}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in protein.mGates ]}\n")

        return protein_array

    except Exception as e:
        raise ValueError(f"Parser failed: {str(e)}")

#Example usage
if __name__ == "__main__":
    with open("test_data/animals.json") as f:
        data = json.load(f)

    proteins = parse_circuit(data)
    for p in proteins:
        print(f"Protein ID: {p.mID}, Name: {p.mName}, {(p.mInternalConc, p.mDegradation)}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in p.mGates ]}")

