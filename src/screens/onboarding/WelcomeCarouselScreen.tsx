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

type WelcomeCarouselScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

const highlights = [
  {
    title: 'One clear starting point',
    description: 'Answer a few guided questions and build a plan without jumping through menus.',
  },
  {
    title: 'Advice that adapts',
    description: 'Keep your progress in one place so your next steps stay tailored to your goals.',
  },
  {
    title: 'Designed for momentum',
    description: 'Move from setup to insight with focused screens, clear copy, and simple actions.',
  },
];

const WelcomeCarouselScreen: React.FC<WelcomeCarouselScreenProps> = ({ navigation }) => {
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, spacing } = useTheme();

  const handleContinue = () => {
    setOnboardingStep('signupMethod');
    navigation.navigate('SignupMethod');
  };

  return (
    <OnboardingShell step={1} totalSteps={16}>
      <OnboardingHeader
        eyebrow="Welcome to Momentum FNA"
        title="Build a financial plan that fits real life."
        description="Set up your account, verify your email, and unlock a guided experience tailored to your next financial priorities."
      />

      <OnboardingCard>
        <View style={[styles.heroPanel, { backgroundColor: colors.ink }]}>
          <Typography variant="eyebrow" style={{ color: colors.canvas }}>
            Guided Setup
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="h3" style={{ color: colors.canvas }}>
            From first details to first insight in one flow.
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.dustTaupe }}>
            Your onboarding stays focused, progressive, and consistent with the rest of the app.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        {highlights.map((item, index) => {
          const highlightSpacingStyle =
            index === 0
              ? styles.firstHighlightRow
              : {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                  paddingTop: spacing.sm,
                  marginTop: spacing.sm,
                };

          return (
            <View key={item.title} style={[styles.highlightRow, highlightSpacingStyle]}>
              <Typography variant="h4">{item.title}</Typography>
              <View style={{ height: spacing.xs }} />
              <Typography variant="body" style={{ color: colors.textSecondary }}>
                {item.description}
              </Typography>
            </View>
          );
        })}
      </OnboardingCard>

      <OnboardingActionBar primaryTitle="Get started" onPrimaryPress={handleContinue} />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  heroPanel: {
    borderRadius: 28,
    padding: 24,
  },
  highlightRow: {
    width: '100%',
  },
  firstHighlightRow: {
    borderTopWidth: 0,
    marginTop: 0,
    paddingTop: 0,
  },
});

export default WelcomeCarouselScreen;
