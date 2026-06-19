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

export default function AppEntry() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Immediately hide the native splash screen so our custom JS logo screen takes over
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
