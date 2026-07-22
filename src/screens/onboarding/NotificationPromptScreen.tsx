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

type NotificationPromptScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'NotificationPrompt'>,
  'navigation'
>;

const notificationChoices = [
  {
    title: 'Enable alerts',
    value: true,
    description: 'Get nudges for incomplete steps, new insights, and important follow-up actions.',
  },
  {
    title: 'Only essentials',
    value: false,
    description: 'Keep notifications off for now and review updates when you open the app.',
  },
] as const;

const NotificationPromptScreen: React.FC<NotificationPromptScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();

  return (
    <OnboardingShell step={11} totalSteps={12}>
      <OnboardingHeader
        eyebrow="Stay informed"
        title="Choose how Momentum keeps you updated."
        description="Notifications help you stay on top of open actions, new findings, and onboarding milestones without interrupting your flow."
      />

      <OnboardingCard>
        <View style={{ gap: spacing.sm }}>
          {notificationChoices.map((choice) => {
            const isSelected = profileDraft.notificationsEnabled === choice.value;

            return (
              <Pressable
                key={choice.title}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() =>
                  setProfileDraft({
                    notificationsEnabled: choice.value,
                    notificationPreferenceSet: true,
                  })
                }
                style={({ pressed }) => [
                  styles.choiceCard,
                  {
                    backgroundColor: isSelected ? colors.surface : colors.surfaceRaised,
                    borderColor: isSelected ? colors.signalOrange : colors.border,
                    borderRadius: radii.primary,
                    padding: spacing.md,
                  },
                  pressed ? styles.choicePressed : null,
                ]}
              >
                <Typography variant="h4">{choice.title}</Typography>
                <View style={{ height: spacing.xs }} />
                <Typography variant="body" style={{ color: colors.textSecondary }}>
                  {choice.description}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={() => {
          setOnboardingStep('summary');
          navigation.navigate('SetupSummary');
        }}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('consent');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  choiceCard: {
    borderWidth: 1,
  },
  choicePressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
});

export default NotificationPromptScreen;
