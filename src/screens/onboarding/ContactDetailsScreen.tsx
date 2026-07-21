import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Input from '../../components/Input';
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

type ContactDetailsScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'ContactDetails'>,
  'navigation'
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactDetailsScreen: React.FC<ContactDetailsScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setPrimaryApplicantDraft = useAppStore((state) => state.setPrimaryApplicantDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);
  const primaryApplicant = profileDraft.primaryApplicant;

  const isEmailValid = useMemo(
    () => emailPattern.test(primaryApplicant.emailAddress.trim()),
    [primaryApplicant.emailAddress],
  );
  const isPhoneValid = useMemo(
    () => /^\+\d{10,15}$/.test(primaryApplicant.mobileNumber.trim()),
    [primaryApplicant.mobileNumber],
  );
  const isValid = isEmailValid && isPhoneValid;

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('householdEmployment');
    navigation.navigate('HouseholdEmployment');
  };

  return (
    <OnboardingShell step={6} totalSteps={13}>
      <OnboardingHeader
        eyebrow="Stay connected"
        title="How should we reach you?"
        description="Capture the core contact fields used by your client profile so your plan stays actionable."
      />

      <OnboardingCard>
        <View
          style={[
            styles.noticePanel,
            {
              backgroundColor: colors.surfaceRaised,
              borderColor: colors.border,
              borderRadius: radii.primary,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" withDot>
            Client profile fields
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            We store the applicant email address and mobile number in international format for
            profile updates and adviser follow-up.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        <Input
          label="Mobile number"
          placeholder="+27821234567"
          keyboardType="phone-pad"
          value={primaryApplicant.mobileNumber}
          onChangeText={(value) => {
            setPrimaryApplicantDraft({ mobileNumber: value });
            if (showValidation && /^\+\d{10,15}$/.test(value.trim())) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isPhoneValid
              ? 'Enter the mobile number in international format, for example +27821234567.'
              : undefined
          }
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={primaryApplicant.emailAddress}
          onChangeText={(value) => {
            setPrimaryApplicantDraft({ emailAddress: value });
            if (showValidation && emailPattern.test(value.trim())) {
              setShowValidation(false);
            }
          }}
          error={showValidation && !isEmailValid ? 'Enter a valid email address.' : undefined}
        />
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={handleContinue}
        primaryDisabled={!isValid}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('dateOfBirth');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = {
  noticePanel: {
    borderWidth: 1,
  },
};

export default ContactDetailsScreen;
