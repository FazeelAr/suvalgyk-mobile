import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { recipeService } from '../services/recipeService';
import { colors } from '../theme/colors';
import { resolveMediaUrl } from '../lib/media';
import OptimizedImage from '../components/OptimizedImage';

export default function RecipeDetailScreen({ route }: any) {
  const { slug } = route.params || {};
  const navigation = useNavigation<any>();
  const [recipe, setRecipe] = useState<any>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [voted, setVoted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const imageUrl = useMemo(() => resolveMediaUrl(recipe?.image), [recipe?.image]);

  // Fetch recipe data with async/await
  useEffect(() => {
    if (!slug) return;

    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        // Run both requests in parallel
        const [recipeData, relatedData] = await Promise.all([
          recipeService.getRecipeBySlug(slug),
          recipeService.getRelatedRecipes(slug),
        ]);
        
        setRecipe(recipeData);
        const recipes = (relatedData as any).results || relatedData;
        setRelatedRecipes(Array.isArray(recipes) ? recipes.slice(0, 3) : []);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [slug]);

  const toggleIngredient = useCallback((ingredientId: number) => {
    setCheckedIngredients(prev => {
      const newChecked = new Set(prev);
      if (newChecked.has(ingredientId)) {
        newChecked.delete(ingredientId);
      } else {
        newChecked.add(ingredientId);
      }
      return newChecked;
    });
  }, []);

  const handleVote = useCallback(async (sentiment: string) => {
    try {
      const vote = sentiment === 'positive';
      await recipeService.submitFeedback(
        String(recipe.id),
        vote,
        ''
      );

      Alert.alert('Sėkmė', 'Ačiū už jūsų nuomonę!');
      setVoted(true);
      setDismissed(false);
    } catch (e) {
      Alert.alert('Klaida', 'Nepavyko išsaugoti jūsų nuomonės');
    }
  }, [recipe?.id]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  if (loading) return <ActivityIndicator size="large" color={colors.primary} />;

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.textSecondary }}>Receptas nerastas</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Hero Image - Optimized with lazy loading */}
        {imageUrl && (
          <OptimizedImage
            uri={imageUrl}
            style={styles.heroImage}
            resizeMode="cover"
            aspectRatio={16 / 9}
          />
        )}

        {/* Title */}
        <Text style={styles.title}>{recipe?.title}</Text>

        {/* Meta Strip */}
        <View style={styles.metaStrip}>
          {recipe?.prep_time && (
            <View style={styles.metaItem}>
              <Text style={styles.metaEmoji}>⏱️</Text>
              <Text style={styles.metaText}>{recipe.prep_time || 20} min</Text>
            </View>
          )}
          {recipe?.servings && (
            <View style={styles.metaItem}>
              <Text style={styles.metaEmoji}>👥</Text>
              <Text style={styles.metaText}>{recipe.servings || 2} porcijos</Text>
            </View>
          )}
          {recipe?.estimated_cost && (
            <View style={styles.metaItem}>
              <Text style={styles.metaEmoji}>💰</Text>
              <Text style={styles.metaText}>{formatCurrency(Number(recipe.estimated_cost || 0))}</Text>
            </View>
          )}
          {recipe?.difficulty && (
            <View style={styles.metaItem}>
              <Text style={styles.metaEmoji}>🔖</Text>
              <Text style={styles.metaText}>
                {recipe.difficulty === 'easy' ? 'Lengva' : recipe.difficulty === 'medium' ? 'Vidutinė' : 'Sunkia'}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        {recipe?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aprašymas</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>
        )}

        {/* Ingredients */}
        {recipe?.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientai</Text>
            {recipe.ingredients.map((ing: any, i: number) => {
              const isChecked = checkedIngredients.has(i);
              return (
                <TouchableOpacity
                  key={ing?.id ?? i}
                  style={styles.ingredientRow}
                  onPress={() => toggleIngredient(i)}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                      {isChecked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <View style={styles.ingredientContent}>
                      <Text style={[styles.itemName, isChecked && styles.strikethrough]}>
                        {ing?.emoji ? `${ing.emoji} ` : ''}
                        {ing?.name ?? 'Ingredientas'}
                      </Text>
                      <Text style={styles.itemMeta}>
                        {ing?.amount ? ing.amount : ''}
                        {ing?.discount?.item_name ? `${ing?.amount ? ' · ' : ''}${ing.discount.item_name}` : ''}
                        {typeof ing?.discount?.price === 'number'
                          ? ` · €${ing.discount.price.toFixed(2)}`
                          : ''}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Steps */}
        {recipe?.steps && recipe.steps.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Žingsniai</Text>
            {recipe.steps.map((step: any, idx: number) => (
              <View key={step?.id ?? idx} style={styles.stepContainer}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{idx + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  {step?.action && <Text style={styles.stepAction}>{step.action}</Text>}
                  <Text style={styles.stepDescription}>{step?.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tips */}
        {recipe?.tips && (
          <View style={[styles.section, styles.tipSection]}>
            <Text style={styles.sectionTitle}>Patarimai</Text>
            <Text style={styles.tipsText}>{recipe.tips}</Text>
          </View>
        )}

        {/* Feedback Section */}
        {voted && !dismissed ? (
          <View style={styles.feedbackAlert}>
            <View style={styles.feedbackAlertContent}>
              <Text style={styles.feedbackAlertIcon}>✅</Text>
              <View>
                <Text style={styles.feedbackAlertTitle}>Ačiū!</Text>
                <Text style={styles.feedbackAlertText}>Jūsų nuomonė sėkmingai išsaugota.</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.feedbackAlertClose}
              onPress={() => setDismissed(true)}
            >
              <Text style={styles.feedbackAlertCloseText}>×</Text>
            </TouchableOpacity>
          </View>
        ) : !voted ? (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>Kaip jums šis receptas?</Text>
            <View style={styles.feedbackOptions}>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => handleVote('positive')}
              >
                <Text style={styles.feedbackButtonText}>😋 Skanu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.feedbackButton}
                onPress={() => handleVote('negative')}
              >
                <Text style={styles.feedbackButtonText}>🤔 Ne labai</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Galbūt patiks ir šie 👇</Text>
            <View style={styles.relatedRecipesContainer}>
              {relatedRecipes.map((relatedRecipe: any) => (
                <TouchableOpacity
                  key={relatedRecipe.id}
                  style={styles.relatedRecipeCard}
                  onPress={() => {
                    navigation.push('RecipeDetail', { slug: relatedRecipe.slug });
                  }}
                >
                  {relatedRecipe.image && (
                    <OptimizedImage
                      uri={resolveMediaUrl(relatedRecipe.image)}
                      style={styles.relatedRecipeImage}
                      aspectRatio={16 / 9}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.relatedRecipeInfo}>
                    <Text style={styles.relatedRecipeTitle} numberOfLines={2}>
                      {relatedRecipe.title}
                    </Text>
                    <View style={styles.relatedRecipeMeta}>
                      {relatedRecipe.estimated_cost && (
                        <Text style={styles.relatedRecipePrice}>
                          €{Number(relatedRecipe.estimated_cost).toFixed(2)}
                        </Text>
                      )}
                      {relatedRecipe.prep_time && (
                        <Text style={styles.relatedRecipeTime}>⏱️ {relatedRecipe.prep_time} min</Text>
                      )}
                      {relatedRecipe.servings && (
                        <Text style={styles.relatedRecipeServings}>👤 {relatedRecipe.servings} p.</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 32 },
  heroImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, marginBottom: 20, backgroundColor: colors.creamWarm },
  
  // Title
  title: { fontSize: 26, fontWeight: '900', color: colors.textPrimary, marginBottom: 16, lineHeight: 32 },
  
  // Meta Strip
  metaStrip: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  metaEmoji: { fontSize: 18 },
  metaText: { color: colors.textSecondary, fontSize: 14, fontWeight: '500' },
  
  // Section
  section: { marginBottom: 24 },
  sectionTitle: { fontWeight: '800', fontSize: 18, marginBottom: 12, color: colors.textPrimary },
  description: { color: colors.textSecondary, lineHeight: 22, marginBottom: 8 },
  
  // Ingredients
  ingredientRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: '#fff',
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  ingredientContent: { flex: 1 },
  itemName: { color: colors.textPrimary, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  strikethrough: { textDecorationLine: 'line-through', color: colors.textSecondary, opacity: 0.6 },
  itemMeta: { color: colors.textSecondary, fontSize: 13 },
  
  // Steps
  stepContainer: { flexDirection: 'row', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumber: { color: '#fff', fontWeight: '800', fontSize: 16 },
  stepContent: { flex: 1, paddingTop: 2 },
  stepAction: { fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  stepDescription: { color: colors.textSecondary, lineHeight: 22 },
  
  // Tips
  tipSection: { backgroundColor: colors.creamWarm, padding: 16, borderRadius: 12, marginBottom: 16 },
  tipsText: { color: colors.textSecondary, lineHeight: 22 },

  // Feedback
  feedbackAlert: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  feedbackAlertContent: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  feedbackAlertIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  feedbackAlertTitle: {
    fontWeight: '800',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  feedbackAlertText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  feedbackAlertClose: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackAlertCloseText: {
    fontSize: 20,
    fontWeight: '300',
    color: colors.textSecondary,
  },
  feedbackSection: {
    backgroundColor: colors.creamWarm,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontWeight: '800',
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  feedbackOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  feedbackButtonText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Related Recipes
  relatedRecipesContainer: {
    gap: 12,
  },
  relatedRecipeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
    marginBottom: 8,
  },
  relatedRecipeImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.creamWarm,
  },
  relatedRecipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  relatedRecipeTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  relatedRecipeMeta: {
    flexDirection: 'column',
    gap: 3,
  },
  relatedRecipePrice: {
    fontWeight: '700',
    fontSize: 12,
    color: colors.primary,
  },
  relatedRecipeTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  relatedRecipeServings: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
