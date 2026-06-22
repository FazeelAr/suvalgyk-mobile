import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ExpoSplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import AppHeader from './components/AppHeader';
import SplashScreen from './screens/SplashScreen';
import { colors } from './theme/colors';

// Keep the native splash visible until JS is ready, then we'll hide it instantly
ExpoSplashScreen.preventAutoHideAsync();

import { SettingsProvider, useSettings } from './contexts/SettingsContext';

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { colors } = useSettings();

  useEffect(() => {
    ExpoSplashScreen.hideAsync();
  }, []);

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppHeader title="" />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

export default function AppEntry() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
