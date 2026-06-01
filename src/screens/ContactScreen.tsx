import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { contactService } from '../services/contactService';
import { SvgXml } from 'react-native-svg';

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

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Trūksta duomenų', 'Užpildykite vardą, el. paštą ir žinutę.');
      return;
    }

    try {
      setSubmitting(true);
      await contactService.submitContactForm({ name, email, message });
      Alert.alert('Pavyko', 'Jūsų žinutė išsiųsta sėkmingai.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      Alert.alert('Klaida', error instanceof Error ? error.message : 'Nepavyko išsiųsti žinutės.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Text style={styles.title}>Susisiekite su mumis</Text>
          <Text style={styles.description}>
            Jeigu turite pasiūlymą, pastebėjimą ar norite parašyti tiesiogiai, palikite žinutę žemiau.
          </Text>

          <View style={styles.illustrationCard}>
            <SvgXml xml={contactIllustration} width="100%" height="100%" />
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Žinutė</Text>

          <Text style={styles.label}>Vardas</Text>
          <TextInput
            style={styles.input}
            placeholder="Jūsų vardas"
            placeholderTextColor={colors.textMute}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>El. paštas</Text>
          <TextInput
            style={styles.input}
            placeholder="email@domeinas.lt"
            placeholderTextColor={colors.textMute}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Žinutė</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Parašykite savo žinutę"
            placeholderTextColor={colors.textMute}
            multiline
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />

          <Pressable style={[styles.button, submitting ? styles.buttonDisabled : null]} onPress={handleSubmit} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <Text style={styles.buttonText}>Siųsti</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.emailCard}>
          <Text style={styles.sectionTitle}>Rašykite tiesiogiai</Text>
          <Pressable onPress={() => void Linking.openURL('mailto:' + 'info@suvalgyk.lt')}>
            <Text style={styles.emailText}>info@suvalgyk.lt</Text>
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
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  illustrationCard: {
    backgroundColor: colors.creamWarm,
    borderRadius: 16,
    overflow: 'hidden',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustration: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.creamWarm,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },
  label: {
    marginBottom: 6,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 10,
    color: colors.textPrimary,
  },
  messageInput: {
    minHeight: 120,
  },
  button: {
    marginTop: 14,
    backgroundColor: colors.primary,
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: 15,
  },
  emailCard: {
    backgroundColor: colors.creamWarm,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
  },
  emailText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
});
