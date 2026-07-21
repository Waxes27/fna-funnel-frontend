import React from 'react';
import { render } from '@testing-library/react-native';

import { OnboardingShell } from '../onboarding/OnboardingShell';

describe('OnboardingShell', () => {
  it('renders progress text and children inside one shell', () => {
    const { getByText } = render(
      <OnboardingShell step={2} totalSteps={5}>
        <>Body content</>
      </OnboardingShell>,
    );

    expect(getByText('Step 2 of 5')).toBeTruthy();
    expect(getByText('Body content')).toBeTruthy();
  });
});
