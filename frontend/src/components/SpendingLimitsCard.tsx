import { useState } from 'react';
import { Target, Settings } from 'lucide-react';
import { useGetTransactions, getCategoryLabel, getCategoryEmoji, formatCurrency } from '../hooks/useQueries';
import { TransactionCategory, TransactionType } from '../backend';
import { Progress } from '@/components/ui/progress';
import SetLimitsModal from './SetLimitsModal';

export type SpendingLimits = Partial<Record<TransactionCategory, number>>;

const DEFAULT_LIMITS: SpendingLimits = {
  [TransactionCategory.food]: 5000,
  [TransactionCategory.entertainment]: 2000,
  [TransactionCategory.shopping]: 3000,
  [TransactionCategory.travel]: 8000,
  [TransactionCategory.utilities]: 2500,
};

const LIMITS_STORAGE_KEY = 'finmate_spending_limits';

export function useSpendingLimits() {
  const stored = localStorage.getItem(LIMITS_STORAGE_KEY);
  const initial = stored ? JSON.parse(stored) : DEFAULT_LIMITS;
  const [limits, setLimitsState] = useState<SpendingLimits>(initial);

  const setLimits = (newLimits: SpendingLimits) => {
    setLimitsState(newLimits);
    localStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify(newLimits));
  };

  return { limits, setLimits };
}

export default function SpendingLimitsCard() {
  const [showModal, setShowModal] = useState(false);
  const { limits, setLimits } = useSpendingLimits();
  const { data: transactions } = useGetTransactions();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthStartMs = BigInt(monthStart.getTime()) * BigInt(1_000_000);

  const getSpent = (category: TransactionCategory): number => {
    if (!transactions) return 0;
    return transactions
      .filter(t =>
        t.transactionType === TransactionType.debit &&
        t.category === category &&
        t.date >= monthStartMs
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const limitEntries = Object.entries(limits) as [TransactionCategory, number][];

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-primary" />
          <h2 className="section-title">Spending Limits</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-full"
        >
          <Settings size={12} />
          Set Limits
        </button>
      </div>

      <div className="space-y-3">
        {limitEntries.map(([category, limit]) => {
          const spent = getSpent(category);
          const percentage = Math.min((spent / limit) * 100, 100);
          const isWarning = percentage >= 80 && percentage < 100;
          const isOver = percentage >= 100;

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{getCategoryEmoji(category)}</span>
                  <span className="text-xs font-medium text-foreground">{getCategoryLabel(category)}</span>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold ${isOver ? 'text-destructive' : isWarning ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                    {formatCurrency(spent)}
                  </span>
                  <span className="text-xs text-muted-foreground"> / {formatCurrency(limit)}</span>
                </div>
              </div>
              <Progress
                value={percentage}
                className={`h-1.5 ${
                  isOver
                    ? '[&>div]:bg-destructive'
                    : isWarning
                    ? '[&>div]:bg-yellow-500'
                    : ''
                }`}
              />
              {isOver && (
                <p className="text-xs text-destructive mt-0.5">⚠️ Limit exceeded!</p>
              )}
              {isWarning && (
                <p className="text-xs text-yellow-600 mt-0.5">⚡ Approaching limit</p>
              )}
            </div>
          );
        })}
      </div>

      <SetLimitsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentLimits={limits}
        onSave={setLimits}
      />
    </div>
  );
}
