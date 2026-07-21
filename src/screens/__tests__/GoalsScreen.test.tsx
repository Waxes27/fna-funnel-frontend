import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import GoalsScreen from '../onboarding/GoalsScreen';
import { useAppStore } from '../../store/appStore';

const resetAppStore = () => {
  const existingDraft = useAppStore.getState().profileDraft;
  useAppStore.setState({
    onboardingStep: 'goals',
    profileDraft: {
      ...existingDraft,
      goals: [],
    },
  });
};

describe('GoalsScreen', () => {
  beforeEach(() => {
    resetAppStore();
  });

  afterAll(() => {
    resetAppStore();
  });

  it('requires at least one goal before continuing', () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    const { getByText } = render(<GoalsScreen navigation={navigation as any} />);

    fireEvent.press(getByText('Continue'));
    expect(navigation.navigate).not.toHaveBeenCalled();

    fireEvent.press(getByText('Reduce debt'));
    fireEvent.press(getByText('Continue'));

    expect(navigation.navigate).toHaveBeenCalledWith('ValueExplainer');
  });
});
