import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/Button';

const HomeScreen = ({ navigation: _navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Momentum FNA</Text>
      <Text style={styles.subtitle}>AI Financial Advisor Platform</Text>
      <CustomButton title="Start Financial Analysis" onPress={() => console.log('Start FNA')} />
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
    marginBottom: 30,
  },
});

export default HomeScreen;
