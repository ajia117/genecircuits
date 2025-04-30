import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useHillCoefficients } from '../hooks';
import { HillCoefficientData } from '../types';

interface HillCoefficientContextType {
  hillCoefficients: HillCoefficientData[];
  setHillCoefficients: ReturnType<typeof useHillCoefficients>["setHillCoefficients"];
  updateCoefficient: ReturnType<typeof useHillCoefficients>["updateCoefficient"];
  getCoefficientValue: ReturnType<typeof useHillCoefficients>["getCoefficientValue"];
  resetCoefficients: ReturnType<typeof useHillCoefficients>["resetCoefficients"];
}

const HillCoefficientContext = createContext<HillCoefficientContextType | null>(null);

export const HillCoefficientProvider: React.FC<{ usedProteins: Set<string>; children: ReactNode }> = ({ usedProteins, children }) => {
  const hillCoeff = useHillCoefficients(usedProteins);
  const value = useMemo(() => hillCoeff, [hillCoeff]);
  return (
    <HillCoefficientContext.Provider value={value}>
      {children}
    </HillCoefficientContext.Provider>
  );
};

export const useHillCoefficientContext = () => {
  const context = useContext(HillCoefficientContext);
  if (!context) {
    throw new Error('useHillCoefficientContext must be used within a HillCoefficientProvider');
  }
  return context;
}; 