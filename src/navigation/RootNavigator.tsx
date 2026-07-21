import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { OnboardingNavigator } from './OnboardingNavigator';

export const RootNavigator = () => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isOnboardingComplete = useAppStore((state) => state.isOnboardingComplete);

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : !isOnboardingComplete ? (
        <OnboardingNavigator />
      ) : (
        <MainNavigator />
      )}
    </NavigationContainer>
  );
};
