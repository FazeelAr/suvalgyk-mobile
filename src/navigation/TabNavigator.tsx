import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../contexts/SettingsContext';

import HomeScreen from '../screens/HomeScreen';
import RecipesStackNavigator from './RecipesStackNavigator';
import BlogStackNavigator from './BlogStackNavigator';
import ContactScreen from '../screens/ContactScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { colors, t } = useSettings();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
          paddingHorizontal: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 2,
        },
      })}
    >
      <Tab.Screen
        name="Pradžia"
        component={HomeScreen}
        options={{
          tabBarLabel: t('tab.home'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Receptai"
        component={RecipesStackNavigator}
        options={{
          tabBarLabel: t('tab.recipes'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'restaurant' : 'restaurant-outline'} size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Tinklaraštis"
        component={BlogStackNavigator}
        options={{
          tabBarLabel: t('tab.blogs'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={size - 2} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Kontaktai"
        component={ContactScreen}
        options={{
          tabBarLabel: t('tab.contact'),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'mail' : 'mail-outline'} size={size - 2} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
