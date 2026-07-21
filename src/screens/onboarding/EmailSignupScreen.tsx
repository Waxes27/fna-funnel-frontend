import React from 'react';
import { View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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

const emailSignupSchema = z.object({
  firstName: z.string().min(2, { message: 'Enter your first name.' }),
  email: z.string().email({ message: 'Enter a valid email address.' }),
  password: z.string().min(8, { message: 'Use at least 8 characters.' }),
});

type EmailSignupFormData = z.infer<typeof emailSignupSchema>;
type EmailSignupScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'EmailSignup'>;

const EmailSignupScreen: React.FC<EmailSignupScreenProps> = ({ navigation }) => {
  const login = useAppStore((state) => state.login);
  const currentUser = useAppStore((state) => state.user);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, spacing } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailSignupFormData>({
    resolver: zodResolver(emailSignupSchema),
    defaultValues: {
      firstName: '',
      email: currentUser?.email ?? '',
      password: '',
    },
  });

  const onSubmit = async (data: EmailSignupFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    login({
      id: currentUser?.id ?? 'new-123',
      email: data.email,
      role: 'CLIENT',
    });
    setOnboardingStep('verifyOtp');
    navigation.navigate('VerifyOtp', { email: data.email });
  };

  return (
    <OnboardingShell step={3} totalSteps={16}>
      <OnboardingHeader
        eyebrow="Secure your account"
        title="Create your sign-in details"
        description="Use an email you check regularly. We send a one-time code next so you can verify access before continuing."
      />

      <OnboardingCard>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="First name"
              placeholder="Enter your first name"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.firstName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="Create a strong password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />

        <View style={{ marginTop: spacing.xs }}>
          <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
            By continuing, you start a guided setup designed to get you to your first financial
            summary quickly.
          </Typography>
        </View>
      </OnboardingCard>

      <OnboardingActionBar
        primaryTitle="Send verification code"
        onPrimaryPress={handleSubmit(onSubmit)}
        primaryLoading={isSubmitting}
        secondaryTitle="Back"
        onSecondaryPress={() => navigation.goBack()}
      />
    </OnboardingShell>
  );
};

export default EmailSignupScreen;
