import React, { useMemo } from 'react';
import { X, Copy, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateQRMatrix } from '../lib/qrcode';

interface WalletQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletId: string;
  userName?: string;
}

function QRCodeDisplay({ value, size = 200 }: { value: string; size?: number }) {
  const matrix = useMemo(() => {
    try {
      return generateQRMatrix(value);
    } catch {
      return null;
    }
  }, [value]);

  if (!matrix) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-xl"
        style={{ width: size, height: size }}
      >
        <span className="text-muted-foreground text-xs">QR Error</span>
      </div>
    );
  }

  const moduleCount = matrix.length;
  const moduleSize = size / moduleCount;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', borderRadius: '8px' }}
    >
      <rect width={size} height={size} fill="white" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * moduleSize}
              y={r * moduleSize}
              width={moduleSize}
              height={moduleSize}
              fill="#1a1a2e"
            />
          ) : null
        )
      )}
    </svg>
  );
}

export default function WalletQRModal({ isOpen, onClose, walletId, userName }: WalletQRModalProps) {
  const shortId = walletId.length > 20 ? walletId.slice(0, 10) + '...' + walletId.slice(-8) : walletId;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletId);
    toast.success('Wallet ID copied to clipboard!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FinMate Wallet',
          text: `Send money to ${userName || 'me'} on FinMate: ${walletId}`,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl border-0 p-0 overflow-hidden">
        {/* Gradient Header */}
        <div
          className="px-6 pt-6 pb-4 text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-lg font-bold">Receive Money</DialogTitle>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          </DialogHeader>
          <p className="text-white/80 text-sm mt-1">
            Share your QR code to receive payments
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-card px-6 py-6 flex flex-col items-center gap-4">
          {/* QR Code with decorative border */}
          <div className="relative">
            <div
              className="p-3 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.15))',
                border: '2px solid rgba(124,58,237,0.2)',
              }}
            >
              <div className="bg-white rounded-xl p-2 shadow-sm">
                <QRCodeDisplay value={walletId} size={180} />
              </div>
            </div>
            {/* FinMate logo overlay hint */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
            >
              FinMate
            </div>
          </div>

          {/* User name */}
          {userName && (
            <div className="mt-4 text-center">
              <p className="font-bold text-foreground text-base">{userName}</p>
              <p className="text-xs text-muted-foreground mt-0.5">FinMate Wallet</p>
            </div>
          )}

          {/* Wallet ID */}
          <div className="w-full bg-secondary/60 rounded-xl px-4 py-3 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">Wallet ID</p>
              <p className="font-mono text-xs text-foreground truncate">{shortId}</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <Copy size={14} className="text-primary" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2 rounded-xl"
              onClick={handleCopy}
            >
              <Copy size={16} />
              Copy ID
            </Button>
            <Button
              className="flex-1 gap-2 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
              onClick={handleShare}
            >
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
