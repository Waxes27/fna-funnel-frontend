import React from 'react';
import { StyleSheet, View } from 'react-native';
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

type ValueExplainerScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'ValueExplainer'>,
  'navigation'
>;

const valuePoints = [
  {
    title: 'Sharper recommendations',
    description: 'Your goals shape which planning insights and next actions show up first.',
  },
  {
    title: 'Less repetitive data entry',
    description:
      'We reuse the details you enter across future profile, planning, and review steps.',
  },
  {
    title: 'A profile you can refine later',
    description: 'Nothing is locked in. You can update these details as your situation changes.',
  },
];

const ValueExplainerScreen: React.FC<ValueExplainerScreenProps> = ({ navigation }) => {
  const goals = useAppStore((state) => state.profileDraft.goals);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();

  return (
    <OnboardingShell step={3} totalSteps={13}>
      <OnboardingHeader
        eyebrow="Why these questions matter"
        title="We use your answers to tailor the plan."
        description="Momentum FNA turns your priorities and profile details into a clearer starting point for advice."
      />

      <OnboardingCard>
        <View
          style={[
            styles.highlightPanel,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderRadius: radii.primary,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" withDot>
            Your selected priorities
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            {goals.length > 0
              ? goals.join(', ')
              : 'Your answers in the next steps help us personalize the setup.'}
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        {valuePoints.map((item, index) => {
          const valueRowSpacingStyle =
            index === 0
              ? styles.firstValueRow
              : {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                  marginTop: spacing.sm,
                  paddingTop: spacing.sm,
                };

          return (
            <View key={item.title} style={[styles.valueRow, valueRowSpacingStyle]}>
              <Typography variant="h4">{item.title}</Typography>
              <View style={{ height: spacing.xs }} />
              <Typography variant="body" style={{ color: colors.textSecondary }}>
                {item.description}
              </Typography>
            </View>
          );
        })}
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={() => {
          setOnboardingStep('legalName');
          navigation.navigate('LegalName');
        }}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('goals');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  highlightPanel: {
    borderWidth: 1,
  },
  valueRow: {
    width: '100%',
  },
  firstValueRow: {
    borderTopWidth: 0,
    marginTop: 0,
    paddingTop: 0,
  },
});

export default ValueExplainerScreen;
