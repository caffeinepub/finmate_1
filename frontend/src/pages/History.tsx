import { useState, useMemo } from 'react';
import { Clock, Filter, Search } from 'lucide-react';
import { useGetTransactions } from '../hooks/useQueries';
import { TransactionCategory, TransactionType } from '../backend';
import TransactionCard from '../components/TransactionCard';
import { getCategoryLabel, getCategoryEmoji, getDateRangeForPeriod } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

type TimePeriod = 'all' | 'weekly' | 'monthly' | 'yearly';

const CATEGORIES: { value: TransactionCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '📋' },
  { value: TransactionCategory.food, label: 'Food', emoji: '🍔' },
  { value: TransactionCategory.clothing, label: 'Clothing', emoji: '👕' },
  { value: TransactionCategory.college, label: 'College', emoji: '🎓' },
  { value: TransactionCategory.travel, label: 'Travel', emoji: '✈️' },
  { value: TransactionCategory.entertainment, label: 'Entertainment', emoji: '🎬' },
  { value: TransactionCategory.utilities, label: 'Utilities', emoji: '💡' },
  { value: TransactionCategory.shopping, label: 'Shopping', emoji: '🛍️' },
  { value: TransactionCategory.groceries, label: 'Groceries', emoji: '🛒' },
  { value: TransactionCategory.health, label: 'Health', emoji: '🏥' },
  { value: TransactionCategory.transportation, label: 'Transport', emoji: '🚗' },
  { value: TransactionCategory.other, label: 'Other', emoji: '📦' },
];

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'yearly', label: 'This Year' },
];

export default function History() {
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | 'all'>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'debit' | 'credit'>('all');

  const { data: transactions, isLoading } = useGetTransactions();

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let result = [...transactions];

    // Time period filter
    if (selectedPeriod !== 'all') {
      const { start, end } = getDateRangeForPeriod(selectedPeriod);
      result = result.filter(t => t.date >= start && t.date <= end);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    // Type filter
    if (typeFilter === 'debit') {
      result = result.filter(t => t.transactionType === TransactionType.debit);
    } else if (typeFilter === 'credit') {
      result = result.filter(t => t.transactionType === TransactionType.credit);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.merchantName.toLowerCase().includes(q) ||
        getCategoryLabel(t.category).toLowerCase().includes(q)
      );
    }

    return result;
  }, [transactions, selectedCategory, selectedPeriod, typeFilter, searchQuery]);

  const totalDebit = filteredTransactions
    .filter(t => t.transactionType === TransactionType.debit)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCredit = filteredTransactions
    .filter(t => t.transactionType === TransactionType.credit)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-4"
        style={{ background: 'linear-gradient(180deg, oklch(0.52 0.22 280 / 0.08) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock size={22} className="text-primary" />
          <h1 className="text-2xl font-display font-bold text-foreground">Transaction History</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 rounded-xl bg-card border-border/50"
          />
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Time Period Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TIME_PERIODS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedPeriod(value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedPeriod === value
                  ? 'text-white shadow-sm'
                  : 'bg-card border border-border/50 text-muted-foreground hover:border-primary/30'
              }`}
              style={selectedPeriod === value ? { background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          {(['all', 'debit', 'credit'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                typeFilter === type
                  ? type === 'debit'
                    ? 'bg-destructive/10 border-destructive/30 text-destructive'
                    : type === 'credit'
                    ? 'bg-green-500/10 border-green-500/30 text-green-600'
                    : 'border-primary/30 text-primary bg-primary/10'
                  : 'bg-card border-border/50 text-muted-foreground'
              }`}
            >
              {type === 'all' ? 'All' : type === 'debit' ? '↑ Debit' : '↓ Credit'}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(({ value, label, emoji }) => (
            <button
              key={value}
              onClick={() => setSelectedCategory(value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedCategory === value
                  ? 'text-white shadow-sm'
                  : 'bg-card border border-border/50 text-muted-foreground hover:border-primary/30'
              }`}
              style={selectedCategory === value ? { background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' } : {}}
            >
              <span>{emoji}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Summary */}
        {filteredTransactions.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Total Debited</p>
              <p className="text-sm font-bold text-destructive mt-0.5">
                -₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Total Credited</p>
              <p className="text-sm font-bold text-green-600 mt-0.5">
                +₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}

        {/* Transaction List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter size={28} className="text-muted-foreground" />
            </div>
            <p className="text-foreground font-semibold">No transactions found</p>
            <p className="text-muted-foreground text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'Try changing your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            <p className="text-xs text-muted-foreground font-medium">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
            {filteredTransactions.map(transaction => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
