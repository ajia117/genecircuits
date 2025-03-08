import biocircuits

class Protein:
    def __init__(self, id, name, initConc, hill, degrad, gates, extConc = 0.0):
        self.mID = id
        self.mName = name
        self.mInternalConc = initConc
        self.mExternalConc = extConc
        self.mHill = hill
        self.mDegradation = degrad
        self.mGates = gates
    
    def getHill(self):
        return self.mHill

    def getID(self):
        return self.mID

    def getName(self):
        return self.mName

    def getExternalConcentration(self):
        return self.mExternalConc
        
    def setExternalConcentration(self, t):
        # TODO: implement this
        return
    
    def getInternalConcentration(self):
        return self.mInternalConc
    
    def setInternalConcentration(self, conc):
        self.mInternalConc = conc

    def getConcentration(self):
        return self.mInternalConc + self.mExternalConc
    
    def calcProdRate(self):
        rate = 0.0
        for gate in self.mGates:
            rate += gate.regFunc()
        rate -= self.mDegradation * self.mInternalConc
        return rate

class Gate:
    def __init__(self, type, first, second):
        self.mType = type
        self.mFirstInput = first
        self.mSecondInput = second
        self.prodRate = 0.0

    def regFunc(self):
        if self.mType == "act_hill":
            return biocircuits.act_hill(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill())
        elif self.mType == "rep_hill":
            return biocircuits.rep_hill(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill())
        elif self.mType == "aa_and":
            return biocircuits.aa_and(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "aa_or":
            return biocircuits.aa_or(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "aa_or_single":
            return biocircuits.aa_or_single(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "rr_and":
            return biocircuits.rr_and(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "rr_or":
            return biocircuits.rr_or(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "rr_and_single":
            return biocircuits.rr_and_single(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "ar_and":
            return biocircuits.ar_and(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "ar_or":
            return biocircuits.ar_or(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "ar_and_single":
            return biocircuits.ar_and_single(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        elif self.mType == "ar_or_single":
            return biocircuits.ar_or_single(PROTEIN_ARRAY[self.mFirstInput].getConcentration(), PROTEIN_ARRAY[self.mSecondInput].getConcentration(), PROTEIN_ARRAY[self.mFirstInput].getHill(), PROTEIN_ARRAY[self.mSecondInput].getHill())
        else:
            raise ValueError(f"Unknown regulatory function type: {self.mType}")


PROTEIN_ARRAY = [Protein(0, "Protein 0", 0.0, 1, 0.05, [], 1.0), Protein(1, "Protein 1", 0.0, 1, 0.05, [], 2.0), Protein(2, "Protein 2", 0.0, 1, 0.05, [Gate("aa_and", 0, 1)]), Protein(3, "Protein 3", 0.0, 1, 0.05, [], 3), Protein(4, "Protein 4", 0.0, 1, 0.05, [Gate("aa_and", 2, 3)])]
