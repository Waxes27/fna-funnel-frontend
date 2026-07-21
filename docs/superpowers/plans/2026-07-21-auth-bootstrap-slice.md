# Auth Bootstrap Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist the authenticated Keycloak session, restore it on cold app launch, validate it against `auth/me`, and route users without login flicker.

**Architecture:** Keep the generated API client as the single HTTP/auth boundary, add a dedicated persisted-session service for token storage, and add a small bootstrap orchestrator that restores the token then confirms the user through `apiClient.api.currentUser()`. Keep render state in Zustand, but do not bury persistence logic inside random screens.

**Tech Stack:** Expo, React Native, Zustand, `expo-auth-session`, `expo-secure-store`, generated Swagger Axios client, Jest, Testing Library

**Implementation Status:** Implemented and automatedly validated. Manual Expo smoke testing and the final commit sequence are still pending.

---

## File Structure

**Create**
- `src/services/authSessionStore.ts` - Secure local persistence for the auth session payload used during bootstrap.
- `src/services/__tests__/authSessionStore.test.ts` - Unit tests for save/load/clear session behavior.
- `src/services/authBootstrap.ts` - Restores persisted session, primes `apiService`, validates with `auth/me`, and clears bad sessions.
- `src/services/__tests__/authBootstrap.test.ts` - Unit tests for valid, missing, and invalid persisted sessions.
- `src/screens/AuthBootstrapScreen.tsx` - Lightweight loading screen shown while auth bootstrap is in flight.

**Modify**
- `package.json` - Add `expo-secure-store`.
- `src/store/appStore.ts` - Add `isAuthBootstrapping` and state transitions for bootstrapped auth.
- `src/store/__tests__/appStore.test.ts` - Cover bootstrap flags and authenticated state application.
- `src/screens/LoginScreen.tsx` - Persist the session after successful Keycloak exchange, before entering the app.
- `src/navigation/RootNavigator.tsx` - Trigger bootstrap once and render a bootstrap screen while deciding routes.
- `src/navigation/__tests__/RootNavigator.test.tsx` - Cover bootstrapping route state.

**Keep As-Is**
- `src/services/keycloakAuth.ts` - Already maps the Keycloak token response into the app user shape.
- `src/services/apiService.ts` - Already sets bearer auth on the generated client and exposes the API instance used by bootstrap.

---

### Task 1: Add Persisted Auth Session Storage

**Files:**
- Modify: `package.json`
- Create: `src/services/authSessionStore.ts`
- Test: `src/services/__tests__/authSessionStore.test.ts`

- [x] **Step 1: Write the failing storage test**

```ts
import * as SecureStore from 'expo-secure-store';

import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
  savePersistedAuthSession,
} from '../authSessionStore';

jest.mock('expo-secure-store', () => ({
  deleteItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe('authSessionStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves and loads the persisted auth session', async () => {
    const session = {
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token: 'access-token',
      type: 'Bearer',
    };

    mockSecureStore.getItemAsync.mockResolvedValueOnce(JSON.stringify(session));

    await savePersistedAuthSession(session);

    expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
      'auth.session',
      JSON.stringify(session),
    );

    await expect(loadPersistedAuthSession()).resolves.toEqual(session);
  });

  it('returns null when no session is stored', async () => {
    mockSecureStore.getItemAsync.mockResolvedValueOnce(null);

    await expect(loadPersistedAuthSession()).resolves.toBeNull();
  });

  it('clears the persisted auth session', async () => {
    await clearPersistedAuthSession();

    expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth.session');
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest src/services/__tests__/authSessionStore.test.ts --runInBand`
Expected: FAIL with `Cannot find module '../authSessionStore'` or `expo-secure-store` not installed.

- [x] **Step 3: Install the secure storage dependency**

Run: `npx expo install expo-secure-store`
Expected: dependency added to `package.json` and lockfile updated.

- [x] **Step 4: Write the minimal persistence implementation**

