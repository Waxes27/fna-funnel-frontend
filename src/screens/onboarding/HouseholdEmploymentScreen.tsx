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

type HouseholdEmploymentScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'HouseholdEmployment'>,
  'navigation'
>;

const maritalStatusOptions = ['Single', 'Married', 'Partnered', 'Divorced'];
const employmentStatusOptions = ['Employed', 'Self-employed', 'Unemployed', 'Retired'];

const HouseholdEmploymentScreen: React.FC<HouseholdEmploymentScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const isMaritalStatusValid = profileDraft.maritalStatus.trim().length > 0;
  const isEmploymentStatusValid = profileDraft.employmentStatus.trim().length > 0;
  const isDependantsValid = profileDraft.numberOfDependants.trim().length > 0;
  const isOccupationValid =
    profileDraft.employmentStatus === 'Unemployed'
      ? true
      : profileDraft.occupation.trim().length > 0 && profileDraft.annualIncome.trim().length > 0;
  const isValid =
    isMaritalStatusValid && isEmploymentStatusValid && isDependantsValid && isOccupationValid;

  const householdSnapshot = useMemo(() => {
    const dependants = profileDraft.numberOfDependants || '0';
    const employment = profileDraft.employmentStatus || 'Pending';

    return `${dependants} dependant${dependants === '1' ? '' : 's'} • ${employment}`;
  }, [profileDraft.employmentStatus, profileDraft.numberOfDependants]);

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
    options: string[],
    selectedValue: string,
    draftKey: 'maritalStatus' | 'employmentStatus',
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
                setProfileDraft({ [draftKey]: option });
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
                {option}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <OnboardingShell step={7} totalSteps={13}>
      <OnboardingHeader
        eyebrow="Household and work"
        title="Tell us about your current setup."
        description="These fields connect your household picture with the employment details used in your client profile."
      />

      <OnboardingCard>
        <View
          style={[
            styles.summaryPanel,
            { backgroundColor: colors.ink, borderRadius: radii.primary, padding: spacing.md },
          ]}
        >
          <Typography variant="eyebrow" style={{ color: colors.canvas }}>
            Current snapshot
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="h3" style={{ color: colors.canvas }}>
            {householdSnapshot}
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.dustTaupe }}>
            Add the household and employment details that influence budgeting, protection, and
            affordability guidance.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        {renderSelectableOptions(
          'Marital status',
          maritalStatusOptions,
          profileDraft.maritalStatus,
          'maritalStatus',
        )}

        <View style={{ height: spacing.md }} />

        {renderSelectableOptions(
          'Employment status',
          employmentStatusOptions,
          profileDraft.employmentStatus,
          'employmentStatus',
        )}

        <View style={{ height: spacing.md }} />

        <Input
          label="Number of dependants"
          placeholder="0"
          keyboardType="number-pad"
          value={profileDraft.numberOfDependants}
          onChangeText={(value) => {
            setProfileDraft({ numberOfDependants: value.replace(/[^\d]/g, '') });
            if (showValidation && value.replace(/[^\d]/g, '').length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isDependantsValid
              ? 'Enter the number of dependants in your household.'
              : undefined
          }
        />

        <Input
          label="Occupation"
          placeholder="Enter your occupation"
          autoCapitalize="words"
          value={profileDraft.occupation}
          onChangeText={(value) => {
            setProfileDraft({ occupation: value });
            if (showValidation && value.trim().length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isOccupationValid && profileDraft.employmentStatus !== 'Unemployed'
              ? 'Enter your occupation.'
              : undefined
          }
        />

        <Input
          label="Employer"
          placeholder="Enter your employer"
          autoCapitalize="words"
          value={profileDraft.employer}
          onChangeText={(value) => setProfileDraft({ employer: value })}
        />

        <Input
          label="Annual income"
          placeholder="Enter your annual income"
          keyboardType="number-pad"
          value={profileDraft.annualIncome}
          onChangeText={(value) => {
            setProfileDraft({ annualIncome: value.replace(/[^\d]/g, '') });
            if (showValidation && value.replace(/[^\d]/g, '').length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && !isOccupationValid && profileDraft.employmentStatus !== 'Unemployed'
              ? 'Enter your annual income.'
              : undefined
          }
        />

        <Input
          label="Spouse income"
          placeholder="Optional"
          keyboardType="number-pad"
          value={profileDraft.spouseIncome}
          onChangeText={(value) => setProfileDraft({ spouseIncome: value.replace(/[^\d]/g, '') })}
        />

        <Input
          label="Household expenses"
          placeholder="Optional"
          keyboardType="number-pad"
          value={profileDraft.householdExpenses}
          onChangeText={(value) =>
            setProfileDraft({ householdExpenses: value.replace(/[^\d]/g, '') })
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
  summaryPanel: {
    width: '100%',
  },
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
