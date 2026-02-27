import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QrCode, Phone, AtSign, CheckCircle, Camera, CameraOff } from 'lucide-react';
import { useQRScanner } from '../qr-code/useQRScanner';
import PinConfirmationModal from './PinConfirmationModal';

interface ScanPayModalProps {
  open: boolean;
  onClose: () => void;
}

type PayStep = 'input' | 'confirm' | 'pin' | 'success';

export default function ScanPayModal({ open, onClose }: ScanPayModalProps) {
  const [step, setStep] = useState<PayStep>('input');
  const [activeTab, setActiveTab] = useState('qr');
  const [mobileNumber, setMobileNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [pinOpen, setPinOpen] = useState(false);

  const {
    qrResults,
    isScanning,
    isActive,
    error: cameraError,
    isLoading: cameraLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({ facingMode: 'environment', scanInterval: 200, maxResults: 1 });

  // When QR is scanned, auto-fill recipient
  React.useEffect(() => {
    if (qrResults.length > 0 && activeTab === 'qr') {
      const scanned = qrResults[0].data;
      setRecipient(scanned);
      stopScanning();
    }
  }, [qrResults]);

  const handleClose = () => {
    stopScanning();
    clearResults();
    setStep('input');
    setMobileNumber('');
    setUpiId('');
    setAmount('');
    setRecipient('');
    onClose();
  };

  const handleProceed = () => {
    let rec = '';
    if (activeTab === 'qr') rec = recipient;
    else if (activeTab === 'mobile') rec = mobileNumber;
    else rec = upiId;
    if (!rec || !amount) return;
    setRecipient(rec);
    setPinOpen(true);
  };

  const handlePinSuccess = () => {
    setPinOpen(false);
    setStep('success');
  };

  const canProceed = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return false;
    if (activeTab === 'qr') return !!recipient;
    if (activeTab === 'mobile') return mobileNumber.length === 10;
    return upiId.includes('@');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Send Money
            </DialogTitle>
          </DialogHeader>

          {step === 'input' && (
            <div className="space-y-4">
              <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); clearResults(); stopScanning(); }}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="qr" className="flex items-center gap-1 text-xs">
                    <QrCode className="w-3 h-3" /> QR Scan
                  </TabsTrigger>
                  <TabsTrigger value="mobile" className="flex items-center gap-1 text-xs">
                    <Phone className="w-3 h-3" /> Mobile
                  </TabsTrigger>
                  <TabsTrigger value="upi" className="flex items-center gap-1 text-xs">
                    <AtSign className="w-3 h-3" /> UPI ID
                  </TabsTrigger>
                </TabsList>

                {/* QR Scanner Tab */}
                <TabsContent value="qr" className="space-y-3 mt-3">
                  {!recipient ? (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden bg-black" style={{ minHeight: 220 }}>
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          style={{ minHeight: 220 }}
                          playsInline
                          muted
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        {!isActive && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-3">
                            <QrCode className="w-12 h-12 opacity-50" />
                            <p className="text-sm opacity-70">Camera not active</p>
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-40 h-40 border-2 border-white/70 rounded-xl" />
                          </div>
                        )}
                      </div>
                      {cameraError && (
                        <p className="text-destructive text-xs text-center">{cameraError.message}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => isActive ? stopScanning() : startScanning()}
                          disabled={cameraLoading || (!canStartScanning && !isActive)}
                          variant={isActive ? 'outline' : 'default'}
                          className="flex-1"
                          size="sm"
                        >
                          {cameraLoading ? (
                            <span className="flex items-center gap-1"><span className="animate-spin">⏳</span> Loading...</span>
                          ) : isActive ? (
                            <span className="flex items-center gap-1"><CameraOff className="w-4 h-4" /> Stop</span>
                          ) : (
                            <span className="flex items-center gap-1"><Camera className="w-4 h-4" /> Scan QR</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-3">
                        <p className="text-xs text-green-700 dark:text-green-300 font-medium">QR Scanned Successfully</p>
                        <p className="text-sm font-mono mt-1 break-all">{recipient}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => { setRecipient(''); clearResults(); }} className="w-full">
                        Scan Again
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Mobile Tab */}
                <TabsContent value="mobile" className="space-y-3 mt-3">
                  <Input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="tracking-widest"
                  />
                </TabsContent>

                {/* UPI ID Tab */}
                <TabsContent value="upi" className="space-y-3 mt-3">
                  <Input
                    type="text"
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                </TabsContent>
              </Tabs>

              <div>
                <label className="text-sm font-medium mb-1 block">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  min="1"
                />
              </div>

              <Button onClick={handleProceed} disabled={!canProceed()} className="w-full">
                Proceed to Pay
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Payment Successful!</h3>
                <p className="text-muted-foreground text-sm mt-1">₹{amount} sent to {recipient || mobileNumber || upiId}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">₹{amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-semibold font-mono">FM{Math.random().toString(36).slice(2,8).toUpperCase()}</span>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full">Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PinConfirmationModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onSuccess={handlePinSuccess}
        title="Confirm Payment"
        description={`Enter PIN to send ₹${amount}`}
      />
    </>
  );
}
