import biocircuits

class Protein:
    def __init__(self, id, name, initConc, degrad, gates, extConcFunc = None, extConcFuncArgs = None):
        self.mID = id
        self.mName = name
        self.mInternalConc = initConc
        self.mDegradation = degrad
        self.mGates = gates
        self.mExtConcFunc = extConcFunc
        self.mExtConcFuncArgs = extConcFuncArgs
        for gate in self.mGates:
            gate.regFuncLambda = gate.getRegFunc()

    def getID(self):
        return self.mID

    def getName(self):
        return self.mName

    def getExternalConcentration(self):
        return self.mExternalConc
        
    def setExternalConcentration(self, t):
        if self.mExtConcFunc is not None:
            self.mExternalConc = self.mExtConcFunc(t, *self.mExtConcFuncArgs)
        else:
            self.mExternalConc = 0
        return
    
    def getInternalConcentration(self):
        return self.mInternalConc
    
    def setInternalConcentration(self, conc):
        self.mInternalConc = conc

    def getConcentration(self):
        return self.mInternalConc + self.mExternalConc
    
    def calcProdRate(self, proteinArray):
        rate = 0.0
        for i, gate in enumerate(self.mGates):
            rate += gate.regFunc(proteinArray)
        rate -= self.mDegradation * self.mInternalConc
        return rate

class Gate:
    def __init__(self, type, *, firstInput, secondInput = None, firstHill = 1, secondHill = 1):
        self.mType = type
        self.mFirstInput = firstInput
        self.mFirstHill = firstHill
        self.mSecondInput = secondInput
        self.mSecondHill = secondHill
        self.prodRate = 0.0

    def getRegFunc(self):
        if self.mType == "act_hill":
            return lambda p: biocircuits.act_hill(p[self.mFirstInput].getConcentration(), self.mFirstHill)
        elif self.mType == "rep_hill":
            return lambda p: biocircuits.rep_hill(p[self.mFirstInput].getConcentration(), self.mFirstHill)
        elif self.mType == "aa_and":
            return lambda p: biocircuits.aa_and(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "aa_or":
            return lambda p: biocircuits.aa_or(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "aa_or_single":
            return lambda p: biocircuits.aa_or_single(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "rr_and":
            return lambda p: biocircuits.rr_and(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "rr_or":
            return lambda p: biocircuits.rr_or(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "rr_and_single":
            return lambda p: biocircuits.rr_and_single(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "ar_and":
            return lambda p: biocircuits.ar_and(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "ar_or":
            return lambda p: biocircuits.ar_or(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "ar_and_single":
            return lambda p: biocircuits.ar_and_single(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        elif self.mType == "ar_or_single":
            return lambda p: biocircuits.ar_or_single(p[self.mFirstInput].getConcentration(), p[self.mSecondInput].getConcentration(), self.mFirstHill, self.mSecondHill)
        else:
            raise ValueError(f"Unknown regulatory function type: {self.mType}")
        
    def regFunc(self, proteinArray):
        return self.regFuncLambda(proteinArray)
