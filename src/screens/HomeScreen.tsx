import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import CustomButton from '../components/Button';
import { Screen } from '../components/Screen';
import { Surface } from '../components/Surface';
import { Typography } from '../components/Typography';
import { useAppStore } from '../store/appStore';
import apiClient from '../services/apiClient';
import { useTheme } from '../theme';

const HomeScreen = ({ navigation: _navigation }: any) => {
  const { user, logout } = useAppStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, spacing } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get(`/profile/${user.id}`);
        setProfile(response.data);
      } catch (err: any) {
        console.error('Failed to fetch profile', err);
        if (err.response && err.response.status === 404) {
          setError('Profile not found. Please complete your setup.');
        } else {
          setError('An error occurred while loading profile data.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

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
          style={{ padding: spacing.lg, marginBottom: spacing.lg, backgroundColor: colors.surfaceRaised }}
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
          style={{ padding: spacing.lg, marginBottom: spacing.lg, backgroundColor: colors.surfaceRaised }}
        >
          <Typography variant="eyebrow" withDot dotColor={colors.lightSignalOrange}>
            Action Needed
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body" style={{ color: colors.textSecondary }}>
            {error}
          </Typography>
          <View style={{ height: spacing.lg }} />
          <CustomButton title="Setup Profile" onPress={() => console.log('Navigate to profile setup')} />
        </Surface>
      ) : profile ? (
        <Surface
          radius="frame"
          bordered
          style={{ padding: spacing.lg, marginBottom: spacing.lg, backgroundColor: colors.surfaceRaised }}
        >
          <Typography variant="eyebrow" withDot>
            Snapshot
          </Typography>
          <View style={{ height: spacing.sm }} />
          <Typography variant="body">
            Role: {user?.role}
          </Typography>
          <View style={{ height: spacing.xs }} />
          <Typography variant="body">Occupation: {profile.occupation}</Typography>
        </Surface>
      ) : null}

      <CustomButton
        title="Start Financial Analysis"
        onPress={() => console.log('Start FNA')}
        style={{ marginBottom: spacing.md }}
      />

      <CustomButton title="Log Out" variant="secondary" onPress={logout} style={{ marginBottom: spacing.md }} />
    </Screen>
  );
};

export default HomeScreen;
