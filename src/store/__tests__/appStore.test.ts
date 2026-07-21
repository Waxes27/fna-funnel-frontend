import { useAppStore } from '../appStore';
import { apiService } from '../../services/apiService';
import { clearPersistedAuthSession } from '../../services/authSessionStore';

jest.mock('../../services/authSessionStore', () => ({
  clearPersistedAuthSession: jest.fn(),
}));

const resetAppStore = () => {
  apiService.setToken(null);
  useAppStore.setState(useAppStore.getInitialState());
};

describe('appStore onboarding state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetAppStore();
  });

  afterAll(() => {
    resetAppStore();
  });

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

  it('marks a client as needing onboarding after login', () => {
    useAppStore.getState().login({
      id: 'user-1',
      email: 'test@example.com',
      role: 'ROLE_CLIENT',
      token: 'client-token',
    });

    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().isAuthBootstrapping).toBe(false);
    expect(useAppStore.getState().isOnboardingComplete).toBe(false);
    expect(useAppStore.getState().onboardingStep).toBe('welcome');
    expect(useAppStore.getState().user?.role).toBe('CLIENT');
    expect(apiService.getToken()).toBe('client-token');
    expect(useAppStore.getState().profileDraft.primaryApplicant.emailAddress).toBe(
      'test@example.com',
    );
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
    expect(useAppStore.getState().isAuthBootstrapping).toBe(false);
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
    expect(clearPersistedAuthSession).toHaveBeenCalledTimes(1);
    expect(useAppStore.getState().isAuthenticated).toBe(false);
    expect(useAppStore.getState().isAuthBootstrapping).toBe(false);
  });
});
