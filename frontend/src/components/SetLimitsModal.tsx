import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionCategory } from '../backend';
import { getCategoryLabel, getCategoryEmoji } from '../hooks/useQueries';
import { SpendingLimits } from './SpendingLimitsCard';

interface SetLimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLimits: SpendingLimits;
  onSave: (limits: SpendingLimits) => void;
}

const CATEGORIES = [
  TransactionCategory.food,
  TransactionCategory.clothing,
  TransactionCategory.college,
  TransactionCategory.travel,
  TransactionCategory.entertainment,
  TransactionCategory.utilities,
  TransactionCategory.shopping,
  TransactionCategory.groceries,
  TransactionCategory.health,
  TransactionCategory.transportation,
];

export default function SetLimitsModal({ isOpen, onClose, currentLimits, onSave }: SetLimitsModalProps) {
  const [limits, setLimits] = useState<SpendingLimits>(currentLimits);

  const handleSave = () => {
    onSave(limits);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Set Monthly Limits</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {CATEGORIES.map(category => (
            <div key={category} className="flex items-center gap-3">
              <span className="text-xl w-8 text-center">{getCategoryEmoji(category)}</span>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{getCategoryLabel(category)}</Label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={limits[category] ?? ''}
                  onChange={e => {
                    const val = e.target.value ? Number(e.target.value) : undefined;
                    setLimits(prev => ({ ...prev, [category]: val }));
                  }}
                  className="rounded-xl h-9 mt-0.5"
                  min="0"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border/50 bg-card text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1 text-sm py-3"
          >
            Save Limits
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
