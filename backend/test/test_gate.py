import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import pytest
import numpy as np
import biocircuits
from protein import Gate, Protein

class TestGate:
    """Unit tests for the Gate class"""

    def test_init(self):
        gate = Gate("aa_and", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        # Gate stores attributes with 'm' prefixes in the implementation
        assert gate.mType == "aa_and"
        assert gate.mFirstInput == 0
        assert gate.mSecondInput == 1
        assert gate.mFirstHill == 2
        assert gate.mSecondHill == 2

    def test_aa_and_gate(self):
        gate = Gate("aa_and", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        protein_array = [MockProtein(0.5), MockProtein(0.8)]
        result = gate.regFunc(protein_array)
        # use biocircuits implementation to compute expected value to match Gate
        expected = biocircuits.aa_and(0.5, 0.8, 2, 2)
        assert result == pytest.approx(expected)

    def test_aa_or_gate(self):
        gate = Gate("aa_or", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        protein_array = [MockProtein(0.5), MockProtein(0.8)]
        result = gate.regFunc(protein_array)
        expected = biocircuits.aa_or(0.5, 0.8, 2, 2)
        assert result == pytest.approx(expected)

    def test_aa_or_single_gate(self):
        gate = Gate("aa_or_single", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        protein_array = [MockProtein(0.5), MockProtein(0.8)]
        result = gate.regFunc(protein_array)
        expected = biocircuits.aa_or_single(0.5, 0.8, 2, 2)
        assert result == pytest.approx(expected)

    def test_rr_and_gate(self):
        gate = Gate("rr_and", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        protein_array = [MockProtein(0.5), MockProtein(0.8)]
        result = gate.regFunc(protein_array)
        expected = biocircuits.rr_and(0.5, 0.8, 2, 2)
        assert result == pytest.approx(expected)

    def test_rr_and_single_gate(self):
        gate = Gate("rr_and_single", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        protein_array = [MockProtein(0.5), MockProtein(0.8)]
        result = gate.regFunc(protein_array)
        expected = biocircuits.rr_and_single(0.5, 0.8, 2, 2)
        assert result == pytest.approx(expected)

    def test_ar_and_gate(self):
        gate = Gate("ar_and", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        protein_array = [MockProtein(0.5), MockProtein(0.8)]
        result = gate.regFunc(protein_array)
        expected = biocircuits.ar_and(0.5, 0.8, 2, 2)
        assert result == pytest.approx(expected)

    def test_ar_or_single_gate(self):
        gate = Gate("ar_or_single", firstInput=0, secondInput=1, firstHill=2, secondHill=2)
        protein_array = [MockProtein(0.5), MockProtein(0.8)]
        result = gate.regFunc(protein_array)
        expected = biocircuits.ar_or_single(0.5, 0.8, 2, 2)
        assert result == pytest.approx(expected)

class MockProtein:
    """Mock class for Protein to simulate concentrations"""
    def __init__(self, concentration):
        self.concentration = concentration

    def getConcentration(self):
        return self.concentration