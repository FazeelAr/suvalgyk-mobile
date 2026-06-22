import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { spacing } from '../theme/spacing';
import { contactService } from '../services/contactService';
import { SvgXml } from 'react-native-svg';
import { useSettings } from '../contexts/SettingsContext';

const contactIllustration = `
<svg width="175" height="110" viewBox="0 0 175 110" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="175" height="110" rx="20" fill="#FFF8E7"/>
  <rect x="18" y="18" width="139" height="74" rx="16" fill="#FFFFFF" stroke="#E7D9B8"/>
  <rect x="32" y="31" width="70" height="7" rx="3.5" fill="#6A9CFE"/>
  <rect x="32" y="45" width="96" height="6" rx="3" fill="#D7DCE8"/>
  <rect x="32" y="57" width="84" height="6" rx="3" fill="#D7DCE8"/>
  <path d="M132 53L148 43V63L132 53Z" fill="#FE7070"/>
  <rect x="126" y="41" width="10" height="24" rx="5" fill="#FDCE70"/>
  <circle cx="143" cy="31" r="8" fill="#6A9CFE"/>
  <path d="M136 30C138 26 144 26 146 30C144 34 138 34 136 30Z" fill="#FFFFFF"/>
  <circle cx="87.5" cy="80" r="10" fill="#6A9CFE"/>
</svg>`;

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { colors, t } = useSettings();

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert(t('common.error'), t('contact.errorFields'));
      return;
    }

    try {
      setSubmitting(true);
      await contactService.submitContactForm({ name, email, message });
      Alert.alert(t('contact.success'), t('contact.successMsg'));
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      Alert.alert(t('common.error'), error instanceof Error ? error.message : t('common.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={[styles.introCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('contact.heroTitle')}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t('contact.heroDesc')}
          </Text>

          <View style={[styles.illustrationCard, { backgroundColor: colors.creamWarm }]}>
            <SvgXml xml={contactIllustration} width="100%" height="100%" />
          </View>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Žinutė</Text>

          <Text style={[styles.label, { color: colors.textPrimary }]}>{t('contact.name')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
            placeholder={t('contact.name')}
            placeholderTextColor={colors.textMute}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: colors.textPrimary }]}>{t('contact.email')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
            placeholder="email@domeinas.lt"
            placeholderTextColor={colors.textMute}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={[styles.label, { color: colors.textPrimary }]}>{t('contact.message')}</Text>
          <TextInput
            style={[styles.input, styles.messageInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
            placeholder={t('contact.message')}
            placeholderTextColor={colors.textMute}
            multiline
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />

          <Pressable style={[styles.button, { backgroundColor: colors.primary }, submitting ? styles.buttonDisabled : null]} onPress={handleSubmit} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={[styles.buttonText, { color: '#fff' }]}>{t('contact.submit')}</Text>
            )}
          </Pressable>
        </View>

        <View style={[styles.emailCard, { backgroundColor: colors.creamWarm, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Rašykite tiesiogiai</Text>
          <Pressable onPress={() => void Linking.openURL('mailto:' + 'info@suvalgyk.lt')}>
            <Text style={[styles.emailText, { color: colors.primary }]}>info@suvalgyk.lt</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: spacing.md,
    gap: 12,
    paddingBottom: 24,
  },
  introCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
  },
  illustrationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },
  messageInput: {
    minHeight: 120,
  },
  button: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    fontWeight: '800',
    fontSize: 15,
  },
  emailCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
