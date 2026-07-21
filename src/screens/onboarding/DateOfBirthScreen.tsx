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
import {
  formatEnumLabel,
  genderOptions,
  highestEducationLevelOptions,
  smokerStatusOptions,
} from './profileDataOptions';

type DateOfBirthScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'DateOfBirth'>,
  'navigation'
>;

const DateOfBirthScreen: React.FC<DateOfBirthScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setPrimaryApplicantDraft = useAppStore((state) => state.setPrimaryApplicantDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);
  const primaryApplicant = profileDraft.primaryApplicant;

  const isValid = useMemo(
    () =>
      primaryApplicant.idNumber.trim().length >= 5 &&
      primaryApplicant.gender.trim().length > 0 &&
      primaryApplicant.smokerStatus.trim().length > 0 &&
      primaryApplicant.highestEducationLevel.trim().length > 0,
    [
      primaryApplicant.gender,
      primaryApplicant.highestEducationLevel,
      primaryApplicant.idNumber,
      primaryApplicant.smokerStatus,
    ],
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
        title="Capture the applicant identity details."
        description="These fields align the onboarding flow to the profile data model for identity, smoking status, and education."
      />

      <OnboardingCard>
        <Input
          label="Identity number"
          placeholder="Enter the applicant ID or recognised identity number"
          keyboardType="number-pad"
          autoCapitalize="characters"
          value={primaryApplicant.idNumber}
          onChangeText={(value) => {
            setPrimaryApplicantDraft({ idNumber: value });
            if (showValidation && value.trim().length >= 5) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryApplicant.idNumber.trim().length < 5
              ? 'Enter a valid identity number.'
              : undefined
          }
        />

        <Typography variant="h4">Gender</Typography>
        <View style={{ height: spacing.sm }} />
        <View style={[styles.optionGrid, { gap: spacing.sm }]}>
          {genderOptions.map((option) => {
            const isSelected = primaryApplicant.gender === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  setPrimaryApplicantDraft({ gender: option });
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

        <View style={{ height: spacing.md }} />

        <Typography variant="h4">Smoker status</Typography>
        <View style={{ height: spacing.sm }} />
        <View style={[styles.optionGrid, { gap: spacing.sm }]}>
          {smokerStatusOptions.map((option) => {
            const isSelected = primaryApplicant.smokerStatus === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  setPrimaryApplicantDraft({ smokerStatus: option });
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

        <View style={{ height: spacing.md }} />

        <Typography variant="h4">Highest education level</Typography>
        <View style={{ height: spacing.sm }} />
        <View style={{ gap: spacing.sm }}>
          {highestEducationLevelOptions.map((option) => {
            const isSelected = primaryApplicant.highestEducationLevel === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  setPrimaryApplicantDraft({ highestEducationLevel: option });
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

        <View style={{ marginTop: spacing.xs }}>
          <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
            Identity and education details support downstream suitability, underwriting, and profile
            completeness.
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

export default DateOfBirthScreen;
