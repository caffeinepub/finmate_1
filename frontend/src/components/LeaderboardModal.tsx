import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trophy, Medal, Star } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Arjun S.', points: 2450, badge: '🥇' },
  { rank: 2, name: 'Priya M.', points: 2100, badge: '🥈' },
  { rank: 3, name: 'Rahul K.', points: 1850, badge: '🥉' },
  { rank: 4, name: 'Sneha P.', points: 1600, badge: '⭐' },
  { rank: 5, name: 'Vikram R.', points: 1400, badge: '⭐' },
];

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const { data: profile } = useGetCallerUserProfile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto rounded-3xl">
        <DialogHeader>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy size={22} className="text-primary" />
            <DialogTitle className="font-display text-xl">DigiPoints Leaderboard</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {MOCK_LEADERBOARD.map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                entry.rank === 1
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20'
                  : 'bg-secondary/50'
              }`}
            >
              <span className="text-xl w-8 text-center">{entry.badge}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{entry.name}</p>
                <p className="text-xs text-muted-foreground">Rank #{entry.rank}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-primary fill-primary" />
                <span className="text-sm font-bold text-primary">{entry.points.toLocaleString()}</span>
              </div>
            </div>
          ))}

          {/* Current user */}
          {profile && (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Medal size={20} className="text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{profile.name} (You)</p>
                  <p className="text-xs text-muted-foreground">Your position</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-primary fill-primary" />
                  <span className="text-sm font-bold text-primary">{Number(profile.digiPointsReward).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
