import { useState, useCallback } from 'react';

export interface Beneficiary {
  id: string;
  name: string;
  identifier: string; // mobile number or UPI ID
  type: 'mobile' | 'upi';
  lastTransactionDate?: string;
}

const STORAGE_KEY = 'finmate_beneficiaries';

export function useBeneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addBeneficiary = useCallback((beneficiary: Omit<Beneficiary, 'id'>) => {
    const newBeneficiary: Beneficiary = {
      ...beneficiary,
      id: Date.now().toString(),
    };
    setBeneficiaries(prev => {
      const updated = [...prev, newBeneficiary];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeBeneficiary = useCallback((id: string) => {
    setBeneficiaries(prev => {
      const updated = prev.filter(b => b.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { beneficiaries, addBeneficiary, removeBeneficiary };
}
