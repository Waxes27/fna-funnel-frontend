import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAppStore } from '../store/appStore';
import { useTheme } from '../theme';

export type MainStackParamList = {
  Home: undefined;
};

export type ClientTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<ClientTabParamList>();

const TabBarIcon: React.FC<{
  routeName: keyof ClientTabParamList;
  focused: boolean;
  color: string;
}> = ({ routeName, focused, color }) => {
  let iconName: keyof typeof Ionicons.glyphMap;

  if (routeName === 'Home') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (routeName === 'Profile') {
    iconName = focused ? 'person' : 'person-outline';
  } else {
    iconName = 'help';
  }

  return <Ionicons name={iconName} size={22} color={color} />;
};

const ClientTabNavigator = () => {
  const { colors, typography } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => (
          <TabBarIcon routeName={route.name} focused={focused} color={color} />
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.canvas,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: typography.families.primary ?? typography.families.fallback,
          fontSize: 12,
          marginTop: 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Momentum FNA' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  const user = useAppStore((state) => state.user);

  if (user?.role === 'CLIENT') {
    return <ClientTabNavigator />;
  }

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Momentum FNA' }} />
    </Stack.Navigator>
  );
};
