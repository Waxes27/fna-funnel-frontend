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
    setOnboardingStep('goals');
    navigation.navigate('Goals');
  };

  return (
    <OnboardingShell step={1} totalSteps={12}>
      <OnboardingHeader
        eyebrow="Welcome to Momentum FNA"
        title="Build a financial plan that fits real life."
        description="Move straight into a guided experience tailored to your next financial priorities."
      />

      <OnboardingCard>
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
