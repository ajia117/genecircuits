from protein import Protein, Gate
import json
from collections import defaultdict

# Parser function
def parse_circuit(json_data):
    id_map = {}
    currNodeID = 0
    currGateID = 0
    listOfNodes = [node for node in json_data['nodes']]
    nodes = {}

    for node in listOfNodes:
        if (node['type'] in ['default', 'input', 'output']):
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

    for node_id, node in nodes.items():
        node_type = node['type']
        label = node['data']['label']
        init_conc = node['data']['initialConcentration']
        hill = node['data']['hillCoefficient']
        degrad = node['data']['degradationRate']

        gates = []

        if node_type in ['default', 'output']:
            # Determine the input sources to this protein
            input_sources = inputs.get(node_id, [])
            for src in input_sources:
                if src in smush_gates:
                    gates.append(smush_gates[src])
                else:
                    gates.append(Gate("act_hill", int(src), int(src)))
            protein = Protein(current_protein_id, label, init_conc, hill, degrad, gates)
            protein_array.append(protein)
            current_protein_id += 1

        elif node_type == 'input':
            # External protein
            protein = Protein(current_protein_id, label, init_conc, hill, degrad, [])
            protein_array.append(protein)
            current_protein_id += 1

    return protein_array

#Example usage
# if __name__ == "__main__":
#     with open("sample.json") as f:
#         data = json.load(f)

#     proteins = parse_circuit(data)
#     for p in proteins:
#         print(f"Protein ID: {p.mID}, Name: {p.mName}, {(p.mInternalConc, p.mHill, p.mDegradation)}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in p.mGates ]}")

