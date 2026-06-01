import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { recipeService } from '../services/recipeService';
import { colors } from '../theme/colors';
import { resolveMediaUrl } from '../lib/media';

export default function RecipeDetailScreen({ route }: any) {
  const { slug } = route.params || {};
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const imageUrl = resolveMediaUrl(recipe?.image);

  useEffect(() => {
    if (!slug) return;
    recipeService
      .getRecipeBySlug(slug)
      .then((data) => setRecipe(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.heroImage} /> : null}
        <Text style={styles.title}>{recipe?.title}</Text>
        <Text style={styles.subtitle}>{recipe?.description}</Text>
        <Text style={styles.section}>Ingredientai</Text>
        {(recipe?.ingredients || []).map((ing: any, i: number) => (
          <View key={ing?.id ?? i} style={styles.ingredientRow}>
            <Text style={styles.itemName}>{ing?.emoji ? `${ing.emoji} ` : ''}{ing?.name ?? 'Ingredientas'}</Text>
            <Text style={styles.itemMeta}>
              {ing?.amount ? ing.amount : ''}
              {ing?.discount?.item_name ? `${ing?.amount ? ' · ' : ''}${ing.discount.item_name}` : ''}
              {typeof ing?.discount?.price === 'number' ? ` · ${ing.discount.price} ${ing.discount.currency || ''}` : ''}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heroImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, marginBottom: 12, backgroundColor: colors.creamWarm },
  title: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, marginBottom: 8 },
  subtitle: { color: colors.textSecondary, marginBottom: 12 },
  section: { fontWeight: '800', marginTop: 12, marginBottom: 6 },
  ingredientRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemName: { color: colors.textPrimary, fontWeight: '700' },
  itemMeta: { color: colors.textSecondary, marginTop: 4, fontSize: 12 },
});
