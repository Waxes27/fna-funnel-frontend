import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Input from '../components/Input';
import CustomButton from '../components/Button';
import { Surface } from '../components/Surface';
import { Typography } from '../components/Typography';
import { useAppStore } from '../store/appStore';
import apiClient from '../services/apiClient';
import { Alert } from 'react-native';
import { useTheme } from '../theme';

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = ({ navigation }: any) => {
  const login = useAppStore((state) => state.login);
  const setOnboardingStep = useAppStore((state) => state.setOnboardingStep);
  const { colors, layout, spacing } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user } = response.data;

      login(user);
      if (user?.role === 'CLIENT') {
        setOnboardingStep('goals');
      }
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'An error occurred during login.',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.canvas }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={[styles.scrollContainer, { padding: spacing.lg }]}>
        <View style={[styles.inner, { maxWidth: layout.maxWidth }]}>
          <View style={[styles.headerContainer, { marginBottom: spacing.xl }]}>
            <Typography variant="h2">Welcome Back</Typography>
            <View style={{ height: spacing.xs }} />
            <Typography variant="body" style={{ color: colors.textSecondary, textAlign: 'center' }}>
              Log in to continue your financial journey.
            </Typography>
          </View>

          <Surface
            radius="frame"
            shadow="level2"
            bordered
            style={{ backgroundColor: colors.surfaceRaised, padding: spacing.lg }}
          >
            <View style={styles.formContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                    placeholder="Enter your password"
                    secureTextEntry
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.password?.message}
                  />
                )}
              />

              <CustomButton
                title="Log In"
                onPress={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
                style={{ marginTop: spacing.md, marginBottom: spacing.sm }}
              />

              <CustomButton
                title="Don't have an account? Register"
                variant="secondary"
                onPress={() => navigation.navigate('Register')}
              />
            </View>
          </Surface>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
  },
});

export default LoginScreen;
