import { useState } from 'react';
import { Fingerprint, Lock } from 'lucide-react';

interface PinEntryProps {
  onVerify: (pin: string) => boolean;
  onBiometric: () => Promise<boolean>;
  error: string | null;
  clearError: () => void;
}

export default function PinEntry({ onVerify, onBiometric, error, clearError }: PinEntryProps) {
  const [pin, setPin] = useState('');
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      clearError();
      if (newPin.length >= 4) {
        // Auto-submit after 4 digits if user doesn't add more within 500ms
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    clearError();
  };

  const handleVerify = () => {
    if (pin.length < 4) return;
    const success = onVerify(pin);
    if (!success) {
      setPin('');
      setAttempts(prev => prev + 1);
    }
  };

  const handleBiometric = async () => {
    setBiometricLoading(true);
    try {
      await onBiometric();
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="absolute inset-0 finmate-gradient opacity-5 pointer-events-none" />

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow mx-auto mb-4">
            <img src="/assets/generated/finmate-logo.dim_256x256.png" alt="FinMate" className="w-full h-full object-cover" />
          </div>
          <div className="w-12 h-12 rounded-full finmate-gradient flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Enter your PIN to continue</p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? 'filled' : ''} ${i >= 4 ? 'opacity-40' : ''}`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2 mb-4 text-center">
            <p className="text-destructive text-sm">{error}</p>
            {attempts >= 3 && (
              <p className="text-xs text-muted-foreground mt-1">
                Having trouble? Use fingerprint authentication below.
              </p>
            )}
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (key === '⌫') handleDelete();
                else if (key !== '') handleKeyPress(key);
              }}
              disabled={key === ''}
              className={`
                h-16 rounded-2xl text-xl font-semibold transition-all duration-150 active:scale-95
                ${key === '' ? 'invisible' : ''}
                ${key === '⌫'
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  : 'bg-card border border-border/50 text-foreground hover:bg-primary/10 hover:border-primary/30 shadow-xs'
                }
              `}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={pin.length < 4}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          Unlock
        </button>

        {/* Biometric */}
        <button
          onClick={handleBiometric}
          disabled={biometricLoading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border border-border/50 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-95"
        >
          {biometricLoading ? (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <img
              src="/assets/generated/fingerprint-icon.dim_128x128.png"
              alt="Fingerprint"
              className="w-8 h-8 object-contain"
            />
          )}
          <span className="text-sm font-medium text-foreground">
            {biometricLoading ? 'Authenticating...' : 'Use Fingerprint'}
          </span>
        </button>
      </div>
    </div>
  );
}
