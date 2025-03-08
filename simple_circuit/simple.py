import biocircuits

class Protein:
    def __init__(self, id, initConc, hill, degrad, gates):
        self.mID = id
        self.mInitialConc = initConc
        self.mHill = hill
        self.mDegradation = degrad
        self.mGates = gates
    
    def getHill(self):
        return self.mHill

    def getID(self):
        return self.mID
    
    def CalcProdRate(self):
        rate = 0.0
        for gate in self.mGates:
            rate += gate.regFunc()
        return rate

class Gate:
    def __init__(self, type, first, second):
        self.mType = type
        self.mFirstInput = first
        self.mSecondInput = second
        self.prodRate = self.regFunc()

    def regFunc(self):
        if self.mType == "act_hill":
            return biocircuits.act_hill(self.mFirstInput, self.mFirstInput.getHill)
        elif self.mType == "rep_hill":
            return biocircuits.rep_hill(self.mFirstInput, self.mFirstInput.getHill)
        elif self.mType == "aa_and":
            return biocircuits.aa_and(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "aa_or":
            return biocircuits.aa_or(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "aa_or_single":
            return biocircuits.aa_or_single(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "rr_and":
            return biocircuits.rr_and(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "rr_or":
            return biocircuits.rr_or(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "rr_and_single":
            return biocircuits.rr_and_single(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "ar_and":
            return biocircuits.ar_and(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "ar_or":
            return biocircuits.ar_or(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "ar_and_single":
            return biocircuits.ar_and_single(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        elif self.mType == "ar_or_single":
            return biocircuits.ar_or_single(self.mFirstInput, self.mSecondInput, self.mFirstInput.getHill, self.mSecondInput.getHill)
        else:
            raise ValueError(f"Unknown regulatory function type: {self.mType}")


    