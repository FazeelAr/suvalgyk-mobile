import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import OptimizedImage from './OptimizedImage';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { resolveMediaUrl } from '../lib/media';
import { useSettings } from '../contexts/SettingsContext';

type Recipe = any;

type Props = {
  recipe: Recipe;
  onPress?: () => void;
};

const RecipeCard = ({ recipe, onPress }: Props) => {
  const { title, description, meal_type, image } = recipe || {};
  const imageUrl = resolveMediaUrl(image);
  const { colors, t } = useSettings();
  
  const cost = recipe?.estimated_cost ? Number(recipe.estimated_cost).toFixed(2) : null;

  const getMealTypeLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'breakfast':
        return t('home.meal.breakfast');
      case 'lunch':
        return t('home.meal.lunch');
      case 'dinner':
        return t('home.meal.dinner');
      case 'snack':
        return t('home.meal.snack');
      default:
        return type || 'Patiekalas';
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.85} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.primary }]} onPress={onPress}>
      <OptimizedImage uri={imageUrl} style={styles.image} />

      <View style={styles.contentContainer}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{title}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>{description}</Text>
        </View>

        <View style={styles.footer}>
          <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}><Text style={[styles.badgeText, { color: colors.primary }]}>{getMealTypeLabel(meal_type)}</Text></View>
          <View style={styles.metaInfo}>
            {cost && <Text style={[styles.metaTextPrimary, { color: colors.primary }]}>€{cost}</Text>}
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
    overflow: 'hidden',
    flex: 1,
    margin: spacing.xs,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  image: { width: '100%', aspectRatio: 16 / 9, resizeMode: 'cover' },
  contentContainer: { padding: spacing.sm, flex: 1, justifyContent: 'space-between' },
  title: { ...typography.h3, fontSize: 14, marginBottom: spacing.xs },
  description: { ...typography.body, fontSize: 11, lineHeight: 15, marginBottom: spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: 6 },
  badgeText: { ...typography.label, fontSize: 10 },
  metaInfo: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  metaTextPrimary: { fontSize: 11, fontWeight: '700' },
});

export default RecipeCard;
