import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Option = { label: string; value: string; icon?: string };

type Props = {
  options?: Option[];
  selected?: string;
  onSelect?: (value: string) => void;
};

export default function ToggleButtonGroup({ options = [], selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onSelect && onSelect(opt.value)}
            style={[styles.button, isActive ? styles.activeButton : styles.inactiveButton]}
          >
            <Text style={[styles.buttonText, isActive ? styles.activeText : styles.inactiveText]}>
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
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
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
  activeButton: {
    backgroundColor: colors.primary,
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  activeText: {
    color: colors.white,
  },
  inactiveText: {
    color: colors.primary,
  },
});
