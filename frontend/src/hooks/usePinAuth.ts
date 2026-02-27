import { useState, useCallback } from 'react';

const PIN_STORAGE_KEY = 'finmate_pin_hash';
const BIOMETRIC_STORAGE_KEY = 'finmate_biometric_enabled';

function simpleHash(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

export function usePinAuth() {
  const [isPinSet, setIsPinSet] = useState(() => !!localStorage.getItem(PIN_STORAGE_KEY));
  const [biometricEnabled, setBiometricEnabledState] = useState(
    () => localStorage.getItem(BIOMETRIC_STORAGE_KEY) === 'true'
  );

  const setPin = useCallback((pin: string) => {
    localStorage.setItem(PIN_STORAGE_KEY, simpleHash(pin));
    setIsPinSet(true);
  }, []);

  const verifyPin = useCallback((pin: string): boolean => {
    const stored = localStorage.getItem(PIN_STORAGE_KEY);
    if (!stored) return false;
    return stored === simpleHash(pin);
  }, []);

  const clearPin = useCallback(() => {
    localStorage.removeItem(PIN_STORAGE_KEY);
    setIsPinSet(false);
  }, []);

  const setBiometricEnabled = useCallback((enabled: boolean) => {
    localStorage.setItem(BIOMETRIC_STORAGE_KEY, enabled.toString());
    setBiometricEnabledState(enabled);
  }, []);

  // Legacy-compatible helpers used by App.tsx / PinSetup / PinEntry
  const setupPin = useCallback((pin: string) => {
    setPin(pin);
  }, [setPin]);

  const simulateBiometric = useCallback((): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 800);
    });
  }, []);

  return {
    // New API
    isPinSet,
    biometricEnabled,
    setPin,
    verifyPin,
    clearPin,
    setBiometricEnabled,
    // Legacy API (used by App.tsx, PinSetup, PinEntry)
    setupPin,
    simulateBiometric,
    state: isPinSet ? 'locked' as const : 'setup' as const,
    error: null as string | null,
    clearError: () => {},
  };
}
