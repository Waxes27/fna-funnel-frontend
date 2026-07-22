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
    () => /^\d{10}$/.test(primaryApplicant.mobileNumber.trim()),
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
    <OnboardingShell step={6} totalSteps={12}>
      <OnboardingHeader
        eyebrow="Stay connected"
        title="How should we reach you?"
        description="Capture the core contact fields used by your client profile so your plan stays actionable."
      />

      <OnboardingCard>
        <Input
          label="Mobile number"
          placeholder="0821234567"
          keyboardType="phone-pad"
          value={primaryApplicant.mobileNumber}
          onChangeText={(value) => {
            const sanitizedValue = value.replace(/[^\d]/g, '').slice(0, 10);
            setPrimaryApplicantDraft({ mobileNumber: sanitizedValue });
            if (showValidation && /^\d{10}$/.test(sanitizedValue)) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isPhoneValid
              ? 'Enter a 10 digit mobile number, for example 0821234567.'
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

const styles = {};

export default ContactDetailsScreen;
