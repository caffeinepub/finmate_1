# Specification

## Summary
**Goal:** Fix the "Check Balance" quick-action button on the Home page so that it requires PIN or fingerprint authentication before revealing the account balance.

**Planned changes:**
- Update the "Check Balance" quick-action handler on the Home page to open the `PinConfirmationModal` or trigger biometric authentication via the `simulateBiometric` helper from `usePinAuth` before showing the balance.
- Ensure the balance remains hidden if the user cancels or fails authentication.
- Preserve the existing 30-second auto-hide behaviour of `BalanceCard` after successful authentication.
- Show the fingerprint/biometric option alongside the PIN option, consistent with the PinEntry screen pattern.

**User-visible outcome:** Tapping "Check Balance" on the Home page now prompts the user to authenticate via PIN or fingerprint before the balance is revealed, keeping it secure until verified.
