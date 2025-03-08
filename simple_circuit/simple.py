class Protein:
    def __init__(self, id, initConc, hill, degrad, gates):
        self.mID = id
        self.mInitialConc = initConc
        self.mHill = hill
        self.mDegradation = degrad
        self.mGates = gates

    def getID(self):
        return self.mID
    
    def CalcProdRate(self):
        rate = 0.0
        return rate

class Gate:
    def __init__(self, type, first, second):
        self.mType = type
        self.mFirstInput = first
        self.mSecondInput = second

    