import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/Button';
import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { MenuButton } from '../components/MenuButton';
import { Surface } from '../components/Surface';
import { Typography } from '../components/Typography';
import { OverflowMenu } from '../components/OverflowMenu';
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

const TagPill: React.FC<{ label: string }> = ({ label }) => {
  const { colors, spacing } = useTheme();

  return (
    <Surface
      variant="surface"
      radius="pill"
      bordered
      style={{
        paddingHorizontal: spacing.sm,
        paddingVertical: 6,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
        alignSelf: 'flex-start',
      }}
    >
      <Typography variant="footerLink" style={{ color: colors.textSecondary }}>
        {label}
      </Typography>
    </Surface>
  );
};

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ minWidth: 92 }}>
      <Typography variant="footerHeading" style={{ color: colors.textSecondary }}>
        {label}
      </Typography>
      <View style={{ height: spacing.xs }} />
      <Typography variant="h3">{value}</Typography>
    </View>
  );
};

type DashboardTileProps = {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
};

const DashboardTile: React.FC<DashboardTileProps> = ({ title, value, icon, onPress }) => {
  const { colors, spacing } = useTheme();

  const content = (
    <Card
      padding={spacing.md}
      radius="primary"
      bordered
      style={{ backgroundColor: colors.surfaceRaised }}
    >
      <View style={styles.tileTop}>
        <Typography variant="h3" style={{ letterSpacing: -0.4 }}>
          {value}
        </Typography>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
      </View>
      <View style={{ height: spacing.sm }} />
      <Typography variant="footerHeading" style={{ color: colors.textSecondary }}>
        {title}
      </Typography>
    </Card>
  );

  if (!onPress) {
    return <View style={styles.tileWrap}>{content}</View>;
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.tileWrap}>
      {content}
    </Pressable>
  );
};

