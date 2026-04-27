import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/Button';
import { useAppStore } from '../store/appStore';

const HomeScreen = ({ navigation: _navigation }: any) => {
  const { user, logout } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Momentum FNA</Text>
      <Text style={styles.subtitle}>AI Financial Advisor Platform</Text>

      {user && <Text style={styles.userInfo}>Logged in as: {user.email}</Text>}

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
    marginBottom: 30,
    fontWeight: '500',
  },
  button: {
    marginBottom: 16,
    width: '100%',
  },
});

export default HomeScreen;
