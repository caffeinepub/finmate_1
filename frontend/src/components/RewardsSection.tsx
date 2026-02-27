import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Gift, Copy, Check, ExternalLink } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

const BRAND_OFFERS = [
  {
    id: 1,
    brand: 'Amazon Pay',
    logo: '🛒',
    offer: '5% cashback on all purchases',
    validity: 'Valid till Mar 31, 2026',
    color: 'from-orange-500 to-amber-400',
    code: 'FINMATE5',
  },
  {
    id: 2,
    brand: 'Swiggy',
    logo: '🍔',
    offer: '₹100 off on orders above ₹299',
    validity: 'Valid till Feb 28, 2026',
    color: 'from-orange-600 to-red-500',
    code: 'FINSWIGGY',
  },
  {
    id: 3,
    brand: 'MakeMyTrip',
    logo: '✈️',
    offer: '12% off on flight bookings',
    validity: 'Valid till Apr 30, 2026',
    color: 'from-blue-600 to-indigo-500',
    code: 'FINTRIP12',
  },
  {
    id: 4,
    brand: 'Myntra',
    logo: '👗',
    offer: '₹200 off on orders above ₹999',
    validity: 'Valid till Mar 15, 2026',
    color: 'from-pink-500 to-rose-500',
    code: 'FINMYNTRA',
  },
];

export default function RewardsSection() {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { data: profile } = useGetCallerUserProfile();

  const referralCode = profile?.referralCode || 'FINMATE2026';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(key);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
            <Gift className="w-5 h-5 text-amber-600" />
          </div>
          <span className="font-semibold text-foreground">Rewards & Brand Offers</span>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-4 space-y-4">
          {/* Referral Code */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-4 text-primary-foreground">
            <p className="text-xs opacity-70 mb-1">Your Referral Code</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold tracking-widest font-mono">{referralCode}</span>
              <button
                onClick={() => handleCopy(referralCode, 'referral')}
                className="flex items-center gap-1 bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                {copiedCode === 'referral' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedCode === 'referral' ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs opacity-70 mt-2">Share & earn ₹100 for each friend who joins FinMate</p>
          </div>

          {/* Brand Offers */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Exclusive Brand Offers</p>
            <div className="space-y-3">
              {BRAND_OFFERS.map(offer => (
                <div key={offer.id} className="border border-border rounded-xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${offer.color} px-4 py-3 flex items-center gap-3`}>
                    <span className="text-2xl">{offer.logo}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{offer.brand}</p>
                      <p className="text-white/80 text-xs">{offer.offer}</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between bg-muted/30">
                    <div>
                      <p className="text-xs text-muted-foreground">{offer.validity}</p>
                      <p className="text-xs font-mono font-semibold text-foreground mt-0.5">Code: {offer.code}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(offer.code, offer.id.toString())}
                      className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      {copiedCode === offer.id.toString() ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedCode === offer.id.toString() ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
