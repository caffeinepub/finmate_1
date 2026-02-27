import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction, TransactionType } from '../backend';
import { formatCurrency, formatDate, formatTime, getCategoryLabel, getCategoryEmoji } from '../hooks/useQueries';

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const isDebit = transaction.transactionType === TransactionType.debit;

  return (
    <div className="transaction-card">
      {/* Category Icon */}
      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-xl">
        {getCategoryEmoji(transaction.category)}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{transaction.merchantName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{getCategoryLabel(transaction.category)}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatDate(transaction.date)}</span>
          <span className="text-xs text-muted-foreground">{formatTime(transaction.date)}</span>
        </div>
      </div>

      {/* Amount & Arrow */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className="flex items-center gap-1">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isDebit ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
            {isDebit
              ? <ArrowUpRight size={12} className="text-destructive" />
              : <ArrowDownLeft size={12} className="text-green-500" />
            }
          </div>
          <span className={`text-sm font-bold ${isDebit ? 'text-destructive' : 'text-green-500'}`}>
            {isDebit ? '-' : '+'}{formatCurrency(transaction.amount)}
          </span>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDebit ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}>
          {isDebit ? 'Debit' : 'Credit'}
        </span>
      </div>
    </div>
  );
}
