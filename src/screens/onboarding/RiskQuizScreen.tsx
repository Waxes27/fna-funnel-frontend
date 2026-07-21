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
import {
  formatEnumLabel,
  genderOptions,
  highestEducationLevelOptions,
  provinceOptions,
  smokerStatusOptions,
  titleOptions,
} from './profileDataOptions';

type RiskQuizScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'RiskQuiz'>,
  'navigation'
>;

const RiskQuizScreen: React.FC<RiskQuizScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setSpouseDraft = useAppStore((state) => state.setSpouseDraft);
  const setSpouseAddressDraft = useAppStore((state) => state.setSpouseAddressDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);
  const spouse = profileDraft.spouse;
  const primaryApplicant = profileDraft.primaryApplicant;
  const spouseRequired = primaryApplicant.maritalStatus === 'MARRIED';

  const hasRequiredSpouseFields =
    !spouseRequired ||
    (spouse.title.trim().length > 0 &&
      spouse.firstName.trim().length >= 2 &&
      spouse.surname.trim().length >= 2 &&
      spouse.idNumber.trim().length >= 5 &&
      spouse.gender.trim().length > 0 &&
      spouse.smokerStatus.trim().length > 0 &&
      spouse.highestEducationLevel.trim().length > 0 &&
      spouse.occupation.trim().length > 0 &&
      /^\d+$/.test(spouse.grossMonthlyIncome.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(spouse.emailAddress.trim()) &&
      /^\+\d{10,15}$/.test(spouse.mobileNumber.trim()) &&
      (spouse.sameAsPrimaryApplicant ||
        (spouse.residentialAddress.addressLine1.trim().length >= 5 &&
          spouse.residentialAddress.suburb.trim().length > 0 &&
          spouse.residentialAddress.city.trim().length > 0 &&
          spouse.residentialAddress.province.trim().length > 0 &&
          spouse.residentialAddress.postalCode.trim().length >= 4 &&
          spouse.residentialAddress.country.trim().length > 0)));

  const handleContinue = () => {
    if (!hasRequiredSpouseFields) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('consent');
    navigation.navigate('Consent');
  };

  return (
    <OnboardingShell step={9} totalSteps={13}>
      <OnboardingHeader
        eyebrow="Spouse profile"
        title={
          spouseRequired ? 'Tell us about the spouse profile.' : 'No spouse profile is required.'
        }
        description={
          spouseRequired
            ? 'When the applicant is married, the onboarding flow captures the spouse personal, contact, employment, and address details too.'
            : 'The current marital status does not require spouse details, so you can continue to the next step.'
        }
      />

      <OnboardingCard>
        <View
          style={[
            styles.summaryPanel,
            {
              backgroundColor: colors.surface,
              borderRadius: radii.primary,
              borderColor: colors.border,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" withDot>
            Data model rule
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            {spouseRequired
              ? 'Spouse information becomes mandatory when the applicant marital status is marked as married.'
              : 'Spouse information only becomes mandatory for married applicants.'}
          </Typography>
        </View>

        {spouseRequired ? (
          <>
            <View style={{ height: spacing.md }} />

            <Typography variant="h4">Spouse title</Typography>
            <View style={{ height: spacing.sm }} />
            <View style={[styles.optionGrid, { gap: spacing.sm }]}>
              {titleOptions.map((option) => {
                const isSelected = spouse.title === option;

                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => {
                      setSpouseDraft({
                        applicable: true,
                        maritalStatus: 'MARRIED',
                        title: option,
                        incomeCurrency: 'ZAR',
                      });
                      if (showValidation) {
                        setShowValidation(false);
                      }
                    }}
                    style={({ pressed }) => [
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                        borderColor: isSelected ? colors.ink : colors.border,
                        borderRadius: radii.primary,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                      pressed ? styles.optionCardPressed : null,
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

            <Input
              label="Spouse first name"
              placeholder="Enter the spouse first name"
              autoCapitalize="words"
              value={spouse.firstName}
              onChangeText={(value) =>
                setSpouseDraft({ applicable: true, maritalStatus: 'MARRIED', firstName: value })
              }
              error={
                showValidation && spouse.firstName.trim().length < 2
                  ? 'Enter the spouse first name.'
                  : undefined
              }
            />

            <Input
              label="Spouse surname"
              placeholder="Enter the spouse surname"
              autoCapitalize="words"
              value={spouse.surname}
              onChangeText={(value) =>
                setSpouseDraft({ applicable: true, maritalStatus: 'MARRIED', surname: value })
              }
              error={
                showValidation && spouse.surname.trim().length < 2
                  ? 'Enter the spouse surname.'
                  : undefined
              }
            />

            <Input
              label="Spouse identity number"
              placeholder="Enter the spouse identity number"
              keyboardType="number-pad"
              value={spouse.idNumber}
              onChangeText={(value) =>
                setSpouseDraft({ applicable: true, maritalStatus: 'MARRIED', idNumber: value })
              }
              error={
                showValidation && spouse.idNumber.trim().length < 5
                  ? 'Enter the spouse identity number.'
                  : undefined
              }
            />

            <Typography variant="h4">Spouse gender</Typography>
            <View style={{ height: spacing.sm }} />
            <View style={[styles.optionGrid, { gap: spacing.sm }]}>
              {genderOptions.map((option) => {
                const isSelected = spouse.gender === option;

                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() =>
                      setSpouseDraft({ applicable: true, maritalStatus: 'MARRIED', gender: option })
                    }
                    style={({ pressed }) => [
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                        borderColor: isSelected ? colors.ink : colors.border,
                        borderRadius: radii.primary,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                      pressed ? styles.optionCardPressed : null,
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

            <Typography variant="h4">Spouse smoker status</Typography>
            <View style={{ height: spacing.sm }} />
            <View style={[styles.optionGrid, { gap: spacing.sm }]}>
              {smokerStatusOptions.map((option) => {
                const isSelected = spouse.smokerStatus === option;

                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() =>
                      setSpouseDraft({
                        applicable: true,
                        maritalStatus: 'MARRIED',
                        smokerStatus: option,
                      })
                    }
                    style={({ pressed }) => [
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                        borderColor: isSelected ? colors.ink : colors.border,
                        borderRadius: radii.primary,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                      pressed ? styles.optionCardPressed : null,
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

            <Typography variant="h4">Spouse highest education level</Typography>
            <View style={{ height: spacing.sm }} />
            <View style={{ gap: spacing.sm }}>
              {highestEducationLevelOptions.map((option) => {
                const isSelected = spouse.highestEducationLevel === option;

                return (
                  <Pressable
                    key={option}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() =>
                      setSpouseDraft({
                        applicable: true,
                        maritalStatus: 'MARRIED',
                        highestEducationLevel: option,
                      })
                    }
                    style={({ pressed }) => [
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                        borderColor: isSelected ? colors.ink : colors.border,
                        borderRadius: radii.primary,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                      pressed ? styles.optionCardPressed : null,
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

            <Input
              label="Spouse occupation"
              placeholder="Enter the spouse occupation"
              autoCapitalize="words"
              value={spouse.occupation}
              onChangeText={(value) =>
                setSpouseDraft({ applicable: true, maritalStatus: 'MARRIED', occupation: value })
              }
              error={
                showValidation && spouse.occupation.trim().length === 0
                  ? 'Enter the spouse occupation.'
                  : undefined
              }
            />

            <Input
              label="Spouse gross monthly income"
              placeholder="Enter the spouse gross monthly income in ZAR"
              keyboardType="number-pad"
              value={spouse.grossMonthlyIncome}
              onChangeText={(value) =>
                setSpouseDraft({
                  applicable: true,
                  maritalStatus: 'MARRIED',
                  grossMonthlyIncome: value.replace(/[^\d]/g, ''),
                  incomeCurrency: 'ZAR',
                })
              }
              error={
                showValidation && !/^\d+$/.test(spouse.grossMonthlyIncome.trim())
                  ? 'Enter the spouse gross monthly income.'
                  : undefined
              }
            />

            <Input
              label="Spouse email address"
              placeholder="spouse@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={spouse.emailAddress}
              onChangeText={(value) =>
                setSpouseDraft({ applicable: true, maritalStatus: 'MARRIED', emailAddress: value })
              }
              error={
                showValidation && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(spouse.emailAddress.trim())
                  ? 'Enter the spouse email address.'
                  : undefined
              }
            />

            <Input
              label="Spouse mobile number"
              placeholder="+27821234567"
              keyboardType="phone-pad"
              value={spouse.mobileNumber}
              onChangeText={(value) =>
                setSpouseDraft({ applicable: true, maritalStatus: 'MARRIED', mobileNumber: value })
              }
              error={
                showValidation && !/^\+\d{10,15}$/.test(spouse.mobileNumber.trim())
                  ? 'Enter the spouse mobile number in international format.'
                  : undefined
              }
            />

            <View style={{ height: spacing.sm }} />
            <Typography variant="h4">Spouse address</Typography>
            <View style={{ height: spacing.sm }} />
            <View style={[styles.optionGrid, { gap: spacing.sm }]}>
              {[true, false].map((sameAsPrimaryApplicant) => {
                const isSelected = spouse.sameAsPrimaryApplicant === sameAsPrimaryApplicant;
                const label = sameAsPrimaryApplicant ? 'Same as applicant' : 'Different address';

                return (
                  <Pressable
                    key={label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() =>
                      setSpouseDraft({
                        applicable: true,
                        maritalStatus: 'MARRIED',
                        sameAsPrimaryApplicant,
                      })
                    }
                    style={({ pressed }) => [
                      styles.optionCard,
                      {
                        backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                        borderColor: isSelected ? colors.ink : colors.border,
                        borderRadius: radii.primary,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                      pressed ? styles.optionCardPressed : null,
                    ]}
                  >
                    <Typography
                      variant="body"
                      style={{ color: isSelected ? colors.canvas : colors.text }}
                    >
                      {label}
                    </Typography>
                  </Pressable>
                );
              })}
            </View>

            {!spouse.sameAsPrimaryApplicant ? (
              <>
                <View style={{ height: spacing.md }} />
                <Input
                  label="Spouse address line 1"
                  placeholder="Street number and street name"
                  autoCapitalize="words"
                  value={spouse.residentialAddress.addressLine1}
                  onChangeText={(value) => setSpouseAddressDraft({ addressLine1: value })}
                  error={
                    showValidation && spouse.residentialAddress.addressLine1.trim().length < 5
                      ? 'Enter the spouse address line 1.'
                      : undefined
                  }
                />
                <Input
                  label="Spouse address line 2"
                  placeholder="Apartment, unit, or estate name"
                  autoCapitalize="words"
                  value={spouse.residentialAddress.addressLine2}
                  onChangeText={(value) => setSpouseAddressDraft({ addressLine2: value })}
                />
                <Input
                  label="Spouse suburb"
                  placeholder="Enter the spouse suburb"
                  autoCapitalize="words"
                  value={spouse.residentialAddress.suburb}
                  onChangeText={(value) => setSpouseAddressDraft({ suburb: value })}
                  error={
                    showValidation && spouse.residentialAddress.suburb.trim().length === 0
                      ? 'Enter the spouse suburb.'
                      : undefined
                  }
                />
                <Input
                  label="Spouse city"
                  placeholder="Enter the spouse city"
                  autoCapitalize="words"
                  value={spouse.residentialAddress.city}
                  onChangeText={(value) => setSpouseAddressDraft({ city: value })}
                  error={
                    showValidation && spouse.residentialAddress.city.trim().length === 0
                      ? 'Enter the spouse city.'
                      : undefined
                  }
                />
                <Typography variant="h4">Spouse province</Typography>
                <View style={{ height: spacing.sm }} />
                <View style={[styles.optionGrid, { gap: spacing.sm }]}>
                  {provinceOptions.map((option) => {
                    const isSelected = spouse.residentialAddress.province === option;

                    return (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => setSpouseAddressDraft({ province: option })}
                        style={({ pressed }) => [
                          styles.optionCard,
                          {
                            backgroundColor: isSelected ? colors.ink : colors.surfaceRaised,
                            borderColor: isSelected ? colors.ink : colors.border,
                            borderRadius: radii.primary,
                            paddingHorizontal: spacing.md,
                            paddingVertical: spacing.sm,
                          },
                          pressed ? styles.optionCardPressed : null,
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
                {showValidation && spouse.residentialAddress.province.trim().length === 0 ? (
                  <View style={{ marginBottom: spacing.md }}>
                    <Typography variant="footerLink" style={{ color: colors.signalOrange }}>
                      Select the spouse province.
                    </Typography>
                  </View>
                ) : null}
                <Input
                  label="Spouse postal code"
                  placeholder="Enter the spouse postal code"
                  keyboardType="number-pad"
                  value={spouse.residentialAddress.postalCode}
                  onChangeText={(value) =>
                    setSpouseAddressDraft({ postalCode: value.replace(/[^\d]/g, '') })
                  }
                  error={
                    showValidation && spouse.residentialAddress.postalCode.trim().length < 4
                      ? 'Enter the spouse postal code.'
                      : undefined
                  }
                />
                <Input
                  label="Spouse country"
                  placeholder="Country of residence"
                  autoCapitalize="words"
                  value={spouse.residentialAddress.country}
                  onChangeText={(value) => setSpouseAddressDraft({ country: value })}
                  error={
                    showValidation && spouse.residentialAddress.country.trim().length === 0
                      ? 'Enter the spouse country.'
                      : undefined
                  }
                />
              </>
            ) : null}

            {showValidation && !hasRequiredSpouseFields ? (
              <>
                <View style={{ height: spacing.sm }} />
                <Typography variant="footerLink" style={{ color: colors.signalOrange }}>
                  Complete all spouse fields before continuing.
                </Typography>
              </>
            ) : null}
          </>
        ) : null}
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Continue"
        onPrimaryPress={handleContinue}
        primaryDisabled={!hasRequiredSpouseFields}
        secondaryTitle="Back"
        onSecondaryPress={() => {
          setOnboardingStep('financialSnapshot');
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
  optionCard: {
    borderWidth: 1,
  },
  optionCardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
});

export default RiskQuizScreen;
