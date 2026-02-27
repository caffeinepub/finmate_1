import React, { useState } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AdBanner from '../components/AdBanner';
import RechargeModal from '../components/RechargeModal';
import TicketBookingModal from '../components/TicketBookingModal';
import ScanPayModal from '../components/ScanPayModal';
import LeaderboardModal from '../components/LeaderboardModal';
import SpendingLimitsCard from '../components/SpendingLimitsCard';
import ChallengesSection from '../components/ChallengesSection';
import CustomerFeedbackSection from '../components/CustomerFeedbackSection';
import AIChatbotFAB from '../components/AIChatbotFAB';
import FinMateWalletCard from '../components/FinMateWalletCard';
import { Trophy, Bell, Wallet, Zap, Ticket, SendHorizonal } from 'lucide-react';

export default function Home() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();

  const [rechargeOpen, setRechargeOpen] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [scanPayOpen, setScanPayOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const walletId = identity?.getPrincipal().toString() ?? '';

  const quickActions = [
    {
      label: 'Check Balance',
      icon: <Wallet className="w-6 h-6" />,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      onClick: () => setLeaderboardOpen(false),
    },
    {
      label: 'Recharge',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      onClick: () => setRechargeOpen(true),
    },
    {
      label: 'Tickets',
      icon: <Ticket className="w-6 h-6" />,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      onClick: () => setTicketOpen(true),
    },
    {
      label: 'Send Money',
      icon: <SendHorizonal className="w-6 h-6" />,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      onClick: () => setScanPayOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/70 text-sm">{greeting()},</p>
            <h1 className="text-xl font-bold">{userProfile?.name || 'User'} 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLeaderboardOpen(true)}
              className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
            >
              <Trophy className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Ad Banner */}
        <AdBanner />

        {/* FinMate Wallet Card */}
        {walletId && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">My Wallet</h2>
            <FinMateWalletCard
              walletId={walletId}
              walletBalance={userProfile?.walletBalance ?? 0n}
              userName={userProfile?.name}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center gap-2 p-3 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.bg}`}>
                  <span className={action.color}>{action.icon}</span>
                </div>
                <span className="text-xs font-medium text-foreground leading-tight text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Spending Limits */}
        <SpendingLimitsCard />

        {/* Challenges */}
        <ChallengesSection />

        {/* Customer Feedback */}
        <CustomerFeedbackSection />
      </div>

      {/* Modals */}
      <RechargeModal open={rechargeOpen} onClose={() => setRechargeOpen(false)} />
      <TicketBookingModal open={ticketOpen} onClose={() => setTicketOpen(false)} />
      <ScanPayModal open={scanPayOpen} onClose={() => setScanPayOpen(false)} />
      <LeaderboardModal isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />

      {/* AI Chatbot FAB */}
      <AIChatbotFAB />
    </div>
  );
}
