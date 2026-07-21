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

type LegalNameScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'LegalName'>,
  'navigation'
>;

const LegalNameScreen: React.FC<LegalNameScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const fullName = profileDraft.fullName;
  const isValid = useMemo(() => fullName.trim().length >= 3, [fullName]);

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('dateOfBirth');
    navigation.navigate('DateOfBirth');
  };

  return (
    <OnboardingShell step={7} totalSteps={16}>
      <OnboardingHeader
        eyebrow="Profile basics"
        title="What is your legal name?"
        description="Use the name that appears on your identity documents so your profile stays consistent."
      />

      <OnboardingCard>
        <Input
          label="Full legal name"
          placeholder="Enter your full name"
          autoCapitalize="words"
          value={fullName}
          onChangeText={(value) => {
            setProfileDraft({ fullName: value });
            if (showValidation && value.trim().length >= 3) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isValid ? 'Enter the full name you want on your profile.' : undefined
          }
        />

        <View style={{ marginTop: spacing.xs }}>
          <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
            We use this for your client profile and any future financial planning summaries.
          </Typography>
        </View>
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={handleContinue}
        primaryDisabled={!isValid}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('valueExplainer');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

export default LegalNameScreen;
