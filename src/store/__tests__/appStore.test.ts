import { useAppStore } from '../appStore';

const resetAppStore = () => {
  useAppStore.setState({
    isAuthenticated: false,
    isOnboardingComplete: false,
    onboardingStep: 'welcome',
    user: null,
    profile: null,
  });
};

describe('appStore onboarding state', () => {
  beforeEach(() => {
    resetAppStore();
  });

  afterAll(() => {
    resetAppStore();
  });

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

  it('bypasses onboarding for non-client roles', () => {
    useAppStore.getState().login({
      id: 'advisor-1',
      email: 'advisor@example.com',
      role: 'ADVISOR',
    });

    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().isOnboardingComplete).toBe(true);
    expect(useAppStore.getState().onboardingStep).toBe('summary');
  });
});