```ts
import * as SecureStore from 'expo-secure-store';

import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';

const AUTH_SESSION_KEY = 'auth.session';

export type PersistedAuthSession = Pick<
  JwtResponse,
  'email' | 'id' | 'role' | 'token' | 'type'
>;

export const savePersistedAuthSession = async (
  session: PersistedAuthSession,
) => {
  await SecureStore.setItemAsync(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const loadPersistedAuthSession = async (): Promise<PersistedAuthSession | null> => {
  const value = await SecureStore.getItemAsync(AUTH_SESSION_KEY);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as PersistedAuthSession;
};

export const clearPersistedAuthSession = async () => {
  await SecureStore.deleteItemAsync(AUTH_SESSION_KEY);
};
```

- [x] **Step 5: Run test to verify it passes**

Run: `npx jest src/services/__tests__/authSessionStore.test.ts --runInBand`
Expected: PASS with 3 passing tests.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/services/authSessionStore.ts src/services/__tests__/authSessionStore.test.ts
git commit -m "feat: add persisted auth session storage"
```

### Task 2: Add Server-Validated Auth Bootstrap Service

**Files:**
- Create: `src/services/authBootstrap.ts`
- Test: `src/services/__tests__/authBootstrap.test.ts`
- Modify: `src/services/apiService.ts` (only if a named export is needed for mocking)

- [x] **Step 1: Write the failing bootstrap service test**

```ts
import { apiClient, apiService } from '../apiService';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
} from '../authSessionStore';
import { bootstrapAuthSession } from '../authBootstrap';

jest.mock('../authSessionStore', () => ({
  clearPersistedAuthSession: jest.fn(),
  loadPersistedAuthSession: jest.fn(),
}));

describe('bootstrapAuthSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    apiService.setToken(null);
  });

  it('returns an authenticated user when persisted session is valid', async () => {
    (loadPersistedAuthSession as jest.Mock).mockResolvedValue({
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token: 'persisted-token',
      type: 'Bearer',
    });

    jest.spyOn(apiClient.api, 'currentUser').mockResolvedValue({
      data: {
        email: 'client@example.com',
        id: 'user-1',
        role: 'CLIENT',
      },
    } as any);

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'authenticated',
      user: {
        email: 'client@example.com',
        id: 'user-1',
        role: 'CLIENT',
        token: 'persisted-token',
        type: 'Bearer',
      },
    });
  });

  it('clears persisted auth when auth/me rejects with 401', async () => {
    (loadPersistedAuthSession as jest.Mock).mockResolvedValue({
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token: 'expired-token',
      type: 'Bearer',
    });

    jest.spyOn(apiClient.api, 'currentUser').mockRejectedValue({
      response: { status: 401 },
    });

    await expect(bootstrapAuthSession()).resolves.toEqual({
      status: 'anonymous',
    });

    expect(clearPersistedAuthSession).toHaveBeenCalled();
    expect(apiService.getToken()).toBeNull();
  });
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest src/services/__tests__/authBootstrap.test.ts --runInBand`
Expected: FAIL with `Cannot find module '../authBootstrap'`.

- [x] **Step 3: Write the bootstrap service**

```ts
import { JwtResponse } from '../../clients/fNAPlatformAPIClient/models';
import { apiClient, apiService } from './apiService';
import {
  clearPersistedAuthSession,
  loadPersistedAuthSession,
} from './authSessionStore';

type BootstrapResult =
  | { status: 'anonymous' }
  | { status: 'authenticated'; user: JwtResponse };

