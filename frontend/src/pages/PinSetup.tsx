import { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface PinSetupProps {
  onSetup: (pin: string) => void;
}

export default function PinSetup({ onSetup }: PinSetupProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleKeyPress = (digit: string) => {
    if (step === 'enter') {
      if (pin.length < 6) {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 4) {
          // Allow up to 6 digits, auto-advance at 4 if user doesn't add more
        }
      }
    } else {
      if (confirmPin.length < 6) {
        setConfirmPin(prev => prev + digit);
      }
    }
    setError('');
  };

  const handleDelete = () => {
    if (step === 'enter') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
    setError('');
  };

  const handleNext = () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (confirmPin !== pin) {
      setError('PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }
    onSetup(pin);
  };

  const currentPin = step === 'enter' ? pin : confirmPin;

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
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            {step === 'enter' ? 'Set Your PIN' : 'Confirm PIN'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {step === 'enter'
              ? 'Create a 4-6 digit PIN to secure your account'
              : 'Re-enter your PIN to confirm'}
          </p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`pin-dot ${i < currentPin.length ? 'filled' : ''} ${i >= 4 ? 'opacity-40' : ''}`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-2 mb-4 text-center">
            <p className="text-destructive text-sm">{error}</p>
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

        {/* Action Button */}
        <button
          onClick={step === 'enter' ? handleNext : handleConfirm}
          disabled={currentPin.length < 4}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 'enter' ? 'Continue' : 'Set PIN'}
        </button>

        {step === 'confirm' && (
          <button
            onClick={() => { setStep('enter'); setConfirmPin(''); setError(''); }}
            className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
