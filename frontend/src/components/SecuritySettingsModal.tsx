import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Smartphone, Fingerprint, CheckCircle, X, LogOut } from 'lucide-react';
import { usePinAuth } from '../hooks/usePinAuth';

interface SecuritySettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_SESSIONS = [
  { id: '1', device: 'iPhone 14 Pro', location: 'Mumbai, India', lastActive: '2 minutes ago', current: true },
  { id: '2', device: 'MacBook Pro', location: 'Mumbai, India', lastActive: '1 hour ago', current: false },
  { id: '3', device: 'Chrome on Windows', location: 'Pune, India', lastActive: '2 days ago', current: false },
];

export default function SecuritySettingsModal({ open, onClose }: SecuritySettingsModalProps) {
  const { verifyPin, setPin, biometricEnabled, setBiometricEnabled } = usePinAuth();

  // Change PIN state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinStep, setPinStep] = useState<'current' | 'new' | 'confirm' | 'success'>('current');
  const [pinError, setPinError] = useState('');

  // Sessions state
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const handlePinDigit = (digit: string, target: 'current' | 'new' | 'confirm') => {
    if (target === 'current' && currentPin.length < 4) {
      const val = currentPin + digit;
      setCurrentPin(val);
      if (val.length === 4) {
        setTimeout(() => {
          if (verifyPin(val)) {
            setPinStep('new');
            setPinError('');
          } else {
            setPinError('Incorrect current PIN');
            setCurrentPin('');
          }
        }, 100);
      }
    } else if (target === 'new' && newPin.length < 4) {
      const val = newPin + digit;
      setNewPin(val);
      if (val.length === 4) setPinStep('confirm');
    } else if (target === 'confirm' && confirmPin.length < 4) {
      const val = confirmPin + digit;
      setConfirmPin(val);
      if (val.length === 4) {
        setTimeout(() => {
          if (val === newPin) {
            setPin(newPin);
            setPinStep('success');
            setPinError('');
          } else {
            setPinError('PINs do not match');
            setConfirmPin('');
            setNewPin('');
            setPinStep('new');
          }
        }, 100);
      }
    }
  };

  const handleBackspace = (target: 'current' | 'new' | 'confirm') => {
    if (target === 'current') setCurrentPin(p => p.slice(0, -1));
    else if (target === 'new') setNewPin(p => p.slice(0, -1));
    else setConfirmPin(p => p.slice(0, -1));
    setPinError('');
  };

  const resetPinFlow = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setPinStep('current');
    setPinError('');
  };

  const handleClose = () => {
    resetPinFlow();
    onClose();
  };

  const handleLogoutSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id === '1' || s.id !== id));
  };

  const renderPinDots = (value: string) => (
    <div className="flex justify-center gap-4 my-4">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full border-2 transition-all ${i < value.length ? 'bg-primary border-primary' : 'border-muted-foreground/40'}`}
        />
      ))}
    </div>
  );

  const renderNumpad = (target: 'current' | 'new' | 'confirm') => (
    <div className="grid grid-cols-3 gap-2 px-2">
      {['1','2','3','4','5','6','7','8','9'].map(d => (
        <button
          key={d}
          onClick={() => handlePinDigit(d, target)}
          className="h-12 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-lg font-semibold transition-colors active:scale-95"
        >
          {d}
        </button>
      ))}
      <div />
      <button
        onClick={() => handlePinDigit('0', target)}
        className="h-12 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-lg font-semibold transition-colors active:scale-95"
      >
        0
      </button>
      <button
        onClick={() => handleBackspace(target)}
        className="h-12 rounded-xl bg-muted hover:bg-muted/80 text-foreground transition-colors active:scale-95 flex items-center justify-center"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pin">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pin" className="text-xs">Change PIN</TabsTrigger>
            <TabsTrigger value="sessions" className="text-xs">Sessions</TabsTrigger>
            <TabsTrigger value="biometric" className="text-xs">Biometric</TabsTrigger>
          </TabsList>

          {/* Change PIN Tab */}
          <TabsContent value="pin" className="mt-4">
            {pinStep === 'success' ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold">PIN Changed Successfully!</h3>
                <p className="text-sm text-muted-foreground">Your new PIN is now active.</p>
                <Button onClick={resetPinFlow} variant="outline" className="w-full">Change Again</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                  {pinStep === 'current' ? 'Enter your current PIN' : pinStep === 'new' ? 'Enter your new PIN' : 'Confirm your new PIN'}
                </p>
                {pinStep === 'current' && renderPinDots(currentPin)}
                {pinStep === 'new' && renderPinDots(newPin)}
                {pinStep === 'confirm' && renderPinDots(confirmPin)}
                {pinError && <p className="text-destructive text-xs text-center">{pinError}</p>}
                {pinStep === 'current' && renderNumpad('current')}
                {pinStep === 'new' && renderNumpad('new')}
                {pinStep === 'confirm' && renderNumpad('confirm')}
              </div>
            )}
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">Manage your active login sessions</p>
            {sessions.map(session => (
              <div key={session.id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.device}</p>
                  <p className="text-xs text-muted-foreground">{session.location} • {session.lastActive}</p>
                  {session.current && (
                    <span className="text-xs text-green-600 font-medium">Current session</span>
                  )}
                </div>
                {!session.current && (
                  <button
                    onClick={() => handleLogoutSession(session.id)}
                    className="text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </TabsContent>

          {/* Biometric Tab */}
          <TabsContent value="biometric" className="mt-4 space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <img src="/assets/generated/fingerprint-icon.dim_128x128.png" alt="Biometric" className="w-10 h-10 object-contain" />
              </div>
              <h3 className="font-semibold">Biometric Authentication</h3>
              <p className="text-sm text-muted-foreground mt-1">Use fingerprint or face ID to unlock FinMate</p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Biometric Login</p>
                  <p className="text-xs text-muted-foreground">{biometricEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <Switch
                checked={biometricEnabled}
                onCheckedChange={setBiometricEnabled}
              />
            </div>
            {biometricEnabled && (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-3">
                <p className="text-xs text-green-700 dark:text-green-300">✅ Biometric authentication is active. You can use your fingerprint or face ID to log in.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
