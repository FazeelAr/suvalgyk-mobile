import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ExpoSplashScreen from 'expo-splash-screen';
import AppNavigator from './navigation/AppNavigator';
import AppHeader from './components/AppHeader';
import SplashScreen from './screens/SplashScreen';
import { colors } from './theme/colors';

// Keep the native splash visible until JS is ready, then we'll hide it instantly
ExpoSplashScreen.preventAutoHideAsync();

import { SettingsProvider, useSettings } from './contexts/SettingsContext';

function MainContainer() {
  const insets = useSafeAreaInsets();
  const { colors } = useSettings();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingLeft: Math.max(insets.left, 0), paddingRight: Math.max(insets.right, 0) }}>
      <AppHeader title="" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);

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
      <MainContainer />
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
