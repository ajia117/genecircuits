
from protein import Protein, Gate
from simulate import x_pulse
from simulate import steady_state
import json
from collections import defaultdict

def parse_circuit(json_data):
    try:
        if 'nodes' not in json_data or 'edges' not in json_data or 'proteins' not in json_data:
            raise ValueError("JSON must contain 'nodes', 'edges', and 'proteins' fields.")

        with open("protein_log.txt", "w") as log_file:
            log_file.write("Received json" + "\n")
            log_file.write(json.dumps(json_data, indent=4) + "\n")

        id_map = {}
        currNodeID = 0
        currGateID = 0
        edges = json_data['edges']
        proteins_info = json_data['proteins']
        hill_table = {item['id']: item['value'] for item in json_data.get('hillCoefficients', [])}
        listOfNodes = json_data['nodes']
        protein_array = []
        protein_map = {}

        # First pass: Create Protein instances
        for node in listOfNodes:
            if node['type'] == 'custom':
                name = node['proteinName']
                protein_data = proteins_info[name]
                p = Protein(
                    id=currNodeID,
                    name=name,
                    initConc=protein_data['initialConcentration'],
                    degrad=protein_data['lossRate'],
                    gates=[],
                    extConcFunc=protein_data['inputFunctionType'],
                    #if type "steady-state"
                    #return steady-state
                    #if type "pulse"
                    #return pulse function
                    extConcFuncArgs=protein_data['inputFunctionData']
                    #make sure args are in same order
                )
                if (p.mExtConcFunc == "pulse"):
                    p.mExtConcFunc = x_pulse
                    #print(p.mExtConcFuncArgs.values())
                    temp = [val for val in list(p.mExtConcFuncArgs.values())[1:]]
                    p.mExtConcFuncArgs = temp
                    #print(p.mExtConcFuncArgs)
                
                if (p.mExtConcFunc == "steady-state"):
                    p.mExtConcFunc = steady_state
                    temp = [list(p.mExtConcFuncArgs.values())[0]]
                    p.mExtConcFuncArgs = temp
                    #print(p.mExtConcFuncArgs)

                protein_array.append(p)
                protein_map[str(currNodeID)] = p
                id_map[node['id']] = currNodeID
                currNodeID += 1

        # Second pass: Prepare Gate placeholders
        gates = {}
        for node in listOfNodes:
            if node['type'] in ['and', 'or']:
                gates[node['id']] = {
                    'type': node['type'],
                    'inputs': [],
                    'outputs': []
                }
                id_map[node['id']] = currGateID
                currGateID += 1

        single_input_edges = {}
        # Third pass: Process edges
        for edge in edges:
            source = edge['source']
            target = edge['target']
            edge_type = edge['type']
            if target in gates:
                gates[target]['inputs'].append((source, edge_type))
            if source in gates:
                gates[source]['outputs'].append(target)
            if target not in gates and source not in gates:
                single_input_edges[target] = [source, edge_type]
            

        # Final pass: Instantiate Gates and assign to Proteins
        for gate_id, info in gates.items():
            if len(info['inputs']) != 2:
                raise ValueError(f"Gate '{gate_id}' ({info['type']}) must have exactly two inputs, got {len(info['inputs'])}")

            (firstNodeId, firstType), (secondNodeId, secondType) = info['inputs']
            print(firstNodeId)
            firstId = str(id_map[firstNodeId])
            secondId = str(id_map[secondNodeId])
            
            gate_family = info['type']

            try:
                print("FirstId: ", firstId)
                print("SecondId: ", secondId)
                print("Id map: ", id_map)
                print("Protein map: ", protein_map)
                first = protein_map[firstId]
                second = protein_map[secondId]
            except KeyError as e:
                raise ValueError(f"Error resolving gate inputs for '{gate_id}': {e}")

            # Determine hill coefficients using any one of the targets (if exists)
            target_protein_ids = info['outputs']
            print(target_protein_ids)
            first_target_nodeid = target_protein_ids[0] if target_protein_ids else None
            first_target = str(id_map[first_target_nodeid])
            hill1 = hill_table.get(f"{protein_map[first_target].mName}-{first.mName}", 1) if first_target else 1
            #print("Hill1: ", hill1)
            hill2 = hill_table.get(f"{protein_map[first_target].mName}-{second.mName}", 1) if first_target else 1
            #print("Hill2: ", hill2)

            # Determine gate type based on edge types
            if firstType == 'promote' and secondType == 'promote':
                gate_type = f"aa_{gate_family}"
                gate = Gate(gate_type, firstInput=int(firstId), secondInput=int(secondId), firstHill=hill1, secondHill=hill2)
            elif firstType == 'promote' and secondType == 'repress':
                gate_type = f"ar_{gate_family}"
                gate = Gate(gate_type, firstInput=int(firstId), secondInput=int(secondId), firstHill=hill1, secondHill=hill2)
            elif firstType == 'repress' and secondType == 'promote':
                gate_type = f"ar_{gate_family}"
                gate = Gate(gate_type, firstInput=int(secondId), secondInput=int(firstId), firstHill=hill2, secondHill=hill1)
            elif firstType == 'repress' and secondType == 'repress':
                gate_type = f"rr_{gate_family}"
                gate = Gate(gate_type, firstInput=int(secondId), secondInput=int(firstId), firstHill=hill2, secondHill=hill1)
            else:
                raise ValueError(f"Unknown edge types for gate '{gate_id}': {firstType}, {secondType}")

            for target in info['outputs']:
                protein_map[str(id_map[target])].mGates.append(gate)
        
        #print(single_input_edges)

        #NEW
        # Handle single-input gates for custom/output nodes that do not go through gates
        for target, second in single_input_edges.items():
            source, edge_type = second[0], second[1]
            sourcePid = str(id_map[str(source)])
            targetPid = str(id_map[str(target)])
            #print(protein_map[source].mName, protein_map[target].mName, edge_type)
            if sourcePid not in protein_map:
                raise ValueError(f"Input source '{source}' for node '{target}' is not a valid protein.")
            hill = hill_table.get(f"{protein_map[sourcePid].mName}-{protein_map[targetPid].mName}", 1)
            #print("Hill: ", hill)
            if edge_type == "promote":
                gate = Gate("act_hill", firstInput=int(sourcePid), firstHill=hill)
                protein_map[targetPid].mGates.append(gate)
            elif edge_type == "repress":
                gate = Gate("rep_hill", firstInput=int(sourcePid), firstHill=hill)
                protein_map[targetPid].mGates.append(gate)
            else:
                raise ValueError(f"Unknown edge type for gate '{target}': {edge_type}")
        
        with open("protein_log.txt", "a") as log_file:
            log_file.write("Output protein list:" + "\n")
            for protein in protein_array:
                log_file.write(f"Protein ID: {protein.mID}, Name: {protein.mName}, Degradation: {protein.mDegradation}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in protein.mGates ]}\n")

        return protein_array

    except Exception as e:
        print("Error during parsing:", str(e))
        raise

#Example usage
if __name__ == "__main__":
    with open("test_data/break_test.json") as f:
        data = json.load(f)

    proteins = parse_circuit(data)
    for p in proteins:
        print(f"Protein ID: {p.mID}, Name: {p.mName}, {(p.mInternalConc, p.mDegradation)}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput if g.mSecondInput else None) for g in p.mGates ]}")

