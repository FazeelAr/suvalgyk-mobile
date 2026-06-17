import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import OptimizedImage from './OptimizedImage';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { resolveMediaUrl } from '../lib/media';

type Recipe = any;

type Props = {
  recipe: Recipe;
  onPress?: () => void;
};

const RecipeCard = ({ recipe, onPress }: Props) => {
  const { title, description, meal_type, image } = recipe || {};
  const imageUrl = resolveMediaUrl(image);
  
  const prepTime = recipe?.prep_time_min || recipe?.prep_time;
  const cost = recipe?.estimated_cost ? Number(recipe.estimated_cost).toFixed(2) : null;

  const getMealTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'breakfast':
        return 'Pusryčiai';
      case 'lunch':
        return 'Pietūs';
      case 'dinner':
        return 'Vakarienė';
      case 'snack':
        return 'Užkandis';
      default:
        return 'Patiekalas';
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
      <OptimizedImage uri={imageUrl} style={styles.image} />

      <View style={styles.contentContainer}>
        <View>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.badge}><Text style={styles.badgeText}>{getMealTypeLabel(meal_type)}</Text></View>
          <View style={styles.metaInfo}>
            {cost && <Text style={styles.metaTextPrimary}>€{cost}</Text>}
            {prepTime && <Text style={styles.metaText}>⏱️ {prepTime}m</Text>}
            {recipe?.servings ? <Text style={styles.metaText}>👤 {recipe.servings}</Text> : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    overflow: 'hidden',
    flex: 1,
    margin: spacing.xs,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  image: { width: '100%', aspectRatio: 16 / 9, resizeMode: 'cover' },
  placeholder: { width: '100%', aspectRatio: 16 / 9, backgroundColor: colors.creamWarm, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 28 },
  contentContainer: { padding: spacing.sm, flex: 1, justifyContent: 'space-between' },
  title: { ...typography.h3, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs },
  description: { ...typography.body, fontSize: 11, lineHeight: 15, color: colors.textSecondary, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  badge: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 6 },
  badgeText: { ...typography.label, fontSize: 10, color: colors.primary },
  metaInfo: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  metaText: { fontSize: 10, color: colors.textSecondary, fontWeight: '500' },
  metaTextPrimary: { fontSize: 11, color: colors.primary, fontWeight: '700' },
});

export default RecipeCard;
