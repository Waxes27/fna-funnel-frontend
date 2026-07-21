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
