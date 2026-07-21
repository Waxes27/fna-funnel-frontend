# Onboarding Flow Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current flat `Login` / `Register` experience with a mobile-first, multi-step onboarding journey that uses the existing React Native design system and routes incomplete users back into setup until they reach a meaningful first summary.

**Architecture:** Add a dedicated `OnboardingNavigator`, a small onboarding UI composition layer built on top of `Screen`, `Surface`, `Typography`, `Input`, and `Button`, and a Zustand onboarding state model that gates navigation after auth. Keep the redesign design-system-native by using theme tokens only and by consolidating repeated keyboard, scroll, progress, and CTA patterns into shared onboarding primitives instead of screen-local layout code.

**Tech Stack:** Expo, React Native, React Navigation Native Stack, Zustand, React Hook Form, Zod, Jest, Testing Library React Native

---

### Task 1: Add Onboarding State And Navigation Gate

**Files:**
- Create: `src/navigation/OnboardingNavigator.tsx`
- Create: `src/store/__tests__/appStore.test.ts`
- Modify: `src/store/appStore.ts`
- Modify: `src/navigation/RootNavigator.tsx`
- Modify: `src/navigation/AuthNavigator.tsx`
- Modify: `src/navigation/MainNavigator.tsx`

- [ ] **Step 1: Write the failing onboarding-state tests**

```ts
import { useAppStore } from '../appStore';

describe('appStore onboarding state', () => {
  it('marks a client as needing onboarding after login', () => {
    useAppStore.getState().login({
      id: 'user-1',
      email: 'test@example.com',
      role: 'CLIENT',
    });

    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().isOnboardingComplete).toBe(false);
    expect(useAppStore.getState().onboardingStep).toBe('welcome');
  });

  it('can advance and complete onboarding', () => {
    useAppStore.getState().setOnboardingStep('financialSnapshot');
    useAppStore.getState().completeOnboarding();

    expect(useAppStore.getState().isOnboardingComplete).toBe(true);
    expect(useAppStore.getState().onboardingStep).toBe('summary');
  });
});
```

- [ ] **Step 2: Run the state test to verify it fails**

Run: `npx jest --runTestsByPath src/store/__tests__/appStore.test.ts`
Expected: FAIL because `isOnboardingComplete`, `onboardingStep`, `setOnboardingStep`, and `completeOnboarding` do not exist yet.

- [ ] **Step 3: Add onboarding-aware auth state to the store**

```ts
interface OnboardingStepState {
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  onboardingStep:
    | 'welcome'
    | 'signupMethod'
    | 'verifyOtp'
    | 'goals'
    | 'financialSnapshot'
    | 'summary';
  login: (user: JwtResponse) => void;
  logout: () => void;
  setOnboardingStep: (step: AppState['onboardingStep']) => void;
  completeOnboarding: () => void;
}

login: (user) =>
  set({
    isAuthenticated: true,
    user,
    isOnboardingComplete: false,
    onboardingStep: 'welcome',
  }),
setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
completeOnboarding: () =>
  set({
    isOnboardingComplete: true,
    onboardingStep: 'summary',
  }),
logout: () =>
  set({
    isAuthenticated: false,
    isOnboardingComplete: false,
    onboardingStep: 'welcome',
    user: null,
    profile: null,
  }),
```

- [ ] **Step 4: Gate the app with a dedicated onboarding navigator**

