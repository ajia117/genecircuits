import numpy as np
import pytest
import json
from simple_parser import parse_circuit
from protein import Protein, Gate

def test_animals_json():
    # Create expected list of proteins:
    expected_proteins = [
        Protein(0, "giraffeeee", 0.0, 0, [Gate("ar_or", firstInput = 0, secondInput = 1)], None, None),
        Protein(1, "turtle", 0, 0, [], None, None),
        Protein(2, "lobster", 0, 0, [Gate("aa_and", firstInput = 0, secondInput = 1), Gate("rep_hill", firstInput=0)], None, None),
    ]

    with open("../test_data/animals.json") as f:
        data = json.load(f)
    actual_proteins = parse_circuit(data)

    # compare results to expected
    print("Expected proteins:")
    for protein in expected_proteins:
        print(f"Protein ID: {protein.mID}, Name: {protein.mName}, {(protein.mInternalConc, protein.mDegradation)}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in protein.mGates ]}")
    print("Actual proteins:")
    for protein in actual_proteins:
        print(f"Protein ID: {protein.mID}, Name: {protein.mName}, {(protein.mInternalConc, protein.mDegradation)}, Gates: {[ (g.mType, g.mFirstInput, g.mSecondInput) for g in protein.mGates ]}")

    assert actual_proteins == expected_proteins


def test_colors_json():
    # Create expected list of proteins:
    expected_proteins = [
        Protein(0, "red", 2.5, 1, [], None, None),
        Protein(1, "blue", 0, 0, [], None, None),
        Protein(2, "yellow", 0, 0, [Gate("ar_or", firstInput=1, secondInput=0)], None, None),
        Protein(3, "rainbow", 0, 0, [Gate("ar_and", firstInput=4, secondInput=2)], None, None),
        Protein(4, "giraffeeee", 0, 0, [Gate("ar_and", firstInput=0, secondInput=2)], None, None),
    ]

    with open("../test_data/colors.json") as f:
        data = json.load(f)
    actual_proteins = parse_circuit(data)

    # compare results to expected
    assert actual_proteins == expected_proteins
    # Change expected proteins and expect a mismatch
    expected_proteins[0].mInternalConc = 3.0
    with pytest.raises(AssertionError):
        assert actual_proteins == expected_proteins


def test_parser_missing_nodes():
    data = {"edges": []}
    with pytest.raises(ValueError, match="JSON must contain both 'nodes' and 'edges'"):
        parse_circuit(data)


def test_parser_missing_edges():
    data = {"nodes": []}
    with pytest.raises(ValueError, match="JSON must contain both 'nodes' and 'edges'"):
        parse_circuit(data)


def test_parser_unsupported_node_type():
    data = {
        "nodes": [{"id": "1", "type": "banana"}],
        "edges": []
    }
    with pytest.raises(ValueError, match="Unsupported node type: banana"):
        parse_circuit(data)

def test_parser_missing_both_gate_inputs():
    data = {
        "nodes": [{"id": "g0", "type": "and"}],
        "edges": []
    }
    with pytest.raises(ValueError, match="Parser failed: Gate 'G0' \\(and\\) must have exactly two inputs, got 0"):
        parse_circuit(data)


# TODO: handle command line args, to run individual tests if desired
def main():
    print("Running all test cases...")
    #pytest.main(["-v", "test_parser.py::test_animals_json", "test_parser.py::test_colors_json"])
    pytest.main(["-v", "test_parser.py::test_parser_missing_nodes", "test_parser.py::test_parser_missing_edges", "test_parser.py::test_parser_unsupported_node_type", "test_parser.py::test_parser_missing_both_gate_inputs"])

# Run the script
if __name__ == '__main__':
    main()