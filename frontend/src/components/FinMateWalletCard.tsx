import React, { useState } from 'react';
import { Wallet, QrCode, SendHorizonal, Eye, EyeOff, ArrowDownLeft } from 'lucide-react';
import WalletQRModal from './WalletQRModal';
import ScanPayModal from './ScanPayModal';

interface FinMateWalletCardProps {
  walletId: string;
  walletBalance: bigint;
  userName?: string;
}

export default function FinMateWalletCard({ walletId, walletBalance, userName }: FinMateWalletCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(walletBalance));

  const shortWalletId = walletId.length > 16
    ? walletId.slice(0, 8) + '...' + walletId.slice(-6)
    : walletId;

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden shadow-card"
        style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)' }}
      >
        {/* Card Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium">FinMate Wallet</p>
                <p className="text-white text-xs font-mono truncate max-w-[140px]">{shortWalletId}</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
            >
              {showBalance ? <EyeOff size={14} className="text-white" /> : <Eye size={14} className="text-white" />}
            </button>
          </div>

          {/* Balance */}
          <div className="mb-1">
            <p className="text-white/70 text-xs mb-1">Wallet Balance</p>
            <p className="text-white text-2xl font-bold tracking-tight">
              {showBalance ? formattedBalance : '₹ ••••••'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-white/15" />

        {/* Action Buttons */}
        <div className="px-5 py-4 flex gap-3">
          <button
            onClick={() => setSendOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
          >
            <SendHorizonal size={15} className="text-white" />
            <span className="text-white text-sm font-semibold">Send</span>
          </button>
          <button
            onClick={() => setQrOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
          >
            <ArrowDownLeft size={15} className="text-white" />
            <span className="text-white text-sm font-semibold">Receive</span>
          </button>
          <button
            onClick={() => setQrOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition-colors"
          >
            <QrCode size={16} className="text-white" />
          </button>
        </div>
      </div>

      <WalletQRModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        walletId={walletId}
        userName={userName}
      />
      <ScanPayModal open={sendOpen} onClose={() => setSendOpen(false)} />
    </>
  );
}
