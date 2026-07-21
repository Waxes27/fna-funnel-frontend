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
import { AccountConnectionChoice, useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme';

type AccountConnectionScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'AccountConnection'>,
  'navigation'
>;

const connectionOptions: Array<{
  title: string;
  value: AccountConnectionChoice;
  description: string;
}> = [
  {
    title: 'Enter details manually',
    value: 'manual',
    description:
      'Finish setup now with your estimates and add account-level details after onboarding.',
  },
  {
    title: 'Connect accounts securely',
    value: 'secureLink',
    description:
      'Prepare for a faster fact find by linking institutions in a follow-up secure flow.',
  },
  {
    title: 'Decide later',
    value: 'later',
    description:
      'Skip account linking for now and review the summary with the data you already shared.',
  },
];

const AccountConnectionScreen: React.FC<AccountConnectionScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();

  return (
    <OnboardingShell step={15} totalSteps={16}>
      <OnboardingHeader
        eyebrow="Account connection"
        title="Choose how you want to enrich your plan next."
        description="You can continue with manual estimates now or signal that you want a connected-account experience after the initial summary."
      />

      <OnboardingCard>
        <View
          style={[
            styles.highlightCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.primary,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" withDot>
            Flexible by design
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            Your choice here only affects the next action after setup. It does not block access to
            the summary.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        <View style={{ gap: spacing.sm }}>
          {connectionOptions.map((option) => {
            const isSelected = profileDraft.accountConnectionChoice === option.value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setProfileDraft({ accountConnectionChoice: option.value })}
                style={({ pressed }) => [
                  styles.optionCard,
                  {
                    backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                    borderColor: isSelected ? colors.ink : colors.border,
                    borderRadius: radii.primary,
                    padding: spacing.md,
                  },
                  pressed ? styles.optionPressed : null,
                ]}
              >
                <Typography
                  variant="h4"
                  style={{ color: isSelected ? colors.canvas : colors.text }}
                >
                  {option.title}
                </Typography>
                <View style={{ height: spacing.xs }} />
                <Typography
                  variant="body"
                  style={{ color: isSelected ? colors.dustTaupe : colors.textSecondary }}
                >
                  {option.description}
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
          setOnboardingStep('notificationPrompt');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  highlightCard: {
    width: '100%',
    borderWidth: 1,
  },
  optionCard: {
    borderWidth: 1,
  },
  optionPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
});

export default AccountConnectionScreen;
