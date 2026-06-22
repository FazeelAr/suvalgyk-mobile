import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../contexts/SettingsContext';
import { spacing } from '../theme/spacing';
import Logo from './Logo';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: () => React.ReactNode;
};

export default function AppHeader({ title = 'Suvalgyk', showBack = false, onBack, rightAction }: Props) {
  const insets = useSafeAreaInsets();
  const { theme, language, setTheme, setLanguage, colors, t } = useSettings();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <View style={[styles.safeContainer, { paddingTop: insets.top, backgroundColor: colors.white, borderBottomColor: colors.border }]}> 
        <View style={styles.headerBody}>
          <View style={styles.leftContainer}>
            {showBack && onBack ? (
              <TouchableOpacity onPress={onBack} activeOpacity={0.8} style={styles.iconButton}>
                <Text style={[styles.iconText, { color: colors.primary }]}>←</Text>
              </TouchableOpacity>
            ) : (
              <Logo size={122} />
            )}
          </View>

          <View style={styles.rightContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {rightAction && rightAction()}
              <TouchableOpacity onPress={() => setShowSettings(true)} activeOpacity={0.8} style={styles.iconButton}>
                <Ionicons name="settings-sharp" size={26} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <Modal
        visible={showSettings}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowSettings(false)}>
          <View style={[styles.dropdownCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.dropdownTitle, { color: colors.textPrimary }]}>{t('settings.title')}</Text>
            
            <View style={styles.settingGroup}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>{t('settings.theme')}</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={[styles.optionBtn, theme === 'light' ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}
                  onPress={() => { setTheme('light'); setShowSettings(false); }}
                >
                  <Text style={[styles.optionText, theme === 'light' ? { color: '#fff' } : { color: colors.textPrimary }]}>{t('settings.light')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.optionBtn, theme === 'dark' ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}
                  onPress={() => { setTheme('dark'); setShowSettings(false); }}
                >
                  <Text style={[styles.optionText, theme === 'dark' ? { color: '#fff' } : { color: colors.textPrimary }]}>{t('settings.dark')}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.optionBtn, theme === 'system' ? { backgroundColor: colors.primary } : { borderColor: colors.border, borderWidth: 1 }]}
                  onPress={() => { setTheme('system'); setShowSettings(false); }}
                >
                  <Text style={[styles.optionText, theme === 'system' ? { color: '#fff' } : { color: colors.textPrimary }]}>{t('settings.system')}</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    borderBottomWidth: 1,
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
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconButton: {
    padding: spacing.xs,
  },
  iconText: {
    fontSize: 22,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  dropdownCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  settingGroup: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
