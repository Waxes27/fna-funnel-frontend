import React, { useState } from 'react';
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

type RiskQuizScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'RiskQuiz'>,
  'navigation'
>;

const riskOptions = [
  {
    title: 'Conservative',
    description: 'I value stability first and prefer a smoother ride over higher returns.',
  },
  {
    title: 'Balanced',
    description: 'I can handle some movement if it improves long-term growth potential.',
  },
  {
    title: 'Growth',
    description: 'I am comfortable with volatility when it supports stronger long-term outcomes.',
  },
  {
    title: 'Aggressive',
    description: 'I can absorb sharp swings and want to maximize upside over time.',
  },
] as const;

const RiskQuizScreen: React.FC<RiskQuizScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const hasSelection = profileDraft.riskComfort.trim().length > 0;

  const handleSelect = (value: string) => {
    setProfileDraft({ riskComfort: value });

    if (showValidation) {
      setShowValidation(false);
    }
  };

  const handleContinue = () => {
    if (!hasSelection) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('consent');
    navigation.navigate('Consent');
  };

  return (
    <OnboardingShell step={9} totalSteps={13}>
      <OnboardingHeader
        eyebrow="Risk profile"
        title="How comfortable are you with investment risk?"
        description="This first-pass answer helps tailor the language, scenarios, and nudges in your opening financial summary."
      />

      <OnboardingCard>
        <View
          style={[
            styles.summaryPanel,
            {
              backgroundColor: colors.surface,
              borderRadius: radii.primary,
              borderColor: colors.border,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" withDot>
            Why we ask
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            Risk comfort is not final advice. It gives Momentum a starting point before a full
            adviser-led fact find.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        <View style={{ gap: spacing.sm }}>
          {riskOptions.map((option) => {
            const isSelected = profileDraft.riskComfort === option.title;

            return (
              <Pressable
                key={option.title}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleSelect(option.title)}
                style={({ pressed }) => [
                  styles.optionCard,
                  {
                    backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                    borderColor: isSelected ? colors.ink : colors.border,
                    borderRadius: radii.primary,
                    padding: spacing.md,
                  },
                  pressed ? styles.optionCardPressed : null,
                ]}
              >
                <Typography
                  variant="h3"
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

        {showValidation && !hasSelection ? (
          <>
            <View style={{ height: spacing.sm }} />
            <Typography variant="footerLink" style={{ color: colors.signalOrange }}>
              Choose the option that feels closest to your comfort level.
            </Typography>
          </>
        ) : null}
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={handleContinue}
        primaryDisabled={!hasSelection}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('financialSnapshot');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  summaryPanel: {
    width: '100%',
    borderWidth: 1,
  },
  optionCard: {
    borderWidth: 1,
  },
  optionCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
});

export default RiskQuizScreen;
