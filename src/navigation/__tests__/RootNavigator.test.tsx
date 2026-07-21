import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import { RootNavigator } from '../RootNavigator';
import { bootstrapAuthSession } from '../../services/authBootstrap';
import { useAppStore } from '../../store/appStore';

jest.mock('../../services/authBootstrap', () => ({
  bootstrapAuthSession: jest.fn(),
}));

jest.mock('../../store/appStore', () => ({
  useAppStore: jest.fn(),
}));

jest.mock('../AuthNavigator', () => ({
  AuthNavigator: () => {
    const { Text } = require('react-native');
    return <Text>Auth flow</Text>;
  },
}));

jest.mock('../MainNavigator', () => ({
  MainNavigator: () => {
    const { Text } = require('react-native');
    return <Text>Main app</Text>;
  },
}));

jest.mock('../OnboardingNavigator', () => ({
  OnboardingNavigator: () => {
    const { Text } = require('react-native');
    return <Text>Onboarding flow</Text>;
  },
}));

type RootNavigatorStoreState = {
  isAuthenticated: boolean;
  isAuthBootstrapping: boolean;
  isOnboardingComplete: boolean;
  applyAuthenticatedUser: jest.Mock;
  finishAuthBootstrap: jest.Mock;
};

const mockUseAppStore = useAppStore as unknown as jest.Mock;
const mockedBootstrapAuthSession = bootstrapAuthSession as jest.Mock;

const createState = (
  overrides: Partial<RootNavigatorStoreState> = {},
): RootNavigatorStoreState => ({
  isAuthenticated: false,
  isAuthBootstrapping: false,
  isOnboardingComplete: false,
  applyAuthenticatedUser: jest.fn(),
  finishAuthBootstrap: jest.fn(),
  ...overrides,
});

const renderWithState = (stateOverrides: Partial<RootNavigatorStoreState> = {}) => {
  const state = createState(stateOverrides);

  mockUseAppStore.mockImplementation((selector: (snapshot: RootNavigatorStoreState) => unknown) =>
    selector(state),
  );

  return {
    ...render(<RootNavigator />),
    state,
  };
};

describe('RootNavigator', () => {
  beforeEach(() => {
    mockUseAppStore.mockReset();
    mockedBootstrapAuthSession.mockReset();
    mockedBootstrapAuthSession.mockResolvedValue({ status: 'anonymous' });
  });

  it('shows auth routes for signed-out users', () => {
    const { getByText, queryByText } = renderWithState({
      isAuthenticated: false,
      isAuthBootstrapping: false,
      isOnboardingComplete: false,
    });

    expect(getByText('Auth flow')).toBeTruthy();
    expect(queryByText('Onboarding flow')).toBeNull();
    expect(queryByText('Main app')).toBeNull();
  });

  it('shows onboarding for authenticated users with incomplete setup', () => {
    const { getByText, queryByText } = renderWithState({
      isAuthenticated: true,
      isAuthBootstrapping: false,
      isOnboardingComplete: false,
    });

    expect(getByText('Onboarding flow')).toBeTruthy();
    expect(queryByText('Auth flow')).toBeNull();
    expect(queryByText('Main app')).toBeNull();
  });

  it('shows the main app after onboarding is complete', () => {
    const { getByText, queryByText } = renderWithState({
      isAuthenticated: true,
      isAuthBootstrapping: false,
      isOnboardingComplete: true,
    });

    expect(getByText('Main app')).toBeTruthy();
    expect(queryByText('Auth flow')).toBeNull();
    expect(queryByText('Onboarding flow')).toBeNull();
  });

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

  it('applies the authenticated user after a successful bootstrap', async () => {
    const user = {
      email: 'client@example.com',
      id: 'user-1',
      role: 'CLIENT',
      token: 'persisted-token',
      type: 'Bearer',
    };

    mockedBootstrapAuthSession.mockResolvedValueOnce({
      status: 'authenticated',
      user,
    });

    const { state } = renderWithState({
      isAuthenticated: false,
      isAuthBootstrapping: true,
      isOnboardingComplete: false,
    });

    await waitFor(() => {
      expect(state.applyAuthenticatedUser).toHaveBeenCalledWith(user);
    });

    expect(state.finishAuthBootstrap).not.toHaveBeenCalled();
  });

  it('finishes bootstrap when no authenticated session is restored', async () => {
    const { state } = renderWithState({
      isAuthenticated: false,
      isAuthBootstrapping: true,
      isOnboardingComplete: false,
    });

    await waitFor(() => {
      expect(state.finishAuthBootstrap).toHaveBeenCalledTimes(1);
    });

    expect(state.applyAuthenticatedUser).not.toHaveBeenCalled();
  });
});
