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

type DateOfBirthScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'DateOfBirth'>,
  'navigation'
>;

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateOfBirth = (value: string) => {
  if (!datePattern.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.toISOString().slice(0, 10) === value;
};

const DateOfBirthScreen: React.FC<DateOfBirthScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const isValid = useMemo(
    () => isValidDateOfBirth(profileDraft.dateOfBirth.trim()),
    [profileDraft.dateOfBirth],
  );

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('contactDetails');
    navigation.navigate('ContactDetails');
  };

  return (
    <OnboardingShell step={5} totalSteps={13}>
      <OnboardingHeader
        eyebrow="Verify your identity"
        title="What is your date of birth?"
        description="Use the format YYYY-MM-DD so your profile can map cleanly to your client record."
      />

      <OnboardingCard>
        <Input
          label="Date of birth"
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          autoCapitalize="none"
          value={profileDraft.dateOfBirth}
          onChangeText={(value) => {
            setProfileDraft({ dateOfBirth: value });
            if (showValidation && isValidDateOfBirth(value.trim())) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isValid ? 'Enter a valid date in YYYY-MM-DD format.' : undefined
          }
        />

        <View style={{ marginTop: spacing.xs }}>
          <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
            This helps align age-sensitive planning assumptions and future regulatory details.
          </Typography>
        </View>
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={handleContinue}
        primaryDisabled={!isValid}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('legalName');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

export default DateOfBirthScreen;
