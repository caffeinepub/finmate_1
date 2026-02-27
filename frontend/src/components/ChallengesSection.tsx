import { useState } from 'react';
import { Trophy, Star, ChevronRight, Medal } from 'lucide-react';
import { useGetChallenges, useGetTransactions, getCategoryLabel, getCategoryEmoji } from '../hooks/useQueries';
import { TransactionType } from '../backend';
import { Progress } from '@/components/ui/progress';
import LeaderboardModal from './LeaderboardModal';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChallengesSection() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { data: challenges, isLoading: challengesLoading } = useGetChallenges();
  const { data: transactions } = useGetTransactions();

  const getChallengeProgress = (targetAmount: number, category: string): number => {
    if (!transactions) return 0;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartMs = BigInt(monthStart.getTime()) * BigInt(1_000_000);

    const spent = transactions
      .filter(t =>
        t.transactionType === TransactionType.debit &&
        t.category === category &&
        t.date >= monthStartMs
      )
      .reduce((sum, t) => sum + t.amount, 0);

    // For savings challenges, progress = how much they've saved (not spent)
    // We'll show it as: if they spent less than target, they're on track
    const progress = Math.min((spent / targetAmount) * 100, 100);
    return Math.round(progress);
  };

  if (challengesLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  const displayChallenges = challenges && challenges.length > 0 ? challenges : [
    {
      id: 'c1',
      title: 'Food Budget Master',
      description: 'Keep food spending under ₹3,000 this month',
      category: 'food',
      targetAmount: 3000,
      digiPointsReward: BigInt(150),
      durationDays: BigInt(30),
    },
    {
      id: 'c2',
      title: 'Travel Saver',
      description: 'Save ₹5,000 for your next trip',
      category: 'travel',
      targetAmount: 5000,
      digiPointsReward: BigInt(300),
      durationDays: BigInt(30),
    },
    {
      id: 'c3',
      title: 'Zero Entertainment',
      description: 'Spend less than ₹500 on entertainment',
      category: 'entertainment',
      targetAmount: 500,
      digiPointsReward: BigInt(100),
      durationDays: BigInt(7),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-primary" />
          <h2 className="section-title">Challenges</h2>
        </div>
        <button
          onClick={() => setShowLeaderboard(true)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
        >
          <Medal size={12} />
          Leaderboard
        </button>
      </div>

      <div className="space-y-3">
        {displayChallenges.map(challenge => {
          const progress = getChallengeProgress(challenge.targetAmount, challenge.category as string);
          const isCompleted = progress >= 100;

          return (
            <div
              key={challenge.id}
              className={`bg-card border rounded-2xl p-4 transition-all duration-200 hover:shadow-card ${
                isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-border/50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getCategoryEmoji(challenge.category as any)}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{challenge.title}</h3>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full flex-shrink-0">
                  <Star size={10} className="text-primary fill-primary" />
                  <span className="text-xs font-bold text-primary">{challenge.digiPointsReward.toString()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{isCompleted ? '✅ Completed!' : `${progress}% progress`}</span>
                  <span>{Number(challenge.durationDays)} days</span>
                </div>
                <Progress
                  value={progress}
                  className={`h-2 ${isCompleted ? '[&>div]:bg-green-500' : ''}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </div>
  );
}
