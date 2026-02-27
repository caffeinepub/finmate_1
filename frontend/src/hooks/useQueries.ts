import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BankAccount, Transaction, UserProfile } from '../backend';
import { TransactionCategory, ColorMode } from '../backend';

// ── Profile ──────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Bank Accounts ─────────────────────────────────────────────────────────────

export function useGetBankAccounts() {
  const { actor, isFetching } = useActor();

  return useQuery<BankAccount[]>({
    queryKey: ['bankAccounts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBankAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBankAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (account: BankAccount) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBankAccount(account);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
}

export function useRemoveBankAccount() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeBankAccount(accountId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
}

export function useUpdateBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accountId, newBalance }: { accountId: string; newBalance: number }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBalance(accountId, newBalance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
    },
  });
}

// ── Transactions ──────────────────────────────────────────────────────────────

export function useGetTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTransactionsByCategory(category: TransactionCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions', 'category', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getTransactionsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useGetTransactionsByDateRange(startDate: bigint | null, endDate: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['transactions', 'dateRange', startDate?.toString(), endDate?.toString()],
    queryFn: async () => {
      if (!actor || !startDate || !endDate) return [];
      return actor.getTransactionsByDateRange(startDate, endDate);
    },
    enabled: !!actor && !isFetching && !!startDate && !!endDate,
  });
}

export function useAddTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: Transaction) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}

// ── Challenges ────────────────────────────────────────────────────────────────

export function useGetChallenges() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChallenges();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Feedback ──────────────────────────────────────────────────────────────────

export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rating, message }: { rating: bigint; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitFeedback(rating, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allFeedback'] });
    },
  });
}

export function useGetAllFeedback() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();

  return useQuery({
    queryKey: ['allFeedback'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFeedback();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });
}

// ── Support Tickets ───────────────────────────────────────────────────────────

export function useSubmitSupportTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject, description }: { subject: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitSupportTicket(subject, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSupportTickets'] });
    },
  });
}

export function useGetAllSupportTickets() {
  const { actor, isFetching } = useActor();
  const { data: isAdmin } = useIsCallerAdmin();

  return useQuery({
    queryKey: ['allSupportTickets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSupportTickets();
    },
    enabled: !!actor && !isFetching && !!isAdmin,
  });
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export function useUpdateLeaderboardPreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ displayName, isAnonymous }: { displayName: string; isAnonymous: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLeaderboardPreferences(displayName, isAnonymous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ── Balance ───────────────────────────────────────────────────────────────────

export function useCheckBalance() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (pin: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkBalance(pin);
    },
  });
}

// ── Seed Demo Data ────────────────────────────────────────────────────────────

export function useSeedDemoData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.seedDemoData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['bankAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getDateRangeForPeriod(period: 'weekly' | 'monthly' | 'yearly'): { start: bigint; end: bigint } {
  const now = new Date();
  const end = BigInt(now.getTime()) * BigInt(1_000_000);
  let start: Date;

  if (period === 'weekly') {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === 'monthly') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(now.getFullYear(), 0, 1);
  }

  return {
    start: BigInt(start.getTime()) * BigInt(1_000_000),
    end,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getCategoryLabel(category: TransactionCategory): string {
  const labels: Record<TransactionCategory, string> = {
    [TransactionCategory.food]: 'Food',
    [TransactionCategory.clothing]: 'Clothing',
    [TransactionCategory.college]: 'College',
    [TransactionCategory.travel]: 'Travel',
    [TransactionCategory.entertainment]: 'Entertainment',
    [TransactionCategory.utilities]: 'Utilities',
    [TransactionCategory.shopping]: 'Shopping',
    [TransactionCategory.groceries]: 'Groceries',
    [TransactionCategory.health]: 'Health',
    [TransactionCategory.transportation]: 'Transportation',
    [TransactionCategory.other]: 'Other',
  };
  return labels[category] || 'Other';
}

export function getCategoryEmoji(category: TransactionCategory): string {
  const emojis: Record<TransactionCategory, string> = {
    [TransactionCategory.food]: '🍔',
    [TransactionCategory.clothing]: '👕',
    [TransactionCategory.college]: '🎓',
    [TransactionCategory.travel]: '✈️',
    [TransactionCategory.entertainment]: '🎬',
    [TransactionCategory.utilities]: '💡',
    [TransactionCategory.shopping]: '🛍️',
    [TransactionCategory.groceries]: '🛒',
    [TransactionCategory.health]: '🏥',
    [TransactionCategory.transportation]: '🚗',
    [TransactionCategory.other]: '📦',
  };
  return emojis[category] || '📦';
}

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  [TransactionCategory.food]: '#7C3AED',
  [TransactionCategory.clothing]: '#3B82F6',
  [TransactionCategory.college]: '#06B6D4',
  [TransactionCategory.travel]: '#10B981',
  [TransactionCategory.entertainment]: '#F59E0B',
  [TransactionCategory.utilities]: '#EF4444',
  [TransactionCategory.shopping]: '#EC4899',
  [TransactionCategory.groceries]: '#84CC16',
  [TransactionCategory.health]: '#14B8A6',
  [TransactionCategory.transportation]: '#F97316',
  [TransactionCategory.other]: '#6B7280',
};

export { ColorMode };
