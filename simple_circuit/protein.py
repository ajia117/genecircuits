class Protein:
    def __init__(self, id, name, initConc, hill, degrad, gates):
        self.mID = id
        self.mName = name
        self.mInitialConc = initConc
        self.mHill = hill
        self.mDegradation = degrad
        self.mGates = gates

    def getID(self):
        return self.mID
    
    def getInitialConcentration(self):
        return self.mInitialConc
    
    def calcProdRate(self):
        rate = 0.0
        return rate

class InputProtein:
    def __init__(self, id, initConc): # TODO: pass a function for the concentration rather than initConc
        self.mID = id
        self.mConc = initConc

    def getID(self):
        return self.mID
    
    def getConcentration(self, t): #TODO: replace with actual concentration
        return self.mConc

class Gate:
    def __init__(self, type, first, second):
        self.mType = type
        self.mFirstInput = first
        self.mSecondInput = second

    