const HomeScreen = ({ navigation: _navigation }: any) => {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const profileDraft = useAppStore((state) => state.profileDraft);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { colors, spacing, radii, shadows, typography } = useTheme();

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
        useAppStore.setState({
          profile: null,
          isOnboardingComplete: false,
          onboardingStep: 'welcome',
        });
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

  const displayTitle = profile?.fullName ?? profile?.firstName ?? 'Your financial snapshot';
  const displaySubtitle = user?.email ?? 'Momentum FNA';
  const avatarLetter = (displayTitle?.trim()?.charAt(0) || 'M').toUpperCase();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxxl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: spacing.lg }}>
          <View style={styles.topBar}>
            <View style={styles.brandBadge} />
            <View style={styles.topBarRight}>
              <MenuButton iconName="ellipsis-horizontal" onPress={() => setIsMenuVisible(true)} />
            </View>
          </View>

          <View style={styles.header}>


            <Typography variant="h3">{displayTitle}</Typography>
            <View style={{ height: spacing.xs }} />

            <View style={{ height: spacing.sm }} />
            <Typography variant="body" style={{ color: colors.textSecondary }}>
              Track your profile, connect accounts, and turn your numbers into a clean financial
              plan you can act on.
            </Typography>
            <View style={{ height: spacing.xs }} />
            <Pressable
              accessibilityRole="button"
              onPress={() => setActiveTab('activity')}
              style={({ pressed }) => [styles.inlineLink, pressed ? { opacity: 0.6 } : null]}
            >
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={{ width: spacing.md }} />
            <Metric label="Goals" value={`${profileDraft.goals.length}`} />
            <View style={{ flex: 1 }} />
            <CustomButton
              title={profileMissing ? 'Continue setup' : 'Start analysis'}
              onPress={
                profileMissing
                  ? handleContinueSetup
                  : () => Alert.alert('Financial Analysis', 'Coming soon')
              }
              style={{
                borderRadius: radii.pill,
                paddingHorizontal: spacing.md,
                minWidth: 140,
              }}
            />
          </View>

          <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'overview' }}
              onPress={() => setActiveTab('overview')}
              style={[
                styles.tab,
                activeTab === 'overview'
                  ? { borderBottomColor: colors.ink }
                  : { borderBottomColor: 'transparent' },
              ]}
            >
              <Typography
                variant="h4"
                style={{ color: activeTab === 'overview' ? colors.text : colors.textSecondary }}
              >
                Overview
              </Typography>
            </Pressable>
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === 'activity' }}
              onPress={() => setActiveTab('activity')}
              style={[
                styles.tab,
                activeTab === 'activity'
                  ? { borderBottomColor: colors.ink }
                  : { borderBottomColor: 'transparent' },
              ]}
            >
              <Typography
                variant="h4"
                style={{ color: activeTab === 'activity' ? colors.text : colors.textSecondary }}
              >
                Activity
              </Typography>
            </Pressable>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.ink}
              style={{ marginTop: spacing.xl }}
              accessibilityLabel="Loading dashboard"
            />
          ) : error ? (
            <Card
              padding={spacing.lg}
              radius="frame"
              bordered
              style={{ marginTop: spacing.lg, backgroundColor: colors.surfaceRaised }}
            >
              <Typography variant="eyebrow" withDot dotColor={colors.lightSignalOrange}>
                Action needed
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
            </Card>
          ) : null}

          {activeTab === 'overview' ? (
            <View style={styles.tiles}>
              <DashboardTile title="Net worth" value="ZAR —" icon="trending-up-outline" />
              <DashboardTile title="Cash flow" value="ZAR —/mo" icon="swap-vertical-outline" />
              <DashboardTile title="Debt-to-income" value="— %" icon="stats-chart-outline" />
              <DashboardTile title="Emergency fund" value="ZAR —" icon="shield-checkmark-outline" />
              <DashboardTile title="Retirement gap" value="ZAR —" icon="hourglass-outline" />
              <DashboardTile
                title="Risk profile"
                value="Pending"
                icon="speedometer-outline"
                onPress={profileMissing ? handleContinueSetup : () => setActiveTab('activity')}
              />
            </View>
          ) : (
            <View style={{ paddingTop: spacing.lg }}>
              <Card
                padding={spacing.lg}
                radius="primary"
                bordered
                style={{ marginBottom: spacing.md }}
              >
                <View style={styles.activityRow}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color={colors.textSecondary}
                  />
                  <View style={{ width: spacing.sm }} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="h4">Session</Typography>
                    <View style={{ height: spacing.xs }} />
                    <Typography variant="body" style={{ color: colors.textSecondary }}>
                      Signed in as {displaySubtitle}.
                    </Typography>
                  </View>
                </View>
              </Card>
              <Card
                padding={spacing.lg}
                radius="primary"
                bordered
                style={{ marginBottom: spacing.md }}
              >
                <View style={styles.activityRow}>
                  <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
                  <View style={{ width: spacing.sm }} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="h4">Risk profile</Typography>
                    <View style={{ height: spacing.xs }} />
                    <Typography variant="body" style={{ color: colors.textSecondary }}>
                      {profileMissing
                        ? 'Complete onboarding to calculate your risk profile.'
                        : 'Ready to calculate once the risk quiz is available.'}
                    </Typography>
                  </View>
                </View>
              </Card>
              <Card
                padding={spacing.lg}
                radius="primary"
                bordered
                style={{ marginBottom: spacing.md }}
              >
                <View style={styles.activityRow}>
                  <Ionicons name="refresh-outline" size={20} color={colors.textSecondary} />
                  <View style={{ width: spacing.sm }} />
                  <View style={{ flex: 1 }}>
                    <Typography variant="h4">Sync</Typography>
                    <View style={{ height: spacing.xs }} />
                    <Typography variant="body" style={{ color: colors.textSecondary }}>
                      Pull the latest profile snapshot from the API when you need it.
                    </Typography>
                    <View style={{ height: spacing.md }} />
                    <CustomButton
                      title="Refresh snapshot"
                      variant="secondary"
                      onPress={handleRetryLoad}
                    />
                  </View>
                </View>
              </Card>
            </View>
          )}
        </View>
      </ScrollView>

      <OverflowMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onLogout={logout}
        onSettings={() => Alert.alert('Settings', 'Coming soon')}
        onHelp={() => Alert.alert('Help', 'Contact support at help@momentum.co.za')}
      />
    </Screen>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 12,
  },
  avatarWrap: {
    alignItems: 'flex-start',
  },
  avatar: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inlineLink: {
    alignSelf: 'flex-start',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 22,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginTop: 24,
  },
  tab: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    marginRight: 18,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  tileWrap: {
    width: '48%',
    marginBottom: 16,
  },
  tileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
