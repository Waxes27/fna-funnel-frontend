import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  OnboardingActionBar,
  OnboardingCard,
  OnboardingHeader,
  OnboardingShell,
} from '../../components/onboarding';
import { Typography } from '../../components/Typography';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme';

type SignupMethodScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'SignupMethod'>;

const options = [
  {
    title: 'Continue with email',
    description: 'Create your secure account with email and verify it in the next step.',
    status: 'Available now',
    enabled: true,
  },
  {
    title: 'Advisor-assisted setup',
    description: 'Start with guided digital onboarding today and add advisor help later.',
    status: 'Coming next',
    enabled: false,
  },
];

const SignupMethodScreen: React.FC<SignupMethodScreenProps> = ({ navigation }) => {
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, spacing } = useTheme();

  const handleContinue = () => {
    navigation.navigate('EmailSignup');
  };

  const handleBack = () => {
    setOnboardingStep('welcome');
    navigation.goBack();
  };

  return (
    <OnboardingShell step={2} totalSteps={16}>
      <OnboardingHeader
        eyebrow="Choose your path"
        title="How would you like to begin?"
        description="Start with the path that gets you into your plan fastest. Email is ready now and keeps the setup fully self-serve."
      />

      <View style={{ gap: spacing.md }}>
        {options.map((option) => {
          const cardStyle = option.enabled ? undefined : styles.disabledCard;

          return (
            <Pressable
              key={option.title}
              accessibilityRole="button"
              disabled={!option.enabled}
              onPress={option.enabled ? handleContinue : undefined}
              style={({ pressed }) => [
                styles.pressable,
                pressed && option.enabled ? styles.pressed : null,
              ]}
            >
              <OnboardingCard style={cardStyle}>
                <Typography
                  variant="eyebrow"
                  style={{ color: option.enabled ? colors.signalOrange : colors.textSecondary }}
                >
                  {option.status}
                </Typography>
                <View style={{ height: spacing.sm }} />
                <Typography variant="h3">{option.title}</Typography>
                <View style={{ height: spacing.xs }} />
                <Typography variant="body" style={{ color: colors.textSecondary }}>
                  {option.description}
                </Typography>
              </OnboardingCard>
            </Pressable>
          );
        })}
      </View>

      <OnboardingActionBar
        primaryTitle="Continue with email"
        onPrimaryPress={handleContinue}
        secondaryTitle="Back"
        onSecondaryPress={handleBack}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  disabledCard: {
    opacity: 0.7,
  },
});

export default SignupMethodScreen;