export const bootstrapAuthSession = async (): Promise<BootstrapResult> => {
  const persistedSession = await loadPersistedAuthSession();

  if (!persistedSession?.token) {
    apiService.setToken(null);
    return { status: 'anonymous' };
  }

  try {
    apiService.setToken(persistedSession.token);

    const response = await apiClient.api.currentUser();

    return {
      status: 'authenticated',
      user: {
        ...response.data,
        token: persistedSession.token,
        type: persistedSession.type ?? 'Bearer',
      },
    };
  } catch (error: any) {
    if (error?.response?.status === 401) {
      await clearPersistedAuthSession();
      apiService.setToken(null);
      return { status: 'anonymous' };
    }

    throw error;
  }
};
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx jest src/services/__tests__/authBootstrap.test.ts --runInBand`
Expected: PASS with valid-session and expired-session coverage.

- [ ] **Step 5: Commit**

```bash
git add src/services/authBootstrap.ts src/services/__tests__/authBootstrap.test.ts
git commit -m "feat: add auth bootstrap service"
```

### Task 3: Add Bootstrap Flags and Auth State Transitions to the Store

**Files:**
- Modify: `src/store/appStore.ts`
- Test: `src/store/__tests__/appStore.test.ts`

- [x] **Step 1: Write the failing store tests**

```ts
it('starts in auth bootstrapping mode', () => {
  expect(useAppStore.getState().isAuthBootstrapping).toBe(true);
});

it('can finish bootstrap anonymously', () => {
  useAppStore.getState().finishAuthBootstrap();

  expect(useAppStore.getState().isAuthBootstrapping).toBe(false);
  expect(useAppStore.getState().isAuthenticated).toBe(false);
});

it('can apply an authenticated user after bootstrap', () => {
  useAppStore.getState().applyAuthenticatedUser({
    email: 'client@example.com',
    id: 'user-1',
    role: 'CLIENT',
    token: 'persisted-token',
    type: 'Bearer',
  });

  expect(useAppStore.getState().isAuthBootstrapping).toBe(false);
  expect(useAppStore.getState().isAuthenticated).toBe(true);
  expect(apiService.getToken()).toBe('persisted-token');
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest src/store/__tests__/appStore.test.ts --runInBand`
Expected: FAIL because `isAuthBootstrapping`, `finishAuthBootstrap`, or `applyAuthenticatedUser` do not exist.

- [x] **Step 3: Update the store shape and transitions**

```ts
interface AppState {
  isAuthenticated: boolean;
  isAuthBootstrapping: boolean;
  isOnboardingComplete: boolean;
  user: JwtResponse | null;
  login: (user: JwtResponse) => void;
  logout: () => void;
  applyAuthenticatedUser: (user: JwtResponse) => void;
  finishAuthBootstrap: () => void;
}

const applyUserToState = (user: JwtResponse) => {
  const requiresOnboarding = user.role === 'CLIENT';
  apiService.setToken(user.token ?? null);

  return {
    isAuthenticated: true,
    isAuthBootstrapping: false,
    isOnboardingComplete: !requiresOnboarding,
    onboardingStep: requiresOnboarding ? defaultOnboardingStep : 'summary',
    user,
    profile: null,
    profileDraft: createProfileDraftFromProfile(null, user.email ?? ''),
  };
};

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  isAuthBootstrapping: true,
  isOnboardingComplete: false,
  user: null,
  login: (user) => set(() => applyUserToState(user)),
  applyAuthenticatedUser: (user) => set(() => applyUserToState(user)),
  finishAuthBootstrap: () => set({ isAuthBootstrapping: false }),
  logout: () => {
    apiService.setToken(null);
    set({
      isAuthenticated: false,
      isAuthBootstrapping: false,
      isOnboardingComplete: false,
      onboardingStep: defaultOnboardingStep,
      user: null,
      profile: null,
      profileDraft: defaultProfileDraft,
    });
  },
  // keep the rest of the existing onboarding setters unchanged
}));
```

- [x] **Step 4: Run test to verify it passes**

Run: `npx jest src/store/__tests__/appStore.test.ts --runInBand`
Expected: PASS with the new bootstrap state coverage.

- [ ] **Step 5: Commit**

```bash
git add src/store/appStore.ts src/store/__tests__/appStore.test.ts
git commit -m "feat: add auth bootstrap state to app store"
```

### Task 4: Persist Session on Login and Clear It on Logout

**Files:**
- Modify: `src/screens/LoginScreen.tsx`
- Modify: `src/store/appStore.ts`
- Modify: `src/store/__tests__/appStore.test.ts`

- [x] **Step 1: Write the failing persistence integration tests**

```ts
import * as authSessionStore from '../../services/authSessionStore';

