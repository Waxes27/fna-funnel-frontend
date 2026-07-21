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
import { useAppStore } from '../../store/appStore';
import { useTheme } from '../../theme';
import { formatEnumLabel, provinceOptions } from './profileDataOptions';

type FinancialSnapshotScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'FinancialSnapshot'>,
  'navigation'
>;

const FinancialSnapshotScreen: React.FC<FinancialSnapshotScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setPrimaryApplicantAddressDraft = useAppStore(
    (state) => state.setPrimaryApplicantAddressDraft,
  );
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);
  const primaryAddress = profileDraft.primaryApplicant.residentialAddress;

  const isValid =
    primaryAddress.addressLine1.trim().length >= 5 &&
    primaryAddress.suburb.trim().length > 0 &&
    primaryAddress.city.trim().length > 0 &&
    primaryAddress.province.trim().length > 0 &&
    primaryAddress.postalCode.trim().length >= 4 &&
    primaryAddress.country.trim().length > 0;

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('riskQuiz');
    navigation.navigate('RiskQuiz');
  };

  return (
    <OnboardingShell step={8} totalSteps={13}>
      <OnboardingHeader
        eyebrow="Residential address"
        title="Where does the applicant live?"
        description="Capture the structured residential address required by the profile model."
      />

      <OnboardingCard>
        <View
          style={[
            styles.summaryPanel,
            {
              backgroundColor: colors.surfaceRaised,
              borderRadius: radii.primary,
              borderColor: colors.border,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" withDot>
            Address model
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            The model stores street address, suburb, city, province, postal code, and country as
            separate fields for cleaner downstream processing.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        <Input
          label="Address line 1"
          placeholder="Street number and street name"
          autoCapitalize="words"
          value={primaryAddress.addressLine1}
          onChangeText={(value) => {
            setPrimaryApplicantAddressDraft({ addressLine1: value });
            if (showValidation && value.trim().length >= 5) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryAddress.addressLine1.trim().length < 5
              ? 'Enter the primary residential address line.'
              : undefined
          }
        />

        <Input
          label="Address line 2"
          placeholder="Apartment, unit, or estate name"
          autoCapitalize="words"
          value={primaryAddress.addressLine2}
          onChangeText={(value) => setPrimaryApplicantAddressDraft({ addressLine2: value })}
        />

        <Input
          label="Suburb"
          placeholder="Enter the residential suburb"
          autoCapitalize="words"
          value={primaryAddress.suburb}
          onChangeText={(value) => {
            setPrimaryApplicantAddressDraft({ suburb: value });
            if (showValidation && value.trim().length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryAddress.suburb.trim().length === 0
              ? 'Enter the residential suburb.'
              : undefined
          }
        />

        <Input
          label="City"
          placeholder="Enter the city or town"
          autoCapitalize="words"
          value={primaryAddress.city}
          onChangeText={(value) => {
            setPrimaryApplicantAddressDraft({ city: value });
            if (showValidation && value.trim().length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryAddress.city.trim().length === 0
              ? 'Enter the city or town.'
              : undefined
          }
        />

        <Typography variant="h4">Province</Typography>
        <View style={{ height: spacing.sm }} />
        <View style={[styles.optionGrid, { gap: spacing.sm }]}>
          {provinceOptions.map((option) => {
            const isSelected = primaryAddress.province === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  setPrimaryApplicantAddressDraft({ province: option });
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

        {showValidation && primaryAddress.province.trim().length === 0 ? (
          <View style={{ marginTop: spacing.xs }}>
            <Typography variant="footerLink" style={{ color: colors.signalOrange }}>
              Select the residential province.
            </Typography>
          </View>
        ) : null}

        <View style={{ height: spacing.md }} />

        <Input
          label="Postal code"
          placeholder="Enter the postal code"
          keyboardType="number-pad"
          value={primaryAddress.postalCode}
          onChangeText={(value) => {
            setPrimaryApplicantAddressDraft({ postalCode: value.replace(/[^\d]/g, '') });
            if (showValidation && value.replace(/[^\d]/g, '').length >= 4) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryAddress.postalCode.trim().length < 4
              ? 'Enter the postal code.'
              : undefined
          }
        />

        <Input
          label="Country"
          placeholder="Country of residence"
          autoCapitalize="words"
          value={primaryAddress.country}
          onChangeText={(value) => {
            setPrimaryApplicantAddressDraft({ country: value });
            if (showValidation && value.trim().length > 0) {
              setShowValidation(false);
            }
          }}
          error={
            showValidation && primaryAddress.country.trim().length === 0
              ? 'Enter the country of residence.'
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
          setOnboardingStep('householdEmployment');
          navigation.goBack();
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  summaryPanel: {
    width: '100%',
    borderWidth: 1,
  },
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

export default FinancialSnapshotScreen;
