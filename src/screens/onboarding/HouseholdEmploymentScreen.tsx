import React, { useState } from 'react';
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
import { createEmptySpouseDraft, useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme';
import { formatEnumLabel, maritalStatusOptions } from './profileDataOptions';

type HouseholdEmploymentScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'HouseholdEmployment'>,
  'navigation'
>;

const HouseholdEmploymentScreen: React.FC<HouseholdEmploymentScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setPrimaryApplicantDraft = useAppStore((state) => state.setPrimaryApplicantDraft);
  const setSpouseDraft = useAppStore((state) => state.setSpouseDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);
  const primaryApplicant = profileDraft.primaryApplicant;

  const isMaritalStatusValid = primaryApplicant.maritalStatus.trim().length > 0;
  const isOccupationValid = primaryApplicant.occupation.trim().length > 0;
  const isIncomeValid = /^\d+$/.test(primaryApplicant.grossMonthlyIncome.trim());
  const isValid = isMaritalStatusValid && isOccupationValid && isIncomeValid;

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('financialSnapshot');
    navigation.navigate('FinancialSnapshot');
  };

  const renderSelectableOptions = (
    label: string,
    options: readonly string[],
    selectedValue: string,
  ) => (
    <View>
      <Typography variant="h4">{label}</Typography>
      <View style={{ height: spacing.sm }} />
      <View style={[styles.optionGrid, { gap: spacing.sm }]}>
        {options.map((option) => {
          const isSelected = selectedValue === option;

          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                setPrimaryApplicantDraft({ maritalStatus: option });
                if (option === 'MARRIED') {
                  setSpouseDraft({
                    applicable: true,
                    maritalStatus: 'MARRIED',
                    incomeCurrency: 'ZAR',
                  });
                } else {
                  setProfileDraft({ spouse: createEmptySpouseDraft() });
                }
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
    </View>
  );

  return (
    <OnboardingShell step={7} totalSteps={12}>
      <OnboardingHeader
        eyebrow="Household and work"
        title="Tell us about your current setup."
        description="These fields connect your household picture with the employment details used in your client profile."
      />

      <OnboardingCard>
        {renderSelectableOptions(
          'Marital status',
          maritalStatusOptions,
          primaryApplicant.maritalStatus,
        )}

        <View style={{ height: spacing.md }} />

        <Input
          label="Occupation"
          placeholder="Enter the applicant occupation"
          autoCapitalize="words"
          value={primaryApplicant.occupation}
          onChangeText={(value) => {
            setPrimaryApplicantDraft({ occupation: value });
            if (showValidation && value.trim().length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isOccupationValid ? 'Enter the applicant occupation.' : undefined
          }
        />

        <Input
          label="Gross monthly income"
          placeholder="Enter the gross monthly income in ZAR"
          keyboardType="number-pad"
          value={primaryApplicant.grossMonthlyIncome}
          onChangeText={(value) => {
            setPrimaryApplicantDraft({
              grossMonthlyIncome: value.replace(/[^\d]/g, ''),
              incomeCurrency: 'ZAR',
            });
            if (showValidation && value.replace(/[^\d]/g, '').length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isIncomeValid
              ? 'Enter the gross monthly income as a whole number.'
              : undefined
          }
        />

      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={handleContinue}
        primaryDisabled={!isValid}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('contactDetails');
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
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});

export default HouseholdEmploymentScreen;
