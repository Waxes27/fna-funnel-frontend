import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
import { formatEnumLabel } from './profileDataOptions';

type SetupSummaryScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'SetupSummary'>,
  'navigation'
>;

const formatCurrency = (value: string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Not added yet';
  }

  return `R ${amount.toLocaleString('en-ZA')}`;
};

const formatFullName = (firstName: string, surname: string) =>
  [firstName, surname].filter(Boolean).join(' ').trim();

const formatAddress = (address: {
  addressLine1: string;
  addressLine2: string;
  suburb: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}) =>
  [
    address.addressLine1,
    address.addressLine2,
    address.suburb,
    address.city,
    address.province ? formatEnumLabel(address.province) : '',
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ');

const formatConnectionChoice = (value: string) => {
  switch (value) {
    case 'secureLink':
      return 'Secure account connection';
    case 'later':
      return 'Decide later';
    default:
      return 'Manual entry first';
  }
};

const summaryRows = (profileDraft: ReturnType<typeof useAppStore.getState>['profileDraft']) => [
  {
    label: 'Primary goals',
    value: profileDraft.goals.length > 0 ? profileDraft.goals.join(' • ') : 'No goals selected',
  },
  {
    label: 'Applicant name',
    value:
      formatFullName(
        profileDraft.primaryApplicant.firstName,
        profileDraft.primaryApplicant.surname,
      ) || 'Not added yet',
  },
  {
    label: 'Applicant identity',
    value: profileDraft.primaryApplicant.idNumber || 'Not added yet',
  },
  {
    label: 'Applicant profile',
    value:
      [
        profileDraft.primaryApplicant.title
          ? formatEnumLabel(profileDraft.primaryApplicant.title)
          : '',
        profileDraft.primaryApplicant.gender
          ? formatEnumLabel(profileDraft.primaryApplicant.gender)
          : '',
        profileDraft.primaryApplicant.smokerStatus
          ? formatEnumLabel(profileDraft.primaryApplicant.smokerStatus)
          : '',
      ]
        .filter(Boolean)
        .join(' • ') || 'Not added yet',
  },
  {
    label: 'Applicant education',
    value: profileDraft.primaryApplicant.highestEducationLevel
      ? formatEnumLabel(profileDraft.primaryApplicant.highestEducationLevel)
      : 'Not added yet',
  },
  {
    label: 'Applicant contact',
    value:
      [profileDraft.primaryApplicant.emailAddress, profileDraft.primaryApplicant.mobileNumber]
        .filter(Boolean)
        .join(' • ') || 'Not added yet',
  },
  {
    label: 'Applicant employment',
    value:
      [
        profileDraft.primaryApplicant.maritalStatus
          ? formatEnumLabel(profileDraft.primaryApplicant.maritalStatus)
          : '',
        profileDraft.primaryApplicant.occupation,
        profileDraft.primaryApplicant.grossMonthlyIncome
          ? `${formatCurrency(profileDraft.primaryApplicant.grossMonthlyIncome)} gross monthly`
          : '',
      ]
        .filter(Boolean)
        .join(' • ') || 'Not added yet',
  },
  {
    label: 'Applicant address',
    value: formatAddress(profileDraft.primaryApplicant.residentialAddress) || 'Not added yet',
  },
  {
    label: 'Spouse profile',
    value: profileDraft.spouse.applicable
      ? formatFullName(profileDraft.spouse.firstName, profileDraft.spouse.surname) || 'Pending'
      : 'Not required',
  },
  {
    label: 'Spouse address',
    value: !profileDraft.spouse.applicable
      ? 'Not required'
      : profileDraft.spouse.sameAsPrimaryApplicant
        ? 'Same as applicant'
        : formatAddress(profileDraft.spouse.residentialAddress) || 'Pending',
  },
  {
    label: 'Account connection',
    value: formatConnectionChoice(profileDraft.accountConnectionChoice),
  },
];

const SetupSummaryScreen: React.FC<SetupSummaryScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();

  const rows = summaryRows(profileDraft);

  return (
    <OnboardingShell step={13} totalSteps={13}>
      <OnboardingHeader
        eyebrow="You're ready"
        title="Your first financial summary is prepared."
        description="Momentum has enough context to open the app with a tailored snapshot and clear next steps."
      />

      <OnboardingCard>
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: colors.ink,
              borderRadius: radii.primary,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" style={{ color: colors.canvas }}>
            Setup complete
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="h3" style={{ color: colors.canvas }}>
            {formatFullName(
              profileDraft.primaryApplicant.firstName,
              profileDraft.primaryApplicant.surname,
            ) || 'Your Momentum profile'}{' '}
            is ready for the main app.
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.dustTaupe }}>
            Review the essentials below, then continue into your financial summary dashboard.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        <View style={[styles.statusRow, { gap: spacing.sm }]}>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: profileDraft.consentAccepted
                  ? colors.surface
                  : colors.surfaceRaised,
                borderColor: profileDraft.consentAccepted ? colors.signalOrange : colors.border,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Typography variant="footerHeading">
              {profileDraft.consentAccepted ? 'Consent accepted' : 'Consent pending'}
            </Typography>
          </View>

          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: profileDraft.notificationsEnabled
                  ? colors.surface
                  : colors.surfaceRaised,
                borderColor: profileDraft.notificationsEnabled
                  ? colors.signalOrange
                  : colors.border,
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Typography variant="footerHeading">
              {profileDraft.notificationsEnabled ? 'Alerts on' : 'Alerts off'}
            </Typography>
          </View>
        </View>

        <View style={{ height: spacing.md }} />

        <View style={{ gap: spacing.sm }}>
          {rows.map((row) => (
            <View
              key={row.label}
              style={[
                styles.summaryRow,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radii.primary,
                  padding: spacing.md,
                },
              ]}
            >
              <Typography variant="footerHeading" style={{ color: colors.textSecondary }}>
                {row.label}
              </Typography>
              <View style={{ height: spacing.xs }} />
              <Typography variant="body">{row.value}</Typography>
            </View>
          ))}
        </View>
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="See my financial summary"
        onPrimaryPress={completeOnboarding}
        secondaryTitle="Review details"
        onSecondaryPress={() => {
          setOnboardingStep('financialSnapshot');
          navigation.navigate('FinancialSnapshot');
        }}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusPill: {
    borderWidth: 1,
  },
  summaryRow: {
    width: '100%',
    borderWidth: 1,
  },
});

export default SetupSummaryScreen;
