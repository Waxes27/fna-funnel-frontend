import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { OnboardingStep, useAppStore } from '../store/appStore';
import {
  AccountConnectionScreen,
  ConsentScreen,
  ContactDetailsScreen,
  DateOfBirthScreen,
  EmailSignupScreen,
  FinancialSnapshotScreen,
  GoalsScreen,
  HouseholdEmploymentScreen,
  LegalNameScreen,
  NotificationPromptScreen,
  OtpVerificationScreen,
  RiskQuizScreen,
  SignupMethodScreen,
  SetupSummaryScreen,
  ValueExplainerScreen,
  WelcomeCarouselScreen,
} from '../screens/onboarding';

export type OnboardingStackParamList = {
  Welcome: undefined;
  SignupMethod: undefined;
  EmailSignup: undefined;
  VerifyOtp: { email: string };
  Goals: undefined;
  ValueExplainer: undefined;
  LegalName: undefined;
  DateOfBirth: undefined;
  ContactDetails: undefined;
  HouseholdEmployment: undefined;
  FinancialSnapshot: undefined;
  RiskQuiz: undefined;
  Consent: undefined;
  NotificationPrompt: undefined;
  AccountConnection: undefined;
  SetupSummary: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const onboardingStepToRouteName: Record<OnboardingStep, keyof OnboardingStackParamList> = {
  welcome: 'Welcome',
  signupMethod: 'SignupMethod',
  verifyOtp: 'VerifyOtp',
  goals: 'Goals',
  valueExplainer: 'ValueExplainer',
  legalName: 'LegalName',
  dateOfBirth: 'DateOfBirth',
  contactDetails: 'ContactDetails',
  householdEmployment: 'HouseholdEmployment',
  financialSnapshot: 'FinancialSnapshot',
  riskQuiz: 'RiskQuiz',
  consent: 'Consent',
  notificationPrompt: 'NotificationPrompt',
  accountConnection: 'AccountConnection',
  summary: 'SetupSummary',
};

export const OnboardingNavigator = () => {
  const onboardingStep = useAppStore((state) => state.onboardingStep);

  return (
    <Stack.Navigator
      initialRouteName={onboardingStepToRouteName[onboardingStep]}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeCarouselScreen} />
      <Stack.Screen name="SignupMethod" component={SignupMethodScreen} />
      <Stack.Screen name="EmailSignup" component={EmailSignupScreen} />
      <Stack.Screen name="VerifyOtp" component={OtpVerificationScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="ValueExplainer" component={ValueExplainerScreen} />
      <Stack.Screen name="LegalName" component={LegalNameScreen} />
      <Stack.Screen name="DateOfBirth" component={DateOfBirthScreen} />
      <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
      <Stack.Screen name="HouseholdEmployment" component={HouseholdEmploymentScreen} />
      <Stack.Screen name="FinancialSnapshot" component={FinancialSnapshotScreen} />
      <Stack.Screen name="RiskQuiz" component={RiskQuizScreen} />
      <Stack.Screen name="Consent" component={ConsentScreen} />
      <Stack.Screen name="NotificationPrompt" component={NotificationPromptScreen} />
      <Stack.Screen name="AccountConnection" component={AccountConnectionScreen} />
      <Stack.Screen name="SetupSummary" component={SetupSummaryScreen} />
    </Stack.Navigator>
  );
};