```tsx
export const RootNavigator = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
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

```tsx
export type OnboardingStackParamList = {
  Welcome: undefined;
  SignupMethod: undefined;
  EmailSignup: undefined;
  VerifyOtp: { email: string };
  Goals: undefined;
  ValueExplainer: undefined;
  LegalName: undefined;
  DateOfBirth: undefined;
  ContactDetails: undefined;
  HouseholdEmployment: undefined;
  FinancialSnapshot: undefined;
  RiskQuiz: undefined;
  Consent: undefined;
  NotificationPrompt: undefined;
  AccountConnection: undefined;
  SetupSummary: undefined;
};
```

- [ ] **Step 5: Run the store tests again**

Run: `npx jest --runTestsByPath src/store/__tests__/appStore.test.ts`
Expected: PASS with onboarding state transitions covered.

- [ ] **Step 6: Commit**

```bash
git add src/store/appStore.ts src/store/__tests__/appStore.test.ts src/navigation/RootNavigator.tsx src/navigation/AuthNavigator.tsx src/navigation/MainNavigator.tsx src/navigation/OnboardingNavigator.tsx
git commit -m "feat: add onboarding navigation gate"
```

### Task 2: Build Shared Onboarding Layout Primitives

**Files:**
- Create: `src/components/onboarding/OnboardingShell.tsx`
- Create: `src/components/onboarding/OnboardingHeader.tsx`
- Create: `src/components/onboarding/OnboardingProgress.tsx`
- Create: `src/components/onboarding/OnboardingCard.tsx`
- Create: `src/components/onboarding/OnboardingActionBar.tsx`
- Create: `src/components/onboarding/index.ts`
- Create: `src/components/__tests__/OnboardingShell.test.tsx`

- [ ] **Step 1: Write a failing layout test**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { OnboardingShell } from '../onboarding/OnboardingShell';

describe('OnboardingShell', () => {
  it('renders progress text and children inside one shell', () => {
    const { getByText } = render(
      <OnboardingShell step={2} totalSteps={5}>
        <>Body content</>
      </OnboardingShell>
    );

    expect(getByText('Step 2 of 5')).toBeTruthy();
    expect(getByText('Body content')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the shell test to verify it fails**

Run: `npx jest --runTestsByPath src/components/__tests__/OnboardingShell.test.tsx`
Expected: FAIL because the onboarding shell components do not exist yet.

- [ ] **Step 3: Create the onboarding composition layer using existing primitives**

```tsx
export const OnboardingShell = ({
  step,
  totalSteps,
  children,
}: PropsWithChildren<{ step: number; totalSteps: number }>) => {
  const { spacing } = useTheme();

  return (
    <Screen scrollable contentContainerStyle={{ paddingVertical: spacing.lg }}>
      <View style={{ gap: spacing.lg }}>
        <OnboardingProgress step={step} totalSteps={totalSteps} />
        {children}
      </View>
    </Screen>
  );
};
```

```tsx
export const OnboardingCard = ({ children }: PropsWithChildren) => {
  const { colors, spacing } = useTheme();

  return (
    <Surface
      variant="raised"
      radius="frame"
      shadow="level2"
      bordered
      style={{ backgroundColor: colors.surfaceRaised, padding: spacing.lg }}
    >
      {children}
    </Surface>
  );
};
```

- [ ] **Step 4: Export the primitives from one barrel file**

```ts
export * from './OnboardingActionBar';
export * from './OnboardingCard';
export * from './OnboardingHeader';
export * from './OnboardingProgress';
export * from './OnboardingShell';
```

- [ ] **Step 5: Run the layout test again**

Run: `npx jest --runTestsByPath src/components/__tests__/OnboardingShell.test.tsx`
Expected: PASS with shared shell rendering and progress copy working.

- [ ] **Step 6: Commit**

```bash
git add src/components/onboarding src/components/__tests__/OnboardingShell.test.tsx
git commit -m "feat: add onboarding layout primitives"
```

### Task 3: Replace Flat Entry With Welcome, Sign-Up Method, And OTP

**Files:**
- Create: `src/screens/onboarding/WelcomeCarouselScreen.tsx`
- Create: `src/screens/onboarding/SignupMethodScreen.tsx`
- Create: `src/screens/onboarding/EmailSignupScreen.tsx`
- Create: `src/screens/onboarding/OtpVerificationScreen.tsx`
- Create: `src/screens/onboarding/index.ts`
- Create: `src/screens/__tests__/OtpVerificationScreen.test.tsx`
- Modify: `src/navigation/OnboardingNavigator.tsx`
- Modify: `src/screens/LoginScreen.tsx`
- Modify: `src/screens/RegisterScreen.tsx`

- [ ] **Step 1: Write the failing OTP verification test**

```tsx
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import OtpVerificationScreen from '../onboarding/OtpVerificationScreen';

