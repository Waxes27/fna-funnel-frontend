import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

type FinancialSnapshotScreenProps = Pick<
  NativeStackScreenProps<OnboardingStackParamList, 'FinancialSnapshot'>,
  'navigation'
>;

const formatCurrency = (value: string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return '—';
  }

  return `R ${amount.toLocaleString('en-ZA')}`;
};

const FinancialSnapshotScreen: React.FC<FinancialSnapshotScreenProps> = ({ navigation }) => {
  const profileDraft = useAppStore((state) => state.profileDraft);
  const setProfileDraft = useAppStore((state) => state.setProfileDraft);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, radii, spacing } = useTheme();
  const [showValidation, setShowValidation] = useState(false);

  const monthlyIncome = profileDraft.monthlyIncome || profileDraft.annualIncome;
  const monthlyExpenses = profileDraft.monthlyExpenses || profileDraft.householdExpenses;
  const debtEstimate = profileDraft.debtEstimate;

  const isValid =
    monthlyIncome.trim().length > 0 &&
    monthlyExpenses.trim().length > 0 &&
    debtEstimate.trim().length > 0;

  const monthlySurplus = useMemo(() => {
    const income = Number(monthlyIncome || 0);
    const expenses = Number(monthlyExpenses || 0);

    if (!Number.isFinite(income) || !Number.isFinite(expenses) || income <= 0) {
      return 'Add your numbers to estimate your free cash flow.';
    }

    const difference = income - expenses;

    if (difference >= 0) {
      return `${formatCurrency(String(difference))} estimated monthly surplus`;
    }

    return `${formatCurrency(String(Math.abs(difference)))} monthly gap to review`;
  }, [monthlyExpenses, monthlyIncome]);

  const updateNumericField = (
    key: 'monthlyIncome' | 'monthlyExpenses' | 'debtEstimate',
    value: string,
  ) => {
    setProfileDraft({ [key]: value.replace(/[^\d]/g, '') });

    if (showValidation) {
      setShowValidation(false);
    }
  };

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      return;
    }

    setOnboardingStep('riskQuiz');
    navigation.navigate('RiskQuiz');
  };

  return (
    <OnboardingShell step={11} totalSteps={16}>
      <OnboardingHeader
        eyebrow="Financial snapshot"
        title="Capture the numbers that shape your plan."
        description="Start with a simple monthly picture so Momentum can surface cash-flow, debt, and affordability guidance in your first summary."
      />

      <OnboardingCard>
        <View
          style={[
            styles.summaryPanel,
            {
              backgroundColor: colors.ink,
              borderRadius: radii.primary,
              padding: spacing.md,
            },
          ]}
        >
          <Typography variant="eyebrow" style={{ color: colors.canvas }}>
            Quick estimate
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="h3" style={{ color: colors.canvas }}>
            {monthlySurplus}
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.dustTaupe }}>
            We use this snapshot to frame early recommendations before deeper account linking and
            adviser review.
          </Typography>
        </View>

        <View style={{ height: spacing.md }} />

        <Input
          label="Monthly income"
          placeholder="Enter your monthly income"
          keyboardType="number-pad"
          value={monthlyIncome}
          onChangeText={(value) => updateNumericField('monthlyIncome', value)}
          error={
            showValidation && monthlyIncome.trim().length === 0
              ? 'Enter your monthly income.'
              : undefined
          }
        />

        <Input
          label="Monthly expenses"
          placeholder="Enter your monthly expenses"
          keyboardType="number-pad"
          value={monthlyExpenses}
          onChangeText={(value) => updateNumericField('monthlyExpenses', value)}
          error={
            showValidation && monthlyExpenses.trim().length === 0
              ? 'Enter your monthly expenses.'
              : undefined
          }
        />

        <Input
          label="Outstanding debt estimate"
          placeholder="Credit cards, loans, and other debt"
          keyboardType="number-pad"
          value={debtEstimate}
          onChangeText={(value) => updateNumericField('debtEstimate', value)}
          error={
            showValidation && debtEstimate.trim().length === 0
              ? 'Enter your debt estimate.'
              : undefined
          }
        />

        <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
          Use rough values if needed. You can refine these once your accounts are connected.
        </Typography>
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
  },
});

export default FinancialSnapshotScreen;
