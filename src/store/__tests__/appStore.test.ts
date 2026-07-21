import { useAppStore } from '../appStore';
import { apiService } from '../../services/apiService';

const resetAppStore = () => {
  apiService.setToken(null);
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
      token: 'client-token',
    });

    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().isOnboardingComplete).toBe(false);
    expect(useAppStore.getState().onboardingStep).toBe('welcome');
    expect(apiService.getToken()).toBe('client-token');
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
      role: 'ADVISER',
      token: 'advisor-token',
    });

    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().isOnboardingComplete).toBe(true);
    expect(useAppStore.getState().onboardingStep).toBe('summary');
  });

  it('clears the API token on logout', () => {
    useAppStore.getState().login({
      id: 'user-2',
      email: 'logout@example.com',
      role: 'CLIENT',
      token: 'token-to-clear',
    });

    useAppStore.getState().logout();

    expect(apiService.getToken()).toBeNull();
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });
});
