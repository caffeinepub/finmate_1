import React, { useState, useEffect, useRef } from 'react';
import { EyeOff, Lock, Wallet } from 'lucide-react';
import { useGetBankAccounts } from '../hooks/useQueries';
import { formatCurrency } from '../hooks/useQueries';
import PinConfirmationModal from './PinConfirmationModal';

export default function BalanceCard() {
  const { data: accounts = [] } = useGetBankAccounts();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleCheckBalance = () => {
    setPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setPinModalOpen(false);
    setBalanceVisible(true);
    // Auto-hide after 30 seconds
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setBalanceVisible(false);
    }, 30000);
  };

  const handleHideBalance = () => {
    setBalanceVisible(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <>
      <div className="bg-primary-foreground/10 rounded-2xl p-4 border border-primary-foreground/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-xs mb-1">Total Balance</p>
            {balanceVisible ? (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(totalBalance)}</p>
                <button onClick={handleHideBalance} className="text-primary-foreground/70 hover:text-primary-foreground">
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-primary-foreground tracking-widest">••••••</p>
              </div>
            )}
          </div>
          <button
            onClick={handleCheckBalance}
            className="flex flex-col items-center gap-1 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-xl px-3 py-2"
          >
            <div className="flex items-center gap-1">
              <Wallet className="w-6 h-6 text-primary-foreground" />
              <Lock className="w-3 h-3 text-primary-foreground/70" />
            </div>
            <span className="text-xs text-primary-foreground/80 font-medium">Check Balance</span>
          </button>
        </div>
        {balanceVisible && (
          <div className="mt-3 pt-3 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/60 text-xs">
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} linked • Auto-hides in 30s
            </p>
          </div>
        )}
      </div>

      <PinConfirmationModal
        open={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        title="Check Balance"
        description="Enter your 4-digit PIN to view your balance"
      />
    </>
  );
}
