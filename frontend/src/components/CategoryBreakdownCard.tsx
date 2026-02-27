import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CategoryBreakdownCardProps {
  name: string;
  icon: string;
  amount: number;
  percentage: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  color: string;
}

export default function CategoryBreakdownCard({
  name,
  icon,
  amount,
  percentage,
  change,
  trend,
  color,
}: CategoryBreakdownCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{name}</p>
          <p className="font-semibold text-sm">₹{amount.toLocaleString()}</p>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total</p>
          <div className={`flex items-center gap-0.5 text-xs ${
            trend === 'up' ? 'text-destructive' :
            trend === 'down' ? 'text-success' : 'text-muted-foreground'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
             trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
