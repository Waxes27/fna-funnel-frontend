import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAppStore } from '../store/appStore';

export type MainStackParamList = {
  Home: undefined;
};

export type ClientTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<ClientTabParamList>();

const ClientTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Momentum FNA' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  const { user } = useAppStore();

  if (user?.role === 'CLIENT') {
    return <ClientTabNavigator />;
  }

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Momentum FNA' }} />
    </Stack.Navigator>
  );
};
