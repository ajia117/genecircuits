import { useState, useEffect } from 'react';
import { HillCoefficientData } from '../types';

export function useHillCoefficients(usedProteins: Set<string>) {
    const [hillCoefficients, setHillCoefficients] = useState<HillCoefficientData[]>([]);

    // Handler to ensure deduplication of ids
    useEffect(() => {
        // Create a new array to hold updated coefficients
        const updated: HillCoefficientData[] = [];

        // Convert set to sorted array for consistent ordering
        const labels = Array.from(usedProteins).sort();

        labels.forEach((source) => {
            labels.forEach((target) => {
                const id = `${source}-${target}`;
                const existingCoeff = hillCoefficients.find(h => h.id === id);
                if (!existingCoeff) {
                    // Create new coefficient with default value
                    updated.push({ id, value: 1 });
                }
            });
        });

        if (updated.length > 0) {
            setHillCoefficients(prev => {
                // Use a Map to deduplicate by id
                const map = new Map<string, HillCoefficientData>();
                [...prev, ...updated].forEach(h => {
                    map.set(h.id, h);
                });
                return Array.from(map.values());
            });
        } else {
            // Always deduplicate, even if no new updates
            setHillCoefficients(prev => {
                const map = new Map<string, HillCoefficientData>();
                prev.forEach(h => {
                    map.set(h.id, h);
                });
                return Array.from(map.values());
            });
        }
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
        resetCoefficients
    };
}