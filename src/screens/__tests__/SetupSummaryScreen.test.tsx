import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import SetupSummaryScreen from '../onboarding/SetupSummaryScreen';
import { useAppStore } from '../../store/appStore';

const resetAppStore = () => {
  useAppStore.setState({
    isAuthenticated: true,
    isOnboardingComplete: false,
    onboardingStep: 'summary',
    profileDraft: {
      goals: ['Reduce debt'],
      fullName: 'Jordan Client',
      dateOfBirth: '',
      mobileNumber: '',
      email: 'jordan@example.com',
      residentialAddress: '',
      maritalStatus: '',
      numberOfDependants: '',
      employmentStatus: '',
      occupation: '',
      employer: '',
      annualIncome: '',
      spouseIncome: '',
      householdExpenses: '',
      monthlyIncome: '45000',
      monthlyExpenses: '18000',
      debtEstimate: '120000',
      riskComfort: 'Balanced',
      consentAccepted: true,
      notificationsEnabled: true,
      accountConnectionChoice: 'manual',
    },
  });
};

describe('SetupSummaryScreen', () => {
  beforeEach(() => {
    resetAppStore();
  });

  afterAll(() => {
    resetAppStore();
  });

  it('completes onboarding and exits to the main app state', () => {
    const navigation = { navigate: jest.fn() };

    const { getByText } = render(<SetupSummaryScreen navigation={navigation as any} />);

    fireEvent.press(getByText('See my financial summary'));

    expect(useAppStore.getState().isOnboardingComplete).toBe(true);
    expect(useAppStore.getState().onboardingStep).toBe('summary');
  });
});
