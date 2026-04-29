import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import CustomButton from '../components/Button';
import { useAppStore } from '../store/appStore';
import apiClient from '../services/apiClient';

const HomeScreen = ({ navigation: _navigation }: any) => {
  const { user, logout } = useAppStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Momentum FNA</Text>
      <Text style={styles.subtitle}>AI Financial Advisor Platform</Text>

      {user && <Text style={styles.userInfo}>Logged in as: {user.email}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginVertical: 20 }} />
      ) : error ? (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <CustomButton 
            title="Setup Profile" 
            onPress={() => console.log('Navigate to profile setup')} 
            style={styles.setupButton}
          />
        </View>
      ) : profile ? (
        <View style={styles.profileCard}>
          <Text style={styles.profileText}>Name: {user?.firstName} {user?.lastName}</Text>
          <Text style={styles.profileText}>Role: {user?.role}</Text>
          <Text style={styles.profileText}>Occupation: {profile.occupation}</Text>
        </View>
      ) : null}

      <CustomButton
        title="Start Financial Analysis"
        onPress={() => console.log('Start FNA')}
        style={styles.button}
      />

      <CustomButton title="Log Out" variant="outline" onPress={logout} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366', // Momentum blue approximation
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#F5F7FA',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E0E5EC',
  },
  profileText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 12,
    textAlign: 'center',
  },
  setupButton: {
    width: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    marginBottom: 16,
    width: '100%',
  },
});

export default HomeScreen;
