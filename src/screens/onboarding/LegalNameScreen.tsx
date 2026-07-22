import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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
import { formatEnumLabel, titleOptions } from './profileDataOptions';

type LegalNameScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'LegalName'>,
  'navigation'
>;

const LegalNameScreen: React.FC<LegalNameScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setPrimaryApplicantDraft = useAppStore((state) => state.setPrimaryApplicantDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const primaryApplicant = profileDraft.primaryApplicant;
  const isValid = useMemo(
    () =>
      primaryApplicant.title.trim().length > 0 &&
      primaryApplicant.firstName.trim().length >= 2 &&
      primaryApplicant.surname.trim().length >= 2,
    [primaryApplicant.firstName, primaryApplicant.surname, primaryApplicant.title],
  );

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('dateOfBirth');
    navigation.navigate('DateOfBirth');
  };

  return (
    <OnboardingShell step={4} totalSteps={12}>
      <OnboardingHeader
        eyebrow="Profile basics"
        title="What name appears on your identity document?"
        description="Capture the title, first name, and surname exactly as they should appear on the applicant profile."
      />

      <OnboardingCard>
        <Typography variant="h4">Title</Typography>
        <View style={{ height: spacing.sm }} />
        <View style={[styles.optionGrid, { gap: spacing.sm }]}>
          {titleOptions.map((option) => {
            const isSelected = primaryApplicant.title === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  setPrimaryApplicantDraft({ title: option });
                  if (showValidation) {
                    setShowValidation(false);
                  }
                }}
                style={({ pressed }) => [
                  styles.optionChip,
                  {
                    borderRadius: radii.primary,
                    borderColor: isSelected ? colors.ink : colors.border,
                    backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                  },
                  pressed ? styles.optionChipPressed : null,
                ]}
              >
                <Typography
                  variant="body"
                  style={{ color: isSelected ? colors.canvas : colors.text }}
                >
                  {formatEnumLabel(option)}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        {showValidation && !primaryApplicant.title ? (
          <View style={{ marginTop: spacing.xs }}>
            <Typography variant="footerLink" style={{ color: colors.signalOrange }}>
              Select the applicant title.
            </Typography>
          </View>
        ) : null}

        <View style={{ height: spacing.md }} />

        <Input
          label="First name"
          placeholder="Enter the applicant's first name"
          autoCapitalize="words"
          value={primaryApplicant.firstName}
          onChangeText={(value) => {
            setPrimaryApplicantDraft({ firstName: value });
            if (showValidation && value.trim().length >= 3) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryApplicant.firstName.trim().length < 2
              ? 'Enter the applicant first name.'
              : undefined
          }
        />

        <Input
          label="Surname"
          placeholder="Enter the applicant's surname"
          autoCapitalize="words"
          value={primaryApplicant.surname}
          onChangeText={(value) => {
            setPrimaryApplicantDraft({ surname: value });
            if (showValidation && value.trim().length >= 2) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryApplicant.surname.trim().length < 2
              ? 'Enter the applicant surname.'
              : undefined
          }
        />

        <View style={{ marginTop: spacing.xs }}>
          <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
            These values feed the primary applicant profile and summary screens.
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

const styles = StyleSheet.create({
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionChip: {
    borderWidth: 1,
  },
  optionChipPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },
});

export default LegalNameScreen;
