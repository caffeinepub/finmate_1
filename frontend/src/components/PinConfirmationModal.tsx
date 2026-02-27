import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePinAuth } from '../hooks/usePinAuth';
import { Lock, X } from 'lucide-react';

interface PinConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export default function PinConfirmationModal({
  open,
  onClose,
  onSuccess,
  title = 'Confirm PIN',
  description = 'Enter your 4-digit PIN to continue',
}: PinConfirmationModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { verifyPin } = usePinAuth();

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        setTimeout(() => {
          const valid = verifyPin(newPin);
          if (valid) {
            setPin('');
            onSuccess();
          } else {
            setError('Incorrect PIN. Please try again.');
            setPin('');
          }
        }, 100);
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 my-4">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length ? 'bg-primary border-primary' : 'border-muted-foreground/40'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm text-center -mt-2 mb-2">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 px-4">
          {['1','2','3','4','5','6','7','8','9'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              className="h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xl font-semibold transition-colors active:scale-95"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xl font-semibold transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors active:scale-95 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Button variant="ghost" onClick={handleClose} className="mt-2 w-full">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
