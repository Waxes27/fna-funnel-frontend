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
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const isEmailValid = useMemo(
    () => emailPattern.test(profileDraft.email.trim()),
    [profileDraft.email],
  );
  const isPhoneValid = useMemo(
    () => profileDraft.mobileNumber.replace(/\D/g, '').length >= 10,
    [profileDraft.mobileNumber],
  );
  const isAddressValid = useMemo(
    () => profileDraft.residentialAddress.trim().length >= 8,
    [profileDraft.residentialAddress],
  );
  const isValid = isEmailValid && isPhoneValid && isAddressValid;

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
            We store your email, mobile number, and residential address for future reviews and
            follow-up.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        <Input
          label="Mobile number"
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={profileDraft.mobileNumber}
          onChangeText={(value) => {
            setProfileDraft({ mobileNumber: value });
            if (showValidation && value.replace(/\D/g, '').length >= 10) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isPhoneValid
              ? 'Enter a mobile number with at least 10 digits.'
              : undefined
          }
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={profileDraft.email}
          onChangeText={(value) => {
            setProfileDraft({ email: value });
            if (showValidation && emailPattern.test(value.trim())) {
              setShowValidation(false);
            }
          }}
          error={showValidation && !isEmailValid ? 'Enter a valid email address.' : undefined}
        />

        <Input
          label="Residential address"
          placeholder="Enter your residential address"
          autoCapitalize="words"
          multiline
          value={profileDraft.residentialAddress}
          onChangeText={(value) => {
            setProfileDraft({ residentialAddress: value });
            if (showValidation && value.trim().length >= 8) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isAddressValid
              ? 'Enter the address you want saved to your profile.'
              : undefined
          }
          style={styles.addressInput}
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
  addressInput: {
    minHeight: 96,
    textAlignVertical: 'top' as const,
  },
};

export default ContactDetailsScreen;
