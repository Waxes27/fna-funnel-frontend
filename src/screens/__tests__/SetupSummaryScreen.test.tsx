import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import SetupSummaryScreen from '../onboarding/SetupSummaryScreen';
import { useAppStore } from '../../store/appStore';

const resetAppStore = () => {
  const existingDraft = useAppStore.getState().profileDraft;
  useAppStore.setState({
    isAuthenticated: true,
    isOnboardingComplete: false,
    onboardingStep: 'summary',
    profileDraft: {
      ...existingDraft,
      goals: ['Reduce debt'],
      primaryApplicant: {
        ...existingDraft.primaryApplicant,
        title: 'MR',
        firstName: 'Jordan',
        surname: 'Client',
        idNumber: '9001015009087',
        gender: 'MALE',
        maritalStatus: 'SINGLE',
        smokerStatus: 'NON_SMOKER',
        highestEducationLevel: 'BACHELORS_DEGREE',
        occupation: 'Engineer',
        grossMonthlyIncome: '45000',
        emailAddress: 'jordan@example.com',
        mobileNumber: '+27821234567',
        residentialAddress: {
          ...existingDraft.primaryApplicant.residentialAddress,
          addressLine1: '12 Main Road',
          suburb: 'Green Point',
          city: 'Cape Town',
          province: 'WESTERN_CAPE',
          postalCode: '8001',
          country: 'South Africa',
        },
      },
      spouse: {
        ...existingDraft.spouse,
        applicable: false,
      },
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
