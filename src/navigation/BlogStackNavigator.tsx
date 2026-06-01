import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlogListScreen from '../screens/BlogListScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';

const Stack = createNativeStackNavigator();

export default function BlogStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BlogList" component={BlogListScreen} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
    </Stack.Navigator>
  );
}
