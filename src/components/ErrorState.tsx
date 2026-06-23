import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { colors, t } = useSettings();

  return (
    <View style={styles.container}>
      <View style={[
        styles.card, 
        { 
          backgroundColor: `${colors.primary}0D`, // ~5% opacity
          borderColor: `${colors.primary}80`,     // ~50% opacity
        }
      ]}>
        <Text style={styles.emoji}>😔</Text>
        <Text style={[styles.message, { color: colors.textPrimary }]}>
          {message || t('common.error') || 'Nepavyko užkrauti duomenų'}
        </Text>
        {onRetry && (
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.primary }]} 
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>↻ {t('common.retry') || 'Bandykite dar kartą'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    gap: 24,
  },
  emoji: {
    fontSize: 48,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