jest.mock('../../services/authSessionStore', () => ({
  clearPersistedAuthSession: jest.fn(),
  loadPersistedAuthSession: jest.fn(),
  savePersistedAuthSession: jest.fn(),
}));

it('persists the auth session after successful login', async () => {
  const savePersistedAuthSession = authSessionStore.savePersistedAuthSession as jest.Mock;

  // in the login screen test, assert this is called before navigation state flips
  expect(savePersistedAuthSession).toHaveBeenCalledWith({
    email: 'client@example.com',
    id: 'user-1',
    role: 'CLIENT',
    token: 'access-token',
    type: 'Bearer',
  });
});

it('clears the persisted session on logout', async () => {
  const clearPersistedAuthSession = authSessionStore.clearPersistedAuthSession as jest.Mock;

  useAppStore.getState().logout();

  expect(clearPersistedAuthSession).toHaveBeenCalled();
});
```

- [x] **Step 2: Run the targeted tests to verify they fail**

Run: `npx jest src/store/__tests__/appStore.test.ts --runInBand`
Expected: FAIL because logout does not clear persisted auth yet.

- [x] **Step 3: Persist after login and clear on logout**

```ts
// LoginScreen.tsx
import { savePersistedAuthSession } from '../services/authSessionStore';

const mappedUser = mapKeycloakTokenResponseToUser(tokenResponse);
await savePersistedAuthSession(mappedUser);
login(mappedUser);
```

```ts
// appStore.ts
import { clearPersistedAuthSession } from '../services/authSessionStore';

logout: () => {
  apiService.setToken(null);
  void clearPersistedAuthSession();
  set({
    isAuthenticated: false,
    isAuthBootstrapping: false,
    isOnboardingComplete: false,
    onboardingStep: defaultOnboardingStep,
    user: null,
    profile: null,
    profileDraft: defaultProfileDraft,
  });
},
```

- [x] **Step 4: Run the affected tests**

Run: `npx jest src/store/__tests__/appStore.test.ts --runInBand`
Expected: PASS with logout persistence coverage.

- [ ] **Step 5: Commit**

```bash
git add src/screens/LoginScreen.tsx src/store/appStore.ts src/store/__tests__/appStore.test.ts
git commit -m "feat: persist auth session across login and logout"
```

### Task 5: Add Root Bootstrap Orchestration and Loading UI

**Files:**
- Create: `src/screens/AuthBootstrapScreen.tsx`
- Modify: `src/navigation/RootNavigator.tsx`
- Test: `src/navigation/__tests__/RootNavigator.test.tsx`

- [x] **Step 1: Write the failing navigator test**

```tsx
type RootNavigatorStoreState = {
  isAuthenticated: boolean;
  isAuthBootstrapping: boolean;
  isOnboardingComplete: boolean;
};

it('shows the auth bootstrap screen while restoring session state', () => {
  const { getByText, queryByText } = renderWithState({
    isAuthenticated: false,
    isAuthBootstrapping: true,
    isOnboardingComplete: false,
  });

  expect(getByText('Restoring your session')).toBeTruthy();
  expect(queryByText('Auth flow')).toBeNull();
  expect(queryByText('Onboarding flow')).toBeNull();
  expect(queryByText('Main app')).toBeNull();
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npx jest src/navigation/__tests__/RootNavigator.test.tsx --runInBand`
Expected: FAIL because the bootstrap route branch does not exist.

- [x] **Step 3: Create the bootstrap screen**

```tsx
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Screen } from '../components/Screen';
import { Typography } from '../components/Typography';
import { useTheme } from '../theme';

const AuthBootstrapScreen = () => {
  const { colors, spacing } = useTheme();

  return (
    <Screen>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.lg,
        }}
      >
        <ActivityIndicator size="large" color={colors.ink} />
        <View style={{ height: spacing.md }} />
        <Typography variant="h3">Restoring your session</Typography>
        <View style={{ height: spacing.xs }} />
        <Typography variant="body" style={{ color: colors.textSecondary }}>
          Checking your secure sign-in before loading the app.
        </Typography>
      </View>
    </Screen>
  );
};

