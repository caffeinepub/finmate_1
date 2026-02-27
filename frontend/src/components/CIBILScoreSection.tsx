import React, { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const MOCK_SCORE = 742;
const MAX_SCORE = 900;

const IMPROVEMENT_TIPS = [
  { tip: 'Pay all EMIs and credit card bills on time', impact: 'High', icon: CheckCircle },
  { tip: 'Keep credit utilization below 30%', impact: 'High', icon: CheckCircle },
  { tip: 'Avoid applying for multiple loans simultaneously', impact: 'Medium', icon: AlertCircle },
  { tip: 'Maintain a healthy mix of secured and unsecured credit', impact: 'Medium', icon: AlertCircle },
  { tip: 'Check your credit report regularly for errors', impact: 'Low', icon: Info },
  { tip: 'Keep old credit accounts active to maintain credit history', impact: 'Low', icon: Info },
];

function getScoreLabel(score: number) {
  if (score >= 800) return { label: 'Excellent', color: 'text-success' };
  if (score >= 750) return { label: 'Very Good', color: 'text-emerald-500' };
  if (score >= 700) return { label: 'Good', color: 'text-primary' };
  if (score >= 650) return { label: 'Fair', color: 'text-amber-500' };
  return { label: 'Poor', color: 'text-destructive' };
}

export default function CIBILScoreSection() {
  const [expanded, setExpanded] = useState(false);
  const { label, color } = getScoreLabel(MOCK_SCORE);
  const percentage = Math.round((MOCK_SCORE / MAX_SCORE) * 100);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <span className="font-medium">Check CIBIL Score</span>
            <p className="text-xs text-muted-foreground">Simulated soft check • No credit impact</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border space-y-4 pt-4">
          {/* Score Display */}
          <div className="text-center space-y-3">
            <img
              src="/assets/generated/cibil-score-gauge.dim_400x200.png"
              alt="CIBIL Score Gauge"
              className="w-full max-w-xs mx-auto rounded-lg"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <div>
              <p className="text-5xl font-bold text-foreground">{MOCK_SCORE}</p>
              <p className={`text-lg font-semibold mt-1 ${color}`}>{label}</p>
              <p className="text-sm text-muted-foreground">out of {MAX_SCORE}</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>300</span>
                <span>Score Range</span>
                <span>900</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'Payment History', value: '95%', color: 'text-success' },
              { label: 'Credit Utilization', value: '28%', color: 'text-primary' },
              { label: 'Credit Age', value: '4 yrs', color: 'text-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="bg-muted rounded-lg p-2">
                <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Improvement Tips */}
          <div>
            <p className="font-medium text-sm mb-2">Improvement Tips</p>
            <div className="space-y-2">
              {IMPROVEMENT_TIPS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      item.impact === 'High' ? 'text-success' :
                      item.impact === 'Medium' ? 'text-amber-500' : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{item.tip}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs flex-shrink-0 ${
                        item.impact === 'High' ? 'border-success text-success' :
                        item.impact === 'Medium' ? 'border-amber-500 text-amber-500' : ''
                      }`}
                    >
                      {item.impact}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              ⚠️ This is a simulated CIBIL score for demonstration purposes only. It does not reflect your actual credit score and has no impact on your real credit history.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
