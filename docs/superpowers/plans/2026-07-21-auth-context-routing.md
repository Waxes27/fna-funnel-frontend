# Auth Context Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route authenticated users according to the Auth Context Management rules by combining `/auth/me` identity data with client-profile existence checks.

**Architecture:** Keep Keycloak token exchange and `/auth/me` merging in the auth service, then extend that same auth resolution flow to optionally fetch the client profile for `CLIENT` users. Store the resolved profile-driven routing state in Zustand so both fresh login and cold-start bootstrap send users to onboarding or the main app consistently.

**Tech Stack:** Expo, React Native, Zustand, generated Swagger client, Jest, Testing Library

---

## File Structure

**Modify**
- `src/services/authService.ts` - Centralize authenticated session resolution and client-profile lookup rules.
- `src/services/authBootstrap.ts` - Reuse the centralized auth resolution during cold-start session restore.
- `src/store/appStore.ts` - Store profile-aware authenticated state and onboarding routing flags.
- `src/screens/LoginScreen.tsx` - Apply the resolved auth state after Keycloak login and session persistence.
- `src/navigation/RootNavigator.tsx` - Apply the resolved auth state after bootstrap.
- `src/services/__tests__/authService.test.ts` - Cover merged auth identity and client-profile resolution.
- `src/services/__tests__/authBootstrap.test.ts` - Cover bootstrap outcomes for clients with and without profiles.
- `src/store/__tests__/appStore.test.ts` - Cover profile-aware onboarding decisions.
- `src/navigation/__tests__/RootNavigator.test.tsx` - Cover the updated bootstrap payload shape.
- `src/screens/__tests__/LoginScreen.test.tsx` - Cover the updated resolved login payload shape.

**Keep As-Is**
- `src/services/authSessionStore.ts` - Persist only the minimal session fields already approved.
- `src/services/authUser.ts` - Continue normalizing backend roles before store usage.

---

### Task 1: Centralize Auth Resolution

**Files:**
- Modify: `src/services/authService.ts`
- Test: `src/services/__tests__/authService.test.ts`

- [ ] Add a shared resolved-auth-session type that includes `user`, optional `profile`, and `isOnboardingComplete`.
- [ ] Merge the Keycloak token user with `/auth/me`, then fetch the client profile only when the normalized role is `CLIENT`.
- [ ] Treat profile `404` as “missing profile” and mark onboarding incomplete; rethrow all other profile failures.
- [ ] Update auth service tests for `CLIENT` users with a profile, `CLIENT` users without a profile, and non-client users.

### Task 2: Reuse Resolution During Bootstrap

**Files:**
- Modify: `src/services/authBootstrap.ts`
- Modify: `src/navigation/RootNavigator.tsx`
- Test: `src/services/__tests__/authBootstrap.test.ts`
- Test: `src/navigation/__tests__/RootNavigator.test.tsx`

- [ ] Reuse the centralized auth resolution after restoring the persisted token.
- [ ] Return the resolved bootstrap payload and apply it in the root navigator.
- [ ] Keep anonymous fallback behavior for missing tokens and `401` responses from `/auth/me`.
- [ ] Update bootstrap and root navigation tests for the new resolved payload shape.

### Task 3: Store Profile-Aware Routing State

**Files:**
- Modify: `src/store/appStore.ts`
- Test: `src/store/__tests__/appStore.test.ts`

- [ ] Extend authenticated store actions to accept optional resolved profile state.
- [ ] Mark `CLIENT` users with a resolved profile as onboarding complete.
- [ ] Mark `CLIENT` users without a profile as onboarding incomplete and start them at `welcome`.
- [ ] Keep non-client users routed directly to the main app.

### Task 4: Update Fresh Login Flow

**Files:**
- Modify: `src/screens/LoginScreen.tsx`
- Test: `src/screens/__tests__/LoginScreen.test.tsx`

- [ ] Save the minimal persisted auth session using the resolved authenticated user.
- [ ] Apply the resolved auth payload to the store after Keycloak login succeeds.
- [ ] Update login-screen tests to assert ordering and resolved payload usage.

### Task 5: Validate

**Files:**
- Modify: `src/services/authService.ts`
- Modify: `src/services/authBootstrap.ts`
- Modify: `src/store/appStore.ts`
- Modify: `src/navigation/RootNavigator.tsx`
- Modify: `src/screens/LoginScreen.tsx`

- [ ] Run focused Jest suites for auth service, bootstrap, store, root navigation, and login.
- [ ] Run diagnostics for the edited files and fix any introduced TypeScript or lint errors.
