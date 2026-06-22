import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '../theme/spacing';
import { useSettings } from '../contexts/SettingsContext';

type Option = { label: string; value: string; icon?: string };

type Props = {
  options?: Option[];
  selected?: string;
  onSelect?: (value: string) => void;
};

export default function ToggleButtonGroup({ options = [], selected, onSelect }: Props) {
  const { colors } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.white, borderColor: colors.primary }]}>
      {options.map((opt) => {
        const isActive = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onSelect && onSelect(opt.value)}
            style={[styles.button, isActive ? { backgroundColor: colors.primary } : { backgroundColor: 'transparent' }]}
          >
            <Text style={[styles.buttonText, isActive ? { color: '#fff' } : { color: colors.primary }]}>
              {opt.icon ? `${opt.icon} ` : ''}
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    height: 48,
  },
  button: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
