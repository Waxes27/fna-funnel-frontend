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
    label: 'Monthly income',
    value: formatCurrency(profileDraft.monthlyIncome || profileDraft.annualIncome),
  },
  {
    label: 'Monthly expenses',
    value: formatCurrency(profileDraft.monthlyExpenses || profileDraft.householdExpenses),
  },
  {
    label: 'Debt estimate',
    value: formatCurrency(profileDraft.debtEstimate),
  },
  {
    label: 'Risk comfort',
    value: profileDraft.riskComfort || 'Not selected',
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
    <OnboardingShell step={16} totalSteps={16}>
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
            {profileDraft.fullName || 'Your Momentum profile'} is ready for the main app.
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