export default AuthBootstrapScreen;
```

- [x] **Step 4: Trigger bootstrap once inside the root navigator**

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { bootstrapAuthSession } from '../services/authBootstrap';
import { useAppStore } from '../store/appStore';
import AuthBootstrapScreen from '../screens/AuthBootstrapScreen';

export const RootNavigator = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isAuthBootstrapping = useAppStore((state) => state.isAuthBootstrapping);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);
  const applyAuthenticatedUser = useAppStore((state) => state.applyAuthenticatedUser);
  const finishAuthBootstrap = useAppStore((state) => state.finishAuthBootstrap);

  React.useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const result = await bootstrapAuthSession();

        if (!isMounted) {
          return;
        }

        if (result.status === 'authenticated') {
          applyAuthenticatedUser(result.user);
        } else {
          finishAuthBootstrap();
        }
      } catch {
        if (isMounted) {
          finishAuthBootstrap();
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [applyAuthenticatedUser, finishAuthBootstrap]);

  return (
    <NavigationContainer>
      {isAuthBootstrapping ? (
        <AuthBootstrapScreen />
      ) : !isAuthenticated ? (
        <AuthNavigator />
      ) : !isOnboardingComplete ? (
        <OnboardingNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
};
```

- [x] **Step 5: Run the navigator test**

Run: `npx jest src/navigation/__tests__/RootNavigator.test.tsx --runInBand`
Expected: PASS with the bootstrap-screen case plus the existing route cases.

- [ ] **Step 6: Commit**

```bash
git add src/screens/AuthBootstrapScreen.tsx src/navigation/RootNavigator.tsx src/navigation/__tests__/RootNavigator.test.tsx
git commit -m "feat: bootstrap auth state before routing"
```

### Task 6: Run Full Validation for the Slice

**Files:**
- Modify: `docs/superpowers/plans/2026-07-21-auth-bootstrap-slice.md` (check off tasks as they complete)

- [x] **Step 1: Run the focused test suite**

Run: `npx jest src/services/__tests__/authSessionStore.test.ts src/services/__tests__/authBootstrap.test.ts src/store/__tests__/appStore.test.ts src/navigation/__tests__/RootNavigator.test.tsx --runInBand`
Expected: PASS with all auth bootstrap tests green.

- [x] **Step 2: Run the service regression test that already covers API token behavior**

Run: `npx jest src/services/__tests__/apiService.test.ts --runInBand`
Expected: PASS with 6 passing tests.

- [x] **Step 3: Run TypeScript validation**

Run: `npx tsc --noEmit`
Expected: PASS with zero type errors.

- [ ] **Step 4: Smoke test the runtime manually**

Run:

```bash
npm start
```

Expected:
- first launch shows `Restoring your session` briefly, then the login screen if no session exists
- after successful Keycloak login, cold restart restores the session without showing the login screen
- if the stored token is invalid, bootstrap clears it and routes back to login

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add auth bootstrap slice"
```

---

## Self-Review

- Spec coverage: The plan covers persistence, startup restoration, `auth/me` validation, route gating, logout cleanup, and verification tests. No requirement from the requested auth bootstrap slice is left unplanned.
- Placeholder scan: No `TODO`, `TBD`, or “implement later” placeholders remain.
- Type consistency: The plan uses the existing `JwtResponse` app user shape, the generated `apiClient.api.currentUser()` method, and the current Zustand store naming conventions.

## Implementation Notes

- Implemented files include persisted session storage, bootstrap orchestration, login/logout persistence, store bootstrap state, and root bootstrap UI/routing.
- Automated validation completed across focused Jest suites and `npx tsc --noEmit`.
- Remaining unchecked items are intentionally pending: manual Expo smoke testing and the commit steps that should be completed as part of the handoff workflow.
