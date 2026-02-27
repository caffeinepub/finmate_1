import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    principal: Principal;
    displayName: string;
    digiPointsReward: bigint;
}
export interface BankAccount {
    id: string;
    balance: number;
    userId: string;
    createdAt: Time;
    bankName: string;
    accountType: string;
    accountNumber: string;
}
export type Time = bigint;
export interface Feedback {
    id: bigint;
    submittedBy: Principal;
    message: string;
    timestamp: Time;
    rating: bigint;
}
export interface Transaction {
    id: string;
    merchantName: string;
    transactionType: TransactionType;
    bankAccountId: string;
    userId: string;
    date: Time;
    createdAt: Time;
    category: TransactionCategory;
    amount: number;
}
export interface Challenge {
    id: string;
    durationDays: bigint;
    title: string;
    description: string;
    targetAmount: number;
    digiPointsReward: bigint;
    category: TransactionCategory;
}
export interface UserProfile {
    referralCode: string;
    colorMode: ColorMode;
    displayName: string;
    name: string;
    createdAt: Time;
    isAnonymous: boolean;
    email: string;
    avatarUrl: string;
    digiPointsReward: bigint;
    walletBalance: bigint;
}
export interface SupportTicket {
    id: bigint;
    subject: string;
    description: string;
    timestamp: Time;
    raisedBy: Principal;
}
export enum ColorMode {
    dark = "dark",
    light = "light"
}
export enum TransactionCategory {
    transportation = "transportation",
    clothing = "clothing",
    other = "other",
    entertainment = "entertainment",
    food = "food",
    travel = "travel",
    utilities = "utilities",
    groceries = "groceries",
    shopping = "shopping",
    college = "college",
    health = "health"
}
export enum TransactionType {
    credit = "credit",
    debit = "debit"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBankAccount(account: BankAccount): Promise<void>;
    addChallenge(challenge: Challenge): Promise<void>;
    addTransaction(transaction: Transaction): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkBalance(arg0: string): Promise<number>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllSupportTickets(): Promise<Array<SupportTicket>>;
    getBankAccounts(): Promise<Array<BankAccount>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChallenges(): Promise<Array<Challenge>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getLeaderboardEntry(user: Principal): Promise<{
        displayName: string;
        digiPointsReward: bigint;
    } | null>;
    getTransactions(): Promise<Array<Transaction>>;
    getTransactionsByCategory(category: TransactionCategory): Promise<Array<Transaction>>;
    getTransactionsByDateRange(startDate: Time, endDate: Time): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeBankAccount(accountId: string): Promise<void>;
    removeChallenge(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedDemoData(): Promise<void>;
    sendMoney(arg0: bigint): Promise<void>;
    submitFeedback(rating: bigint, message: string): Promise<void>;
    submitSupportTicket(subject: string, description: string): Promise<void>;
    updateBalance(accountId: string, newBalance: number): Promise<void>;
    updateLeaderboardPreferences(displayName: string, isAnonymous: boolean): Promise<void>;
}
