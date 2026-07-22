import React, { useMemo, useState } from 'react';
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

type GoalsScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'Goals'>,
  'navigation'
>;

const goalOptions = [
  'Protect my family',
  'Reduce debt',
  'Plan retirement',
  'Understand my risks',
  'Improve cash flow',
];

const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const hasSelection = profileDraft.goals.length > 0;
  const selectedGoalsLabel = useMemo(() => profileDraft.goals.join(' • '), [profileDraft.goals]);

  const toggleGoal = (goal: string) => {
    const nextGoals = profileDraft.goals.includes(goal)
      ? profileDraft.goals.filter((item) => item !== goal)
      : [...profileDraft.goals, goal];

    setProfileDraft({ goals: nextGoals });

    if (nextGoals.length > 0) {
      setShowValidation(false);
    }
  };

  const handleContinue = () => {
    if (!hasSelection) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('valueExplainer');
    navigation.navigate('ValueExplainer');
  };

  return (
    <OnboardingShell step={2} totalSteps={12}>
      <OnboardingHeader
        eyebrow="Personalize your plan"
        title="What brought you here?"
        description="Pick the priorities you want Momentum FNA to focus on first. You can select more than one."
      />

      <OnboardingCard>
        <View
          style={[
            styles.summaryPanel,
            { backgroundColor: colors.ink, borderRadius: radii.primary, padding: spacing.md },
          ]}
        >
          <Typography variant="eyebrow" style={{ color: colors.canvas }}>
            Focus areas
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="h3" style={{ color: colors.canvas }}>
            Shape the onboarding around your real goals.
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.dustTaupe }}>
            Selected goals guide the explanations and prompts in the next steps.
          </Typography>
          {hasSelection ? (
            <>
              <View style={{ height: spacing.sm }} />
              <Typography variant="footerLink" style={{ color: colors.canvas }}>
                {selectedGoalsLabel}
              </Typography>
            </>
          ) : null}
        </View>

        <View style={{ height: spacing.md }} />

        <View style={[styles.chips, { gap: spacing.sm }]}>
          {goalOptions.map((goal) => {
            const isSelected = profileDraft.goals.includes(goal);

            return (
              <Pressable
                key={goal}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => toggleGoal(goal)}
                style={({ pressed }) => [
                  styles.goalChip,
                  {
                    borderRadius: radii.primary,
                    borderColor: isSelected ? colors.ink : colors.border,
                    backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  },
                  pressed ? styles.goalChipPressed : null,
                ]}
              >
                <Typography
                  variant="body"
                  style={{ color: isSelected ? colors.canvas : colors.text }}
                >
                  {goal}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {showValidation && !hasSelection ? (
          <>
            <View style={{ height: spacing.sm }} />
            <Typography variant="footerLink" style={{ color: colors.signalOrange }}>
              Choose at least one goal before continuing.
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
          setOnboardingStep('welcome');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  summaryPanel: {
    width: '100%',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  goalChip: {
    borderWidth: 1,
  },
  goalChipPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});

export default GoalsScreen;
