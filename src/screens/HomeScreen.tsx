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
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useGenerateRecipe } from '../hooks/useGenerateRecipe';

const INPUT_MODES = [
  { value: 'image', label: 'Įkelti nuotrauką', icon: '📷' },
  { value: 'text', label: 'Įvesti ranka', icon: '✏️' },
];

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Pusryčiai', emoji: '🍳' },
  { value: 'lunch', label: 'Pietūs', emoji: '🥗' },
  { value: 'dinner', label: 'Vakarienė', emoji: '🍝' },
  { value: 'snack', label: 'Užkandis', emoji: '🍪' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [inputType, setInputType] = useState<'image' | 'text'>('text');
  const [products, setProducts] = useState('Bulvės, kiaušiniai, sūris');
  const [dietaryPreferences, setDietaryPreferences] = useState('Be glitimo, jei įmanoma');
  const [mealType, setMealType] = useState('lunch');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const { generateRecipe, generating, progressMsg, error } = useGenerateRecipe();

  const requestPayload = useMemo(() => ({
    products,
    dietary_prefs: dietaryPreferences,
    meal_type: mealType,
    budget: 'average', // required by serializer
  }), [products, dietaryPreferences, mealType]);

  useEffect(() => {
    if (error) {
      Alert.alert('Klaida', error);
    }
  }, [error]);

  const handleGenerateRecipe = async () => {
    const payload: Record<string, any> = {
      ...requestPayload,
    };
    if (inputType === 'image' && imageBase64) {
      payload.image_base64 = imageBase64;
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
        Alert.alert('Reikia leidimo', 'Kad galėtume pridėti nuotrauką, suteikite leidimą fotoaparatui arba galerijai.');
        return;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [4, 3], base64: true })
          : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true, aspect: [4, 3], base64: true });

      if (!result.canceled && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
        setImageBase64(result.assets[0].base64 || null);
        setInputType('image');
      }
    } catch {
      Alert.alert('Klaida', 'Nepavyko atidaryti nuotraukos pasirinkimo.');
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroStrip}>
          <Text style={styles.heroEmoji}>👨‍🍳</Text>
          <Text style={styles.heroTitle}>Suvalgyk - neišmesk!</Text>
        </View>

        <View style={styles.formCard}>
          <ToggleButtonGroup
            options={INPUT_MODES}
            selected={inputType}
            onSelect={(value) => setInputType(value as 'image' | 'text')}
          />

          {inputType === 'text' ? (
            <View style={styles.sectionGap}>
              <Text style={styles.label}>Ingredientų sąrašas</Text>
              <TextInput
                style={[styles.textArea, styles.multiLine]}
                placeholder="Bulvės, kiaušiniai, sūris..."
                placeholderTextColor={colors.textMute}
                value={products}
                onChangeText={setProducts}
                multiline
              />
            </View>
          ) : (
            <View style={styles.sectionGap}>
              <Text style={styles.label}>Įkelk ingredientų nuotrauką</Text>
              <View style={styles.uploadBox}>
                {imageUri ? (
                  <OptimizedImage uri={imageUri} style={styles.previewImage} />
                ) : (
                  <Text style={styles.uploadIcon}>🖼️</Text>
                )}
                <Text style={styles.uploadTitle}>Nufotografuok arba įkelk iš galerijos</Text>
                <Text style={styles.uploadText}>Įkėlimas veikia kaip mobiliojo vaizdo atitikmuo iš svetainės.</Text>

                <View style={styles.uploadActions}>
                  <Pressable style={styles.primaryButton} onPress={() => pickImage('camera')}>
                    <Text style={styles.primaryButtonText}>📷 Kamera</Text>
                  </Pressable>
                  <Pressable style={styles.secondaryButton} onPress={() => pickImage('library')}>
                    <Text style={styles.secondaryButtonText}>🖼️ Galerija</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}

          <View style={styles.sectionGap}>
            <Text style={styles.label}>Papildomi pageidavimai</Text>
            <TextInput
              style={[styles.textArea, styles.multiLine]}
              placeholder="Be glitimo, mažiau druskos..."
              placeholderTextColor={colors.textMute}
              value={dietaryPreferences}
              onChangeText={setDietaryPreferences}
              multiline
            />
          </View>

          <View style={styles.sectionGap}>
            <Text style={styles.label}>Valgio tipas</Text>
            <View style={styles.chips}>
              {MEAL_TYPES.map((meal) => {
                const isSelected = mealType === meal.value;
                return (
                  <Pressable
                    key={meal.value}
                    style={[styles.chip, isSelected ? styles.chipSelected : null]}
                    onPress={() => setMealType(meal.value)}
                  >
                    <Text style={[styles.chipText, isSelected ? styles.chipTextSelected : null]}>
                      {meal.emoji} {meal.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={[styles.submitButton, generating ? styles.submitButtonDisabled : null]}
            onPress={handleGenerateRecipe}
            disabled={generating}
          >
            <Text style={styles.submitButtonText}>{generating ? (progressMsg || 'Gaminama...') : 'Sukurti receptą'}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal transparent visible={generating} animationType="fade" statusBarTranslucent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Palaukite</Text>
            <Text style={styles.modalDescription}>Ruošiamas receptas</Text>
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
  screen: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 28,
    gap: 12,
  },
  heroStrip: {
    backgroundColor: colors.creamWarm,
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
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#ececec',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  sectionGap: { gap: 6 },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  textArea: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 8,
    padding: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  multiLine: {
    minHeight: 92,
    textAlignVertical: 'top',
  },
  uploadBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    alignItems: 'center',
    gap: 8,
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 4,
  },
  uploadIcon: { fontSize: 32 },
  uploadTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  uploadText: {
    color: colors.textSecondary,
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    minHeight: 44,
    flexGrow: 1,
    flexBasis: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  chipTextSelected: {
    color: colors.surface,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.75,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
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
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  modalDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  preparingGif: {
    width: 150,
    height: 150,
    marginTop: 12,
  },
  modalText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
