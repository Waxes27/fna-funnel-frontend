import React from 'react';
import { render } from '@testing-library/react-native';

import { RootNavigator } from '../RootNavigator';
import { useAppStore } from '../../store/appStore';

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
  isOnboardingComplete: boolean;
};

const mockUseAppStore = useAppStore as unknown as jest.Mock;

const renderWithState = (state: RootNavigatorStoreState) => {
  mockUseAppStore.mockImplementation((selector: (snapshot: RootNavigatorStoreState) => unknown) =>
    selector(state),
  );

  return render(<RootNavigator />);
};

describe('RootNavigator', () => {
  beforeEach(() => {
    mockUseAppStore.mockReset();
  });

  it('shows auth routes for signed-out users', () => {
    const { getByText, queryByText } = renderWithState({
      isAuthenticated: false,
      isOnboardingComplete: false,
    });

    expect(getByText('Auth flow')).toBeTruthy();
    expect(queryByText('Onboarding flow')).toBeNull();
    expect(queryByText('Main app')).toBeNull();
  });

  it('shows onboarding for authenticated users with incomplete setup', () => {
    const { getByText, queryByText } = renderWithState({
      isAuthenticated: true,
      isOnboardingComplete: false,
    });

    expect(getByText('Onboarding flow')).toBeTruthy();
    expect(queryByText('Auth flow')).toBeNull();
    expect(queryByText('Main app')).toBeNull();
  });

  it('shows the main app after onboarding is complete', () => {
    const { getByText, queryByText } = renderWithState({
      isAuthenticated: true,
      isOnboardingComplete: true,
    });

    expect(getByText('Main app')).toBeTruthy();
    expect(queryByText('Auth flow')).toBeNull();
    expect(queryByText('Onboarding flow')).toBeNull();
  });
});
