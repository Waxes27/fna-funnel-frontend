import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import CustomButton from '../../components/Button';
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

type OtpVerificationScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'VerifyOtp'>;

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({ navigation, route }) => {
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const userEmail = useAppStore((state) => state.user?.email);
  const { colors, spacing, radii } = useTheme();
  const [verificationCode, setVerificationCode] = useState('');
  const [showError, setShowError] = useState(false);
  const [resent, setResent] = useState(false);

  const email = route.params?.email ?? userEmail ?? 'your email';

  const isCodeValid = useMemo(() => verificationCode.length === 6, [verificationCode]);

  const handleCodeChange = (value: string) => {
    const nextValue = value.replace(/\D/g, '').slice(0, 6);

    setVerificationCode(nextValue);
    setShowError(false);
    if (resent) {
      setResent(false);
    }
  };

  const handleVerify = () => {
    if (!isCodeValid) {
      setShowError(true);
      return;
    }

    setOnboardingStep('goals');
    navigation.navigate('Goals');
  };

  const handleBack = () => {
    setOnboardingStep('signupMethod');
    navigation.goBack();
  };

  const handleResend = () => {
    setVerificationCode('');
    setShowError(false);
    setResent(true);
  };

  return (
    <OnboardingShell step={4} totalSteps={16}>
      <OnboardingHeader
        eyebrow="Verify your email"
        title="Enter the 6-digit code"
        description={`We sent a verification code to ${email}. Enter it below to unlock the rest of your guided setup.`}
      />

      <OnboardingCard>
        <Input
          label="Verification code"
          accessibilityLabel="Verification code"
          placeholder="123456"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
          value={verificationCode}
          onChangeText={handleCodeChange}
          maxLength={6}
          error={showError ? 'Enter the 6-digit code to continue.' : undefined}
        />

        <View style={[styles.codePreviewRow, { marginTop: spacing.xs, gap: spacing.xs }]}>
          {Array.from({ length: 6 }).map((_, index) => {
            const character = verificationCode[index] ?? '';
            const isFilled = Boolean(character);

            return (
              <View
                key={`otp-character-${index}`}
                style={[
                  styles.codePreviewCell,
                  {
                    borderColor: isFilled ? colors.ink : colors.border,
                    backgroundColor: isFilled ? colors.surfaceRaised : colors.canvas,
                    borderRadius: radii.primary,
                  },
                ]}
              >
                <Typography variant="h3">{character || '·'}</Typography>
              </View>
            );
          })}
        </View>

        <View style={{ height: spacing.md }} />

        <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
          Codes usually arrive within a minute. If it does not, request a fresh one and try again.
        </Typography>

        {resent ? (
          <View style={{ marginTop: spacing.sm }}>
            <Typography variant="footerLink" style={{ color: colors.signalOrange }}>
              A new code is ready to use.
            </Typography>
          </View>
        ) : null}

        <View style={{ marginTop: spacing.md }}>
          <CustomButton title="Resend code" variant="outline" onPress={handleResend} />
        </View>
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Verify code"
        onPrimaryPress={handleVerify}
        primaryDisabled={!isCodeValid}
        secondaryTitle="Back"
        onSecondaryPress={handleBack}
      />
    </OnboardingShell>
  );
};

const styles = StyleSheet.create({
  codePreviewRow: {
    flexDirection: 'row',
  },
  codePreviewCell: {
    flex: 1,
    minHeight: 56,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OtpVerificationScreen;
