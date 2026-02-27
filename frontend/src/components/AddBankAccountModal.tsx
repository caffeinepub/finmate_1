import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddBankAccount } from '../hooks/useQueries';
import { BankAccount } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import { Building2 } from 'lucide-react';

interface AddBankAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BANKS = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
  'Canara Bank', 'Union Bank of India', 'IndusInd Bank', 'Yes Bank', 'Other'
];

export default function AddBankAccountModal({ isOpen, onClose }: AddBankAccountModalProps) {
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');
  const { mutateAsync: addAccount, isPending } = useAddBankAccount();
  const { identity } = useInternetIdentity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNumber || !accountType || !balance) {
      toast.error('Please fill all fields');
      return;
    }

    const masked = '****' + accountNumber.slice(-4);
    const account: BankAccount = {
      id: 'acc_' + Date.now().toString(),
      userId: identity?.getPrincipal().toString() ?? 'unknown',
      bankName,
      accountNumber: masked,
      accountType,
      balance: parseFloat(balance),
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await addAccount(account);
      toast.success('Bank account added successfully!');
      setBankName(''); setAccountNumber(''); setAccountType(''); setBalance('');
      onClose();
    } catch {
      toast.error('Failed to add bank account');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2 justify-center mb-1">
            <Building2 size={20} className="text-primary" />
            <DialogTitle className="font-display text-xl">Add Bank Account</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Bank Name</Label>
            <Select value={bankName} onValueChange={setBankName}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select bank" />
              </SelectTrigger>
              <SelectContent>
                {BANKS.map(b => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Account Number</Label>
            <Input
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="rounded-xl"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">Last 4 digits will be shown for security</p>
          </div>

          <div className="space-y-1.5">
            <Label>Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Savings">Savings</SelectItem>
                <SelectItem value="Current">Current</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Fixed Deposit">Fixed Deposit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Current Balance (₹)</Label>
            <Input
              type="number"
              placeholder="Enter balance"
              value={balance}
              onChange={e => setBalance(e.target.value)}
              className="rounded-xl"
              min="0"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-border/50 bg-card text-sm font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1 text-sm py-3 disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </span>
              ) : 'Add Account'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