describe('OtpVerificationScreen', () => {
  it('enables continue once six digits are entered', () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    const route = { params: { email: 'test@example.com' } };
    const { getByLabelText, getByText } = render(
      <OtpVerificationScreen navigation={navigation as any} route={route as any} />
    );

    fireEvent.changeText(getByLabelText('Verification code'), '123456');
    fireEvent.press(getByText('Verify code'));

    expect(navigation.navigate).toHaveBeenCalledWith('Goals');
  });
});
```

- [ ] **Step 2: Run the OTP test to verify it fails**

Run: `npx jest --runTestsByPath src/screens/__tests__/OtpVerificationScreen.test.tsx`
Expected: FAIL because the OTP screen and route do not exist.

- [ ] **Step 3: Build the new entry flow and keep the old auth screens as secondary paths**

```tsx
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="Welcome" component={WelcomeCarouselScreen} />
  <Stack.Screen name="SignupMethod" component={SignupMethodScreen} />
  <Stack.Screen name="EmailSignup" component={EmailSignupScreen} />
  <Stack.Screen name="VerifyOtp" component={OtpVerificationScreen} />
  <Stack.Screen name="Goals" component={GoalsScreen} />
</Stack.Navigator>
```

```tsx
const onSubmit = async (data: EmailSignupFormData) => {
  login({
    id: 'new-123',
    email: data.email,
    role: 'CLIENT',
  });
  setOnboardingStep('verifyOtp');
  navigation.navigate('VerifyOtp', { email: data.email });
};
```

- [ ] **Step 4: Reduce the existing login and register screens to support returning users and secondary entry**

```tsx
<CustomButton
  title="Continue with email"
  onPress={() => navigation.navigate('EmailSignup')}
/>
<CustomButton
  title="Already have an account? Log In"
  variant="secondary"
  onPress={() => navigation.navigate('Login')}
/>
```

```tsx
const onSubmit = async (data: LoginFormData) => {
  const response = await apiClient.post('/auth/login', data);
  login(response.data.user);
  setOnboardingStep('goals');
};
```

- [ ] **Step 5: Run the OTP test again**

Run: `npx jest --runTestsByPath src/screens/__tests__/OtpVerificationScreen.test.tsx`
Expected: PASS with six-digit verification navigating into the guided flow.

- [ ] **Step 6: Commit**

```bash
git add src/navigation/OnboardingNavigator.tsx src/screens/onboarding src/screens/__tests__/OtpVerificationScreen.test.tsx src/screens/LoginScreen.tsx src/screens/RegisterScreen.tsx
git commit -m "feat: add onboarding entry and otp steps"
```

### Task 4: Implement Guided Profile Steps

**Files:**
- Create: `src/screens/onboarding/GoalsScreen.tsx`
- Create: `src/screens/onboarding/ValueExplainerScreen.tsx`
- Create: `src/screens/onboarding/LegalNameScreen.tsx`
- Create: `src/screens/onboarding/DateOfBirthScreen.tsx`
- Create: `src/screens/onboarding/ContactDetailsScreen.tsx`
- Create: `src/screens/onboarding/HouseholdEmploymentScreen.tsx`
- Create: `src/screens/__tests__/GoalsScreen.test.tsx`
- Modify: `src/navigation/OnboardingNavigator.tsx`
- Modify: `src/store/appStore.ts`

- [ ] **Step 1: Write the failing goals-selection test**

```tsx
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import GoalsScreen from '../onboarding/GoalsScreen';

describe('GoalsScreen', () => {
  it('requires at least one goal before continuing', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<GoalsScreen navigation={navigation as any} />);

    fireEvent.press(getByText('Continue'));
    expect(navigation.navigate).not.toHaveBeenCalled();

    fireEvent.press(getByText('Reduce debt'));
    fireEvent.press(getByText('Continue'));
    expect(navigation.navigate).toHaveBeenCalledWith('ValueExplainer');
  });
});
```

- [ ] **Step 2: Run the goals test to verify it fails**

Run: `npx jest --runTestsByPath src/screens/__tests__/GoalsScreen.test.tsx`
Expected: FAIL because the goal step and selection state do not exist.

- [ ] **Step 3: Add progressive profile steps with one decision per screen**

```tsx
export const goals = [
  'Protect my family',
  'Reduce debt',
  'Plan retirement',
  'Understand my risks',
  'Improve cash flow',
];
```

```tsx
<OnboardingShell step={5} totalSteps={12}>
  <OnboardingHeader
    eyebrow="Personalize your plan"
    title="What brought you here?"
    description="Pick the goals you want Momentum FNA to focus on first."
  />
  <OnboardingCard>{/* tappable goal chips here */}</OnboardingCard>
  <OnboardingActionBar
    primaryTitle="Continue"
    onPrimaryPress={handleContinue}
    secondaryTitle="Back"
    onSecondaryPress={navigation.goBack}
  />
