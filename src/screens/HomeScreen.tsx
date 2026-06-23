import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ToggleButtonGroup from '../components/ToggleButtonGroup';
import OptimizedImage from '../components/OptimizedImage';
import { spacing } from '../theme/spacing';
import { useGenerateRecipe } from '../hooks/useGenerateRecipe';
import { useSettings } from '../contexts/SettingsContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { colors, t } = useSettings();

  const INPUT_MODES = [
    { value: 'image', label: t('home.mode.image'), icon: '📷' },
    { value: 'text', label: t('home.mode.text'), icon: '✏️' },
  ];

  const MEAL_TYPES = [
    { value: 'breakfast', label: t('home.meal.breakfast'), emoji: '🍳' },
    { value: 'lunch', label: t('home.meal.lunch'), emoji: '🥗' },
    { value: 'dinner', label: t('home.meal.dinner'), emoji: '🍝' },
    { value: 'snack', label: t('home.meal.snack'), emoji: '🍪' },
  ];

  const [inputType, setInputType] = useState<'image' | 'text'>('text');
  const [products, setProducts] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { generateRecipe, generating, progressMsg, error } = useGenerateRecipe();

  const requestPayload = useMemo(() => ({
    products,
    dietary_prefs: dietaryPreferences,
    meal_type: mealType,
    budget: 'average',
  }), [products, dietaryPreferences, mealType]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error);
    }
  }, [error]);

  const handleGenerateRecipe = async () => {
    if (inputType === 'text' && !products.trim()) {
      Alert.alert(t('common.error'), t('home.ingredients.error'));
      return;
    }
    if (inputType === 'image' && !imageUri) {
      Alert.alert(t('common.error'), t('home.image.error'));
      return;
    }

    const payload: Record<string, any> = { ...requestPayload };
    if (inputType === 'image' && imageUri) {
      payload.image_uri = imageUri;
    }

    generateRecipe(payload, (slug) => {
      navigation.navigate('Receptai', {
        screen: 'RecipeDetail',
        params: { slug },
      });
    });
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      const permission =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(t('home.permissionReq'), t('home.permissionDesc'));
        return;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: false })
          : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: false });

      if (!result.canceled && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
        setInputType('image');
      }
    } catch {
      Alert.alert(t('common.error'), t('home.pickerError'));
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroStrip, { backgroundColor: colors.creamWarm }]}>
          <Text style={styles.heroEmoji}>👨‍🍳</Text>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{t('home.heroTitle')}</Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.surfaceHover }]}>
          <ToggleButtonGroup
            options={INPUT_MODES}
            selected={inputType}
            onSelect={(value) => setInputType(value as 'image' | 'text')}
          />

          {inputType === 'text' ? (
            <View style={styles.sectionGap}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{t('home.ingredients.label')}</Text>
              <TextInput
                style={[styles.textArea, styles.multiLine, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
                placeholder={t('home.ingredients.placeholder')}
                placeholderTextColor={colors.textMute}
                value={products}
                onChangeText={setProducts}
                multiline
              />
            </View>
          ) : (
            <View style={styles.sectionGap}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{t('home.image.label')}</Text>
              <View style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {imageUri ? (
                  <View style={{ width: '100%' }}>
                    <OptimizedImage uri={imageUri} style={styles.previewImage} />
                    <Pressable
                      style={styles.deleteImageButton}
                      onPress={() => {
                        setImageUri(null);
                      }}
                    >
                      <Text style={styles.deleteImageText}>✕</Text>
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <Text style={styles.uploadIcon}>🖼️</Text>
                    <Text style={[styles.uploadTitle, { color: colors.textPrimary }]}>{t('home.image.title')}</Text>
                    <Text style={[styles.uploadText, { color: colors.textSecondary }]}>{t('home.image.text')}</Text>
                  </>
                )}

                <View style={styles.uploadActions}>
                  <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]} onPress={() => pickImage('camera')}>
                    <Text style={[styles.primaryButtonText, { color: '#fff' }]}>{t('home.image.camera')}</Text>
                  </Pressable>
                  <Pressable style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => pickImage('library')}>
                    <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>{t('home.image.gallery')}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View style={styles.sectionGap}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('home.prefs.label')}</Text>
            <TextInput
              style={[styles.textArea, styles.multiLine, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary }]}
              placeholder={t('home.prefs.placeholder')}
              placeholderTextColor={colors.textMute}
              value={dietaryPreferences}
              onChangeText={setDietaryPreferences}
              multiline
            />
          </View>

          <View style={styles.sectionGap}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>{t('home.meal.label')}</Text>
            <View style={styles.chips}>
              {MEAL_TYPES.map((meal) => {
                const isSelected = mealType === meal.value;
                return (
                  <Pressable
                    key={meal.value}
                    style={[
                      styles.chip,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isSelected ? { backgroundColor: colors.primary, borderColor: colors.primary } : null,
                    ]}
                    onPress={() => setMealType(meal.value)}
                  >
                    <Text style={[
                      styles.chipText,
                      { color: colors.textSecondary },
                      isSelected ? { color: '#fff' } : null,
                    ]}>
                      {meal.emoji} {meal.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={[styles.submitButton, { backgroundColor: colors.primary }, generating ? styles.submitButtonDisabled : null]}
            onPress={handleGenerateRecipe}
            disabled={generating}
          >
            <Text style={[styles.submitButtonText, { color: '#fff' }]}>{generating ? (progressMsg || t('home.generating')) : t('home.submit')}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal transparent visible={generating} animationType="fade" statusBarTranslucent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>{t('common.wait')}</Text>
            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>{t('home.modal.desc')}</Text>
            <Image 
              source={require('../../assets/preparing-recipe.gif')}
              style={styles.preparingGif}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 28,
    gap: 12,
  },
  heroStrip: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  heroEmoji: { fontSize: 20 },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  sectionGap: { gap: 6 },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  textArea: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  multiLine: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 4,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteImageText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  uploadIcon: { fontSize: 32 },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  uploadText: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  uploadActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  primaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  chip: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    minHeight: 44,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.75,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 24, 20, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  preparingGif: {
    width: 150,
    height: 150,
    marginTop: 12,
  },
});
