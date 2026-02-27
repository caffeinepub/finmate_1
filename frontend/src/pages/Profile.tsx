import { useState } from 'react';
import { User, Building2, CreditCard, Gift, LogOut, Moon, Sun, ChevronRight, Copy, Star, Shield, Trash2, QrCode, Wallet } from 'lucide-react';
import {
  useGetCallerUserProfile,
  useGetBankAccounts,
  useSaveCallerUserProfile,
  useRemoveBankAccount,
  useUpdateLeaderboardPreferences,
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { ColorMode } from '../backend';
import { useTheme } from 'next-themes';
import AddBankAccountModal from '../components/AddBankAccountModal';
import SecuritySettingsModal from '../components/SecuritySettingsModal';
import GetHelpSection from '../components/GetHelpSection';
import LanguageSelectionSection from '../components/LanguageSelectionSection';
import RewardsSection from '../components/RewardsSection';
import CIBILScoreSection from '../components/CIBILScoreSection';
import WalletQRModal from '../components/WalletQRModal';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BalanceCard from '../components/BalanceCard';

interface ProfileProps {
  onLock: () => void;
}

export default function Profile({ onLock }: ProfileProps) {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showWalletQR, setShowWalletQR] = useState(false);

  // Leaderboard preferences state
  const [displayName, setDisplayName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [leaderboardSaved, setLeaderboardSaved] = useState(false);

  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: accounts, isLoading: accountsLoading } = useGetBankAccounts();
  const { mutateAsync: saveProfile } = useSaveCallerUserProfile();
  const { mutateAsync: removeAccount } = useRemoveBankAccount();
  const { mutateAsync: updateLeaderboardPrefs, isPending: savingLeaderboard } = useUpdateLeaderboardPreferences();
  const { clear: logout, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';
  const walletId = identity?.getPrincipal().toString() ?? '';

  // Sync leaderboard fields from profile when loaded
  const [leaderboardInitialized, setLeaderboardInitialized] = useState(false);
  if (profile && !leaderboardInitialized) {
    setDisplayName(profile.displayName || profile.name || '');
    setIsAnonymous(profile.isAnonymous || false);
    setLeaderboardInitialized(true);
  }

  const handleThemeToggle = async (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    if (profile) {
      try {
        await saveProfile({
          ...profile,
          colorMode: checked ? ColorMode.dark : ColorMode.light,
        });
      } catch {
        // Theme still applied locally
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
  };

  const handleCopyReferral = () => {
    if (profile?.referralCode) {
      navigator.clipboard.writeText(profile.referralCode);
      toast.success('Referral code copied!');
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      await removeAccount(accountId);
      toast.success('Account removed');
    } catch {
      toast.error('Failed to remove account');
    }
  };

  const handleSaveLeaderboardPrefs = async () => {
    try {
      await updateLeaderboardPrefs({ displayName, isAnonymous });
      setLeaderboardSaved(true);
      setTimeout(() => setLeaderboardSaved(false), 3000);
      toast.success('Leaderboard preferences saved!');
    } catch {
      toast.error('Failed to save preferences');
    }
  };

  const formattedWalletBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(profile?.walletBalance ?? 0n));

  const shortWalletId = walletId.length > 20
    ? walletId.slice(0, 10) + '...' + walletId.slice(-8)
    : walletId;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6"
        style={{ background: 'linear-gradient(180deg, oklch(0.52 0.22 280 / 0.12) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <User size={22} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Profile Card */}
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white border-2 border-white/30">
              {profileLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                profile?.name?.charAt(0)?.toUpperCase() ?? 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              {profileLoading ? (
                <>
                  <Skeleton className="h-5 w-32 bg-white/20 mb-1" />
                  <Skeleton className="h-4 w-40 bg-white/20" />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white truncate">
                    {profile?.name ?? 'User'}
                  </h2>
                  <p className="text-white/70 text-sm truncate">
                    {profile?.email || identity?.getPrincipal().toString().slice(0, 20) + '...'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* DigiPoints */}
          <div className="mt-4 flex items-center justify-between bg-white/15 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-300 fill-yellow-300" />
              <span className="text-white/90 text-sm font-medium">DigiPoints</span>
            </div>
            <span className="text-white font-bold text-lg">
              {Number(profile?.digiPointsReward ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 pb-6">
        {/* Balance Card (PIN-protected) */}
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <h3 className="font-semibold text-foreground text-sm mb-3">Account Balance</h3>
          <BalanceCard />
          <p className="text-xs text-muted-foreground mt-2">
            Across {accounts?.length ?? 0} account{(accounts?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        {/* FinMate Wallet Section */}
        {walletId && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08))', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
                >
                  <Wallet size={15} className="text-white" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">FinMate Wallet</h3>
              </div>

              {/* Wallet Info Row */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Wallet Balance</p>
                  <p className="text-xl font-bold text-foreground">{formattedWalletBalance}</p>
                </div>
                <button
                  onClick={() => setShowWalletQR(true)}
                  className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl transition-colors"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}
                >
                  <QrCode size={18} className="text-white" />
                  <span className="text-white text-xs font-semibold">My QR</span>
                </button>
              </div>

              {/* Wallet ID */}
              <div className="flex items-center gap-2 bg-card rounded-xl px-3 py-2.5 border border-border/50">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Wallet ID</p>
                  <p className="font-mono text-xs text-foreground truncate">{shortWalletId}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(walletId);
                    toast.success('Wallet ID copied!');
                  }}
                  className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                >
                  <Copy size={13} className="text-primary" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Accounts */}
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Bank Accounts</h3>
            </div>
            <button
              onClick={() => setShowAddAccount(true)}
              className="text-xs text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              + Add
            </button>
          </div>

          {accountsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          ) : accounts && accounts.length > 0 ? (
            <div className="space-y-2">
              {accounts.map(acc => (
                <div key={acc.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{acc.bankName}</p>
                    <p className="text-xs text-muted-foreground">{acc.accountNumber} • {acc.accountType}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveAccount(acc.id)}
                    className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={14} className="text-destructive" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">No bank accounts linked</p>
              <button
                onClick={() => setShowAddAccount(true)}
                className="text-primary text-sm font-medium mt-1 hover:underline"
              >
                Add your first account
              </button>
            </div>
          )}
        </div>

        {/* Cards Section */}
        <div className="bg-card border border-border/50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Cards</h3>
            </div>
            <button
              onClick={() => toast.info('Card management coming soon!')}
              className="text-xs text-primary font-medium bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
            >
              + Add Card
            </button>
          </div>
          <div className="text-center py-4">
            <CreditCard size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No cards linked yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Add credit or debit cards</p>
          </div>
        </div>

        {/* Refer & Earn */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.1))' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Gift size={16} className="text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Refer & Earn DigiPoints</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Share your referral code and earn 100 DigiPoints for each friend who joins!
          </p>
          {profile?.referralCode && (
            <div className="flex items-center gap-2 bg-card rounded-xl px-4 py-3 border border-primary/20">
              <span className="flex-1 font-mono font-bold text-primary text-sm tracking-wider">
                {profile.referralCode}
              </span>
              <button
                onClick={handleCopyReferral}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary/80 transition-colors"
              >
                <Copy size={14} />
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Leaderboard Preferences */}
        <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Leaderboard Preferences</h3>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Display Name on Leaderboard</label>
            <Input
              placeholder="Enter display name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Anonymous Mode</p>
              <p className="text-xs text-muted-foreground">Hide your name on the leaderboard</p>
            </div>
            <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          </div>
          <Button
            onClick={handleSaveLeaderboardPrefs}
            disabled={savingLeaderboard}
            size="sm"
            className="w-full"
          >
            {savingLeaderboard ? 'Saving...' : leaderboardSaved ? '✓ Saved!' : 'Save Preferences'}
          </Button>
        </div>

        {/* Settings */}
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">{isDark ? 'Dark theme active' : 'Light theme active'}</p>
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={handleThemeToggle} />
          </div>

          {/* Security */}
          <button
            onClick={() => setShowSecurityModal(true)}
            className="w-full flex items-center justify-between px-4 py-4 border-b border-border/50 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Security</p>
                <p className="text-xs text-muted-foreground">PIN & biometric settings</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-destructive/5 transition-colors"
          >
            <LogOut size={18} className="text-destructive" />
            <span className="text-sm font-medium text-destructive">Log Out</span>
          </button>
        </div>

        {/* Collapsible Sections */}
        <GetHelpSection />
        <LanguageSelectionSection />
        <RewardsSection />
        <CIBILScoreSection />
      </div>

      {/* Modals */}
      <AddBankAccountModal isOpen={showAddAccount} onClose={() => setShowAddAccount(false)} />
      <SecuritySettingsModal
        open={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
      />
      {walletId && (
        <WalletQRModal
          isOpen={showWalletQR}
          onClose={() => setShowWalletQR(false)}
          walletId={walletId}
          userName={profile?.name}
        />
      )}
    </div>
  );
}