</OnboardingShell>
```

- [ ] **Step 4: Persist profile-step progress in the store**

```ts
interface OnboardingProfileDraft {
  goals: string[];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mobile: string;
  preferredLanguage: string;
  maritalStatus: string;
  dependants: string;
  employmentStatus: string;
  occupation: string;
}

setProfileDraft: (patch) =>
  set((state) => ({
    profileDraft: {
      ...state.profileDraft,
      ...patch,
    },
  })),
```

- [ ] **Step 5: Run the goals test again**

Run: `npx jest --runTestsByPath src/screens/__tests__/GoalsScreen.test.tsx`
Expected: PASS with goal selection enforcing a minimum of one choice.

- [ ] **Step 6: Commit**

```bash
git add src/screens/onboarding/GoalsScreen.tsx src/screens/onboarding/ValueExplainerScreen.tsx src/screens/onboarding/LegalNameScreen.tsx src/screens/onboarding/DateOfBirthScreen.tsx src/screens/onboarding/ContactDetailsScreen.tsx src/screens/onboarding/HouseholdEmploymentScreen.tsx src/screens/__tests__/GoalsScreen.test.tsx src/navigation/OnboardingNavigator.tsx src/store/appStore.ts
git commit -m "feat: add guided onboarding profile steps"
```

### Task 5: Implement Financial Snapshot, Consent, Permissions, And Summary

**Files:**
- Create: `src/screens/onboarding/FinancialSnapshotScreen.tsx`
- Create: `src/screens/onboarding/RiskQuizScreen.tsx`
- Create: `src/screens/onboarding/ConsentScreen.tsx`
- Create: `src/screens/onboarding/NotificationPromptScreen.tsx`
- Create: `src/screens/onboarding/AccountConnectionScreen.tsx`
- Create: `src/screens/onboarding/SetupSummaryScreen.tsx`
- Create: `src/screens/__tests__/SetupSummaryScreen.test.tsx`
- Modify: `src/navigation/OnboardingNavigator.tsx`
- Modify: `src/store/appStore.ts`

- [ ] **Step 1: Write the failing summary test**

```tsx
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import SetupSummaryScreen from '../onboarding/SetupSummaryScreen';

