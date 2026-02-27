import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ADS = [
  {
    id: 1,
    image: '/assets/generated/ad-sip.dim_800x200.png',
    headline: 'Start Your SIP Today',
    description: 'Invest as little as ₹500/month in top mutual funds. Build wealth systematically.',
    cta: 'Start SIP',
    gradient: 'from-emerald-600 to-teal-500',
  },
  {
    id: 2,
    image: '/assets/generated/ad-trading.dim_800x200.png',
    headline: 'Trade Smarter with FinMate',
    description: 'Zero brokerage on equity delivery. Advanced charts & real-time data.',
    cta: 'Start Trading',
    gradient: 'from-blue-600 to-indigo-500',
  },
  {
    id: 3,
    image: '/assets/generated/ad-studentloan.dim_800x200.png',
    headline: 'Student Loans Made Easy',
    description: 'Get education loans up to ₹50L at 8.5% p.a. Quick approval in 24 hours.',
    cta: 'Apply Now',
    gradient: 'from-violet-600 to-purple-500',
  },
  {
    id: 4,
    image: '/assets/generated/ad-mutualfunds.dim_800x200.png',
    headline: 'Grow Your Investments',
    description: 'Diversify with top-rated mutual funds. Expert-curated portfolios for every goal.',
    cta: 'Invest Now',
    gradient: 'from-orange-500 to-amber-400',
  },
  {
    id: 5,
    image: '/assets/generated/ad-banner-1.dim_800x200.png',
    headline: 'FinMate Premium',
    description: 'Unlock advanced analytics, priority support & exclusive cashback offers.',
    cta: 'Upgrade Free',
    gradient: 'from-rose-500 to-pink-500',
  },
];

export default function AdBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % ADS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const ad = ADS[current];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md">
      <div className={`bg-gradient-to-r ${ad.gradient} p-4 min-h-[120px] flex items-center`}>
        <div className="flex-1">
          <h3 className="text-white font-bold text-base mb-1">{ad.headline}</h3>
          <p className="text-white/80 text-xs mb-3 leading-relaxed">{ad.description}</p>
          <button className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors border border-white/30">
            {ad.cta}
          </button>
        </div>
        <div className="w-20 h-20 ml-3 rounded-xl overflow-hidden opacity-80 flex-shrink-0">
          <img src={ad.image} alt={ad.headline} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrent(prev => (prev - 1 + ADS.length) % ADS.length)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => setCurrent(prev => (prev + 1) % ADS.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-black/40 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {ADS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white w-3' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
