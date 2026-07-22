import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import SetupSummaryScreen from '../onboarding/SetupSummaryScreen';
import { profileService } from '../../services/profileService';
import { useAppStore } from '../../store/appStore';

jest.mock('../../services/profileService', () => ({
  profileService: {
    submitOnboardingProfile: jest.fn(),
  },
}));

const resetAppStore = () => {
  const existingDraft = useAppStore.getState().profileDraft;
  useAppStore.setState({
    isAuthenticated: true,
    isOnboardingComplete: false,
    onboardingStep: 'summary',
    user: {
      id: 'user-1',
      email: 'jordan@example.com',
      role: 'CLIENT',
      token: 'token-123',
      type: 'Bearer',
    } as any,
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
        mobileNumber: '0821234567',
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
      notificationPreferenceSet: true,
    },
  });
};

describe('SetupSummaryScreen', () => {
  beforeEach(() => {
    (profileService.submitOnboardingProfile as jest.Mock).mockResolvedValue({
      id: 'profile-1',
      userId: 'user-1',
      fullName: 'Jordan Client',
      email: 'jordan@example.com',
    });
    resetAppStore();
  });

  afterAll(() => {
    resetAppStore();
  });

  it('submits onboarding details before entering the main app state', async () => {
    const navigation = { navigate: jest.fn() };

    const { findByText, getByText } = render(<SetupSummaryScreen navigation={navigation as any} />);

    fireEvent.press(getByText('See my financial summary'));

    await findByText('See my financial summary');

    expect(profileService.submitOnboardingProfile).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        goals: ['Reduce debt'],
      }),
    );
    expect(useAppStore.getState().isOnboardingComplete).toBe(true);
    expect(useAppStore.getState().onboardingStep).toBe('summary');
  });
});
