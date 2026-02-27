# Specification

## Summary
**Goal:** Add a FinMate Wallet section to the Home and Profile pages with per-user QR codes derived from each user's Internet Identity principal.

**Planned changes:**
- Add a FinMate Wallet card to the Home page showing wallet balance, wallet ID, and Send/Receive quick-action buttons
- Add a FinMate Wallet card to the Profile page showing wallet ID, balance, and a "Show QR Code" button
- Create a `WalletQRModal` component that generates a unique QR code client-side (using qrcode.react) based on the user's principal, accessible from both Home and Profile wallet sections
- Add a `walletBalance` field (Nat, default 0) to the `UserProfile` type in the backend
- Update `useQueries.ts` to expose `walletBalance` from the profile query hook

**User-visible outcome:** Users see their FinMate Wallet with balance and wallet ID on both the Home and Profile pages, and can open a modal showing their unique personal QR code (based on their Internet Identity principal) for receiving money.
