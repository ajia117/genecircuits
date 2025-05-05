import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    ReactNode,
  } from 'react';
  import { HillCoefficientData } from '../types';
  
// ---------- Internal Hook ----------
function useHillCoefficientState(usedProteins: Set<string>) {
  const [hillCoefficients, setHillCoefficients] = useState<HillCoefficientData[]>([]);

  useEffect(() => {
    const updated: HillCoefficientData[] = [];
    const labels = Array.from(usedProteins).sort();

    labels.forEach((source) => {
      labels.forEach((target) => {
        const id = `${source}-${target}`;
        const exists = hillCoefficients.find(h => h.id === id);
        if (!exists) {
          updated.push({ id, value: 1 });
        }
      });
    });

    setHillCoefficients(prev => {
      const map = new Map<string, HillCoefficientData>();
      [...prev, ...updated].forEach(h => map.set(h.id, h));
      return Array.from(map.values());
    });
  }, [usedProteins]);

  const updateCoefficient = (id: string, value: number) => {
    setHillCoefficients(prev =>
      prev.map(coeff =>
        coeff.id === id ? { ...coeff, value } : coeff
      )
    );
  };

  const getCoefficientValue = (source: string, target: string): number => {
    const id = `${source}-${target}`;
    const coeff = hillCoefficients.find(h => h.id === id);
    return coeff ? coeff.value : 1;
  };

  const resetCoefficients = () => {
    setHillCoefficients(prev =>
      prev.map(coeff => ({ ...coeff, value: 1 }))
    );
  };

  return {
    hillCoefficients,
    setHillCoefficients,
    updateCoefficient,
    getCoefficientValue,
    resetCoefficients,
  };
}

export type HillCoefficientState = ReturnType<typeof useHillCoefficientState>;

// ---------- Context + Provider ----------
const HillCoefficientContext = createContext<HillCoefficientState | null>(null);

export const HillCoefficientProvider = ({
  usedProteins,
  children,
}: {
  usedProteins: Set<string>;
  children: ReactNode;
}) => {
  const state = useHillCoefficientState(usedProteins);
  const memoized = useMemo(() => state, [state.hillCoefficients]);

  return (
    <HillCoefficientContext.Provider value={memoized}>
      {children}
    </HillCoefficientContext.Provider>
  );
};

export const useHillCoefficientContext = (): HillCoefficientState => {
  const context = useContext(HillCoefficientContext);
  if (!context) {
    throw new Error('useHillCoefficientContext must be used within a HillCoefficientProvider');
  }
  return context;
};
