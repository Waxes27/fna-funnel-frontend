import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import CustomButton from '../components/Button';
import { Screen } from '../components/Screen';
import { Surface } from '../components/Surface';
import { Typography } from '../components/Typography';
import { OnboardingProfileDraft, OnboardingStep, useAppStore } from '../store/appStore';
import apiClient from '../services/apiClient';
import { useTheme } from '../theme';

const getResumeOnboardingStep = (profileDraft: OnboardingProfileDraft): OnboardingStep => {
  if (profileDraft.goals.length === 0) {
    return 'goals';
  }

  const primaryApplicantNameComplete =
    profileDraft.primaryApplicant.title.trim().length > 0 &&
    profileDraft.primaryApplicant.firstName.trim().length >= 2 &&
    profileDraft.primaryApplicant.surname.trim().length >= 2;

  if (!primaryApplicantNameComplete) {
    return 'legalName';
  }

  const primaryApplicantIdentityComplete =
    profileDraft.primaryApplicant.idNumber.trim().length >= 5 &&
    profileDraft.primaryApplicant.gender.trim().length > 0 &&
    profileDraft.primaryApplicant.smokerStatus.trim().length > 0 &&
    profileDraft.primaryApplicant.highestEducationLevel.trim().length > 0;

  if (!primaryApplicantIdentityComplete) {
    return 'dateOfBirth';
  }

  const hasContactDetails =
    /^\+\d{10,15}$/.test(profileDraft.primaryApplicant.mobileNumber.trim()) &&
    profileDraft.primaryApplicant.emailAddress.trim().length > 0;

  if (!hasContactDetails) {
    return 'contactDetails';
  }

  const hasEmploymentDetails =
    profileDraft.primaryApplicant.maritalStatus.trim().length > 0 &&
    profileDraft.primaryApplicant.occupation.trim().length > 0 &&
    /^\d+$/.test(profileDraft.primaryApplicant.grossMonthlyIncome.trim());

  if (!hasEmploymentDetails) {
    return 'householdEmployment';
  }

  const primaryAddress = profileDraft.primaryApplicant.residentialAddress;
  const hasPrimaryAddress =
    primaryAddress.addressLine1.trim().length >= 5 &&
    primaryAddress.suburb.trim().length > 0 &&
    primaryAddress.city.trim().length > 0 &&
    primaryAddress.province.trim().length > 0 &&
    primaryAddress.postalCode.trim().length >= 4 &&
    primaryAddress.country.trim().length > 0;

  if (!hasPrimaryAddress) {
    return 'financialSnapshot';
  }

  const spouseRequired = profileDraft.primaryApplicant.maritalStatus === 'MARRIED';
  const spouseAddress = profileDraft.spouse.residentialAddress;
  const spouseComplete =
    !spouseRequired ||
    (profileDraft.spouse.title.trim().length > 0 &&
      profileDraft.spouse.firstName.trim().length >= 2 &&
      profileDraft.spouse.surname.trim().length >= 2 &&
      profileDraft.spouse.idNumber.trim().length >= 5 &&
      profileDraft.spouse.gender.trim().length > 0 &&
      profileDraft.spouse.smokerStatus.trim().length > 0 &&
      profileDraft.spouse.highestEducationLevel.trim().length > 0 &&
      profileDraft.spouse.occupation.trim().length > 0 &&
      /^\d+$/.test(profileDraft.spouse.grossMonthlyIncome.trim()) &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileDraft.spouse.emailAddress.trim()) &&
      /^\+\d{10,15}$/.test(profileDraft.spouse.mobileNumber.trim()) &&
      (profileDraft.spouse.sameAsPrimaryApplicant ||
        (spouseAddress.addressLine1.trim().length >= 5 &&
          spouseAddress.suburb.trim().length > 0 &&
          spouseAddress.city.trim().length > 0 &&
          spouseAddress.province.trim().length > 0 &&
          spouseAddress.postalCode.trim().length >= 4 &&
          spouseAddress.country.trim().length > 0)));

  if (!spouseComplete) {
    return 'riskQuiz';
  }

  if (!profileDraft.consentAccepted) {
    return 'consent';
  }

  return 'accountConnection';
};

const HomeScreen = ({ navigation: _navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const profileDraft = useAppStore((state) => state.profileDraft);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const { colors, spacing } = useTheme();

  const loadProfile = useCallback(async () => {
    if (!user?.id) {
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProfileMissing(false);
      const response = await apiClient.get(`/profile/${user.id}`);
      setProfile(response.data);
    } catch (err: any) {
      console.error('Failed to fetch profile', err);
      setProfile(null);

      if (err.response && err.response.status === 404) {
        setProfileMissing(true);
        setError('Profile not found. Resume onboarding to finish your setup.');
      } else {
        setProfileMissing(false);
        setError('An error occurred while loading profile data.');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProfile().catch(() => undefined);
  }, [loadProfile]);

  const handleContinueSetup = () => {
    useAppStore.setState({
      isOnboardingComplete: false,
      onboardingStep: getResumeOnboardingStep(profileDraft),
    });
  };

  const handleRetryLoad = () => {
    loadProfile().catch(() => undefined);
  };

  return (
    <Screen>
      <View style={{ paddingTop: spacing.xl, paddingBottom: spacing.lg }}>
        <Typography variant="h2">Momentum FNA</Typography>
        <View style={{ height: spacing.xs }} />
        <Typography variant="body" style={{ color: colors.textSecondary }}>
          Your financial advisory workspace.
        </Typography>
      </View>

      {user ? (
        <Surface
          radius="frame"
          bordered
          style={{
            padding: spacing.lg,
            marginBottom: spacing.lg,
            backgroundColor: colors.surfaceRaised,
          }}
        >
          <Typography variant="eyebrow" withDot>
            Signed In
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body">{user.email}</Typography>
        </Surface>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color={colors.ink} style={{ marginVertical: spacing.lg }} />
      ) : error ? (
        <Surface
          radius="frame"
          bordered
          style={{
            padding: spacing.lg,
            marginBottom: spacing.lg,
            backgroundColor: colors.surfaceRaised,
          }}
        >
          <Typography variant="eyebrow" withDot dotColor={colors.lightSignalOrange}>
            Action Needed
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            {error}
          </Typography>
          <View style={{ height: spacing.lg }} />
          <CustomButton
            title={profileMissing ? 'Continue setup' : 'Try again'}
            onPress={profileMissing ? handleContinueSetup : handleRetryLoad}
          />
        </Surface>
      ) : profile ? (
        <Surface
          radius="frame"
          bordered
          style={{
            padding: spacing.lg,
            marginBottom: spacing.lg,
            backgroundColor: colors.surfaceRaised,
          }}
        >
          <Typography variant="eyebrow" withDot>
            Snapshot
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body">Role: {user?.role}</Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="body">Occupation: {profile.occupation}</Typography>
        </Surface>
      ) : null}

      <CustomButton
        title="Start Financial Analysis"
        onPress={() => console.log('Start FNA')}
        style={{ marginBottom: spacing.md }}
      />

      <CustomButton
        title="Log Out"
        variant="secondary"
        onPress={logout}
        style={{ marginBottom: spacing.md }}
      />
    </Screen>
  );
};

export default HomeScreen;
