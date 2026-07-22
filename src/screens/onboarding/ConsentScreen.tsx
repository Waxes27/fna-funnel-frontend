import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

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

type ConsentScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'Consent'>,
  'navigation'
>;

const ConsentScreen: React.FC<ConsentScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();

  const toggleConsent = () => {
    setProfileDraft({ consentAccepted: !profileDraft.consentAccepted });
  };

  return (
    <OnboardingShell step={10} totalSteps={12}>
      <OnboardingHeader
        eyebrow="Client consent"
        title="Review how your onboarding data is used."
        description="We keep this simple and transparent so you can move forward with confidence before your first recommendation view."
      />

      <OnboardingCard>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: profileDraft.consentAccepted }}
          onPress={toggleConsent}
          style={({ pressed }) => [
            styles.checkboxRow,
            {
              backgroundColor: profileDraft.consentAccepted ? colors.ink : colors.surfaceRaised,
              borderColor: profileDraft.consentAccepted ? colors.ink : colors.border,
              borderRadius: radii.primary,
              padding: spacing.md,
            },
            pressed ? styles.checkboxRowPressed : null,
          ]}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: profileDraft.consentAccepted ? colors.canvas : colors.border,
                backgroundColor: profileDraft.consentAccepted
                  ? colors.signalOrange
                  : colors.surface,
                borderRadius: radii.tiny,
              },
            ]}
          >
            {profileDraft.consentAccepted ? (
              <Ionicons name="checkmark" size={18} color={colors.canvas} />
            ) : null}
          </View>

          <View style={styles.checkboxContent}>
            <Typography
              variant="h4"
              style={{ color: profileDraft.consentAccepted ? colors.canvas : colors.text }}
            >
              I consent to Momentum FNA processing my onboarding data.
            </Typography>
            <View style={{ height: spacing.xs }} />
            <Typography
              variant="body"
              style={{
                color: profileDraft.consentAccepted ? colors.dustTaupe : colors.textSecondary,
              }}
            >
              You can update your preferences later with your adviser or inside your profile
              settings.
            </Typography>
          </View>
        </Pressable>
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Accept and continue"
        onPrimaryPress={() => {
          setOnboardingStep('notificationPrompt');
          navigation.navigate('NotificationPrompt');
        }}
        primaryVariant="consent"
        primaryDisabled={!profileDraft.consentAccepted}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('riskQuiz');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  checkboxRow: {
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxRowPressed: {
    opacity: 0.96,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContent: {
    flex: 1,
    marginLeft: 16,
  },
});

export default ConsentScreen;