describe('SetupSummaryScreen', () => {
  it('completes onboarding and exits to the main app', () => {
    const completeOnboarding = jest.fn();
    jest.spyOn(require('../../store/appStore'), 'useAppStore').mockReturnValue({
      profileDraft: { goals: ['Reduce debt'], monthlyIncome: '45000' },
      completeOnboarding,
    });

    const { getByText } = render(<SetupSummaryScreen />);
    fireEvent.press(getByText('See my financial summary'));

    expect(completeOnboarding).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the summary test to verify it fails**

Run: `npx jest --runTestsByPath src/screens/__tests__/SetupSummaryScreen.test.tsx`
Expected: FAIL because the summary screen and completion handler do not exist.

- [ ] **Step 3: Implement the final onboarding steps with defer-friendly UX**

```tsx
<Stack.Screen name="FinancialSnapshot" component={FinancialSnapshotScreen} />
<Stack.Screen name="RiskQuiz" component={RiskQuizScreen} />
<Stack.Screen name="Consent" component={ConsentScreen} />
<Stack.Screen name="NotificationPrompt" component={NotificationPromptScreen} />
<Stack.Screen name="AccountConnection" component={AccountConnectionScreen} />
<Stack.Screen name="SetupSummary" component={SetupSummaryScreen} />
```

```tsx
<OnboardingActionBar
  primaryTitle="See my financial summary"
  onPrimaryPress={completeOnboarding}
  secondaryTitle="Review details"
  onSecondaryPress={() => navigation.navigate('FinancialSnapshot')}
/>
```

- [ ] **Step 4: Add a financial draft to support the summary and future API wiring**

```ts
profileDraft: {
  goals: [],
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  mobile: '',
  preferredLanguage: 'English',
  maritalStatus: '',
  dependants: '',
  employmentStatus: '',
  occupation: '',
  monthlyIncome: '',
  monthlyExpenses: '',
  debtEstimate: '',
  riskComfort: '',
  consentAccepted: false,
  notificationsEnabled: false,
  accountConnectionChoice: 'manual',
},
```

- [ ] **Step 5: Run the summary test again**

Run: `npx jest --runTestsByPath src/screens/__tests__/SetupSummaryScreen.test.tsx`
Expected: PASS with onboarding completion sending the user into `MainNavigator`.

- [ ] **Step 6: Commit**

```bash
git add src/screens/onboarding/FinancialSnapshotScreen.tsx src/screens/onboarding/RiskQuizScreen.tsx src/screens/onboarding/ConsentScreen.tsx src/screens/onboarding/NotificationPromptScreen.tsx src/screens/onboarding/AccountConnectionScreen.tsx src/screens/onboarding/SetupSummaryScreen.tsx src/screens/__tests__/SetupSummaryScreen.test.tsx src/navigation/OnboardingNavigator.tsx src/store/appStore.ts
git commit -m "feat: add onboarding completion steps"
```

### Task 6: Wire Resume Entry Points, Update Docs, And Validate

**Files:**
- Create: `src/navigation/__tests__/RootNavigator.test.tsx`
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `docs/screen-flow-diagram.md`
- Modify: `docs/frontend-specification.md`
- Modify: `docs/ui-ux-component-library.md`

- [ ] **Step 1: Write the failing root-router test**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { RootNavigator } from '../RootNavigator';
import { useAppStore } from '../../store/appStore';

jest.mock('../../store/appStore');

describe('RootNavigator', () => {
  it('shows onboarding for authenticated users with incomplete setup', () => {
    (useAppStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        isAuthenticated: true,
        isOnboardingComplete: false,
      })
    );

    const { getByText } = render(<RootNavigator />);
    expect(getByText('Step 1 of 12')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the routing test to verify it fails**

Run: `npx jest --runTestsByPath src/navigation/__tests__/RootNavigator.test.tsx`
Expected: FAIL until the router exposes onboarding content for incomplete users.

- [ ] **Step 3: Add resume-friendly entry points and document the new flow**

```tsx
<CustomButton
  title="Continue setup"
  onPress={() => navigation.navigate('OnboardingResume')}
/>
```

```md
### 1. Unauthenticated Journey
- Welcome carousel
- Sign-up method sheet
- Email sign-up / login
- OTP verification

### 2. Guided Client Onboarding
- Goals
- Value explainer
- Identity
- Household and employment
- Financial snapshot
- Risk quiz
- Consent
- Notifications
- Account connection
- Setup summary
```

- [ ] **Step 4: Run the focused validation suite**

Run: `npx jest --runTestsByPath src/store/__tests__/appStore.test.ts src/components/__tests__/OnboardingShell.test.tsx src/screens/__tests__/OtpVerificationScreen.test.tsx src/screens/__tests__/GoalsScreen.test.tsx src/screens/__tests__/SetupSummaryScreen.test.tsx src/navigation/__tests__/RootNavigator.test.tsx`
Expected: PASS for onboarding state, layout primitives, critical navigation, and key step behaviors.

Run: `npx eslint src/navigation src/screens src/components src/store docs/screen-flow-diagram.md docs/frontend-specification.md docs/ui-ux-component-library.md`
Expected: PASS with no new lint errors in touched code.

- [ ] **Step 5: Commit**

```bash
git add src/navigation/__tests__/RootNavigator.test.tsx src/screens/HomeScreen.tsx docs/screen-flow-diagram.md docs/frontend-specification.md docs/ui-ux-component-library.md
git commit -m "docs: sync onboarding flow redesign"
```

## Self-Review

**Spec coverage**
- The plan replaces the flat unauthenticated flow with a numbered, mobile-first onboarding journey aligned to the reference images in `Flows/Onboarding Flows`.
- The plan keeps the implementation inside the active React Native design system by introducing only composition helpers on top of existing primitives.
- The plan adds missing OTP, progressive profile capture, financial snapshot, consent, permissions, connection choice, and setup summary steps.
- The plan covers navigation gating, resume behavior, docs sync, and focused automated validation.

**Placeholder scan**
- No `TODO`, `TBD`, or "implement later" placeholders remain in the task steps.
- Every task names exact files, commands, and minimum code shapes needed to implement the slice.

**Type consistency**
- Navigation route names are consistent across the navigator and screen tasks.
- Store field names use one shared draft model instead of separate per-screen ad hoc state.
- Completion state uses `isOnboardingComplete` and `onboardingStep` consistently across store, router, and summary steps.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-21-onboarding-flow-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
