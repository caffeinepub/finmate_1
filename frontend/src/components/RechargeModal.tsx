import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, CheckCircle, ChevronRight, Users } from 'lucide-react';
import PinConfirmationModal from './PinConfirmationModal';

interface RechargeModalProps {
  open: boolean;
  onClose: () => void;
}

const MOCK_CONTACTS = [
  { name: 'Mom', number: '9876543210' },
  { name: 'Dad', number: '9876543211' },
  { name: 'Rahul', number: '9876543212' },
  { name: 'Priya', number: '9876543213' },
];

const PREPAID_PLANS = [
  { id: 1, amount: 199, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 2, amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 3, amount: 399, validity: '56 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 4, amount: 599, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day' },
];

const POSTPAID_PLANS = [
  { id: 5, amount: 399, validity: 'Monthly', data: '40GB', calls: 'Unlimited', sms: 'Unlimited' },
  { id: 6, amount: 599, validity: 'Monthly', data: '75GB', calls: 'Unlimited', sms: 'Unlimited' },
  { id: 7, amount: 999, validity: 'Monthly', data: '150GB', calls: 'Unlimited', sms: 'Unlimited' },
];

type Step = 'input' | 'plans' | 'pin' | 'success';

export default function RechargeModal({ open, onClose }: RechargeModalProps) {
  const [step, setStep] = useState<Step>('input');
  const [phone, setPhone] = useState('');
  const [planType, setPlanType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [selectedPlan, setSelectedPlan] = useState<typeof PREPAID_PLANS[0] | null>(null);
  const [pinOpen, setPinOpen] = useState(false);

  const plans = planType === 'prepaid' ? PREPAID_PLANS : POSTPAID_PLANS;

  const handleClose = () => {
    setStep('input');
    setPhone('');
    setSelectedPlan(null);
    onClose();
  };

  const handleProceed = () => {
    if (phone.length === 10) setStep('plans');
  };

  const handleSelectPlan = (plan: typeof PREPAID_PLANS[0]) => {
    setSelectedPlan(plan);
    setPinOpen(true);
  };

  const handlePinSuccess = () => {
    setPinOpen(false);
    setStep('success');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Mobile Recharge
            </DialogTitle>
          </DialogHeader>

          {step === 'input' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="text-lg tracking-widest"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="w-4 h-4" /> Recent Contacts
                </p>
                <div className="space-y-2">
                  {MOCK_CONTACTS.map(c => (
                    <button
                      key={c.number}
                      onClick={() => setPhone(c.number)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {c.name[0]}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.number}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleProceed} disabled={phone.length !== 10} className="w-full">
                View Plans
              </Button>
            </div>
          )}

          {step === 'plans' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-medium">{phone}</span>
                <button onClick={() => setStep('input')} className="ml-auto text-xs text-primary">Change</button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPlanType('prepaid')}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${planType === 'prepaid' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  Prepaid
                </button>
                <button
                  onClick={() => setPlanType('postpaid')}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${planType === 'postpaid' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  Postpaid
                </button>
              </div>

              <div className="space-y-2">
                {plans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full p-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-primary">₹{plan.amount}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{plan.validity}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span>📶 {plan.data}</span>
                      <span>📞 {plan.calls}</span>
                      <span>💬 {plan.sms}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'success' && selectedPlan && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Recharge Successful!</h3>
                <p className="text-muted-foreground text-sm mt-1">₹{selectedPlan.amount} recharge for {phone}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">₹{selectedPlan.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Validity</span>
                  <span className="font-semibold">{selectedPlan.validity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-semibold">{selectedPlan.data}</span>
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
        title="Confirm Recharge"
        description={`Enter PIN to recharge ₹${selectedPlan?.amount} for ${phone}`}
      />
    </>
  );
}
