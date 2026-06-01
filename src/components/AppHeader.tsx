import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import Logo from './Logo';

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: () => React.ReactNode;
};

export default function AppHeader({ title = 'Suvalgyk', showBack = false, onBack, rightAction }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeContainer, { paddingTop: insets.top }]}> 
      <View style={styles.headerBody}>
        <View style={styles.leftContainer}>
          {showBack && onBack ? (
            <TouchableOpacity onPress={onBack} activeOpacity={0.8} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.brandRow}>
              <Logo size={122} />
            </View>
          )}
        </View>

        <View style={styles.centerContainer} />

        <View style={styles.rightContainer}>{rightAction ? rightAction() : <View style={{ width: 32 }} />}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBody: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  leftContainer: {
    width: 184,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: spacing.xs,
  },
  backArrow: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '700',
  },
});
