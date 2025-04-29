import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
import json
from parser import parse_circuit
from protein import Protein, Gate
from simulate import x_pulse, steady_state

# Helper function to load test data
def load_json(filename):
    with open(filename) as f:
        return json.load(f)

def test_parse_complex_circuit():
    circuit = load_json("test_data/new_format.json")
    proteins = parse_circuit(circuit)

    # 1. Check number of unique protein objects
    assert len(proteins) == 4  # Orange, Strawberry, Grape, Banana

    # 2. Map protein names
    protein_map = {p.mName: p for p in proteins}

    # 3. Check external concentration functions
    assert protein_map["Orange"].mExtConcFunc == steady_state
    assert protein_map["Strawberry"].mExtConcFunc == x_pulse
    assert protein_map["Banana"].mExtConcFunc == x_pulse
    assert protein_map["Grape"].mExtConcFunc == steady_state

    # 4. Check gates attached to Banana
    banana_gates = protein_map["Banana"].mGates
    assert any("and" in g.mType for g in banana_gates)

    # 5. Check gates attached to Grape
    grape_gates = protein_map["Grape"].mGates
    assert any(g.mType == "ar_or" for g in grape_gates)

    # 6. Check hill coefficients for a gate
    for g in banana_gates:
        if g.mType.startswith("aa_and"):
            assert g.mFirstHill == 1
            assert g.mSecondHill == 1

def test_missing_fields_in_json():
    incomplete_json = {
        "nodes": [],
        "edges": []
    }
    with pytest.raises(ValueError, match="JSON must contain 'nodes', 'edges', and 'proteins' fields."):
        parse_circuit(incomplete_json)

def test_gate_with_incorrect_inputs():
    bad_json = load_json("test_data/new_format.json")
    # Remove one input to a gate (g0)
    bad_json['edges'] = [e for e in bad_json['edges'] if not (e['target'] == 'g0' and e['source'] == '2')]
    with pytest.raises(ValueError, match=r"Gate 'g0' \(and\) must have exactly two inputs"):
        parse_circuit(bad_json)

def test_invalid_edge_type():
    bad_json = load_json("test_data/new_format.json")
    bad_json['edges'][0]['type'] = 'activate'  # Invalid edge type
    with pytest.raises(ValueError, match=r"Unknown edge type for gate"):
        parse_circuit(bad_json)

def test_single_input_edge():
    circuit = load_json("test_data/new_format.json")
    proteins = parse_circuit(circuit)
    protein_map = {p.mName: p for p in proteins}

    strawberry_gates = protein_map["Strawberry"].mGates
    assert any(g.mType == "act_hill" for g in strawberry_gates)

def test_custom_protein_parsing():
    circuit = load_json("test_data/new_format.json")
    proteins = parse_circuit(circuit)

    protein_names = [p.mName for p in proteins]
    assert sorted(protein_names) == sorted(["Orange", "Strawberry", "Grape", "Banana"])

    # Check uniqueness
    protein_map = {p.mName: p for p in proteins}
    assert protein_map["Orange"] is not None

def test_malformed_gate_connections():
    bad_json = load_json("test_data/new_format.json")
    # Add a gate input source that doesn't exist
    bad_json['edges'].append({"id": "fake-edge", "type": "promote", "source": "fake", "target": "g0"})

    with pytest.raises(ValueError, match=r"must have exactly two inputs"):
        parse_circuit(bad_json)

def test_missing_gate_connections():
    bad_json = load_json("test_data/new_format.json")
    # Add a gate input source that doesn't exist
    bad_json['edges'] = [edge for edge in bad_json['edges'] if not (edge['id'] == "edge-1-g0")]

    with pytest.raises(ValueError, match=r"must have exactly two inputs"):
        parse_circuit(bad_json)
