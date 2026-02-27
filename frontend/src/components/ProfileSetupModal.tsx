import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { ColorMode } from '../backend';
import { User } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function generateReferralCode(): string {
  return 'FM' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ProfileSetupModal({ isOpen, onClose }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await saveProfile({
        name: name.trim(),
        email: email.trim(),
        avatarUrl: '',
        createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        referralCode: generateReferralCode(),
        digiPointsReward: BigInt(0),
        colorMode: ColorMode.light,
        displayName: name.trim(),
        isAnonymous: false,
        walletBalance: BigInt(0),
      });
      toast.success('Profile created successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm mx-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full finmate-gradient flex items-center justify-center mx-auto mb-2">
            <User size={24} className="text-white" />
          </div>
          <DialogTitle className="text-center text-xl font-display">Welcome to FinMate!</DialogTitle>
          <DialogDescription className="text-center">
            Let's set up your profile to get started.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim() || isPending}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Get Started'
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
