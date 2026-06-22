import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { recipeService } from '../services/recipeService';
import { resolveMediaUrl } from '../lib/media';
import OptimizedImage from '../components/OptimizedImage';
import RecipeCard from '../components/RecipeCard';
import { useSettings } from '../contexts/SettingsContext';

export default function RecipeDetailScreen({ route }: any) {
  const { slug } = route.params || {};
  const navigation = useNavigation<any>();
  const [recipe, setRecipe] = useState<any>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [voted, setVoted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { colors, t } = useSettings();

  const imageUrl = useMemo(() => resolveMediaUrl(recipe?.image), [recipe?.image]);

  useEffect(() => {
    if (!slug) return;

    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        const [recipeData, relatedData] = await Promise.all([
          recipeService.getRecipeBySlug(slug),
          recipeService.getRelatedRecipes(slug),
        ]);
        
        setRecipe(recipeData);
        const recipes = (relatedData as any).results || relatedData;
        setRelatedRecipes(Array.isArray(recipes) ? recipes.slice(0, 4) : []);
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

      Alert.alert(t('recipe.success'), t('recipe.feedbackThanks'));
      setVoted(true);
      setDismissed(false);
    } catch (e) {
      Alert.alert(t('common.error'), t('recipe.feedbackError'));
    }
  }, [recipe?.id, t]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.textSecondary }}>{t('recipe.notFound')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('RecipesList')}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>{t('recipe.back')}</Text>
        </TouchableOpacity>

        {/* Hero Image */}
        {imageUrl && (
          <View style={styles.heroContainer}>
            <OptimizedImage
              uri={imageUrl}
              style={[styles.heroImage, { backgroundColor: colors.creamWarm }]}
              resizeMode="cover"
              aspectRatio={16 / 9}
            />
            <TouchableOpacity style={styles.saveButton} onPress={() => Alert.alert(t('common.saved'), t('recipe.savedAlert'))}>
              <Text style={styles.saveIcon}>🔖</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Title */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>{recipe?.title}</Text>

        {/* Meta Grid */}
        <View style={[styles.metaGrid, { backgroundColor: colors.creamWarm }]}>
          <View style={styles.metaRow}>
            <View style={styles.metaGridItem}>
              <Text style={styles.metaEmoji}>⏱️</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{recipe?.total_time_min || 0} {t('recipe.mins')}</Text>
            </View>
            <View style={styles.metaGridItem}>
              <Text style={styles.metaEmoji}>👥</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{recipe?.servings || 0} {t('recipe.servings')}</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaGridItem}>
              <Text style={styles.metaEmoji}>💰</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatCurrency(Number(recipe?.estimated_cost || 0))}</Text>
            </View>
            <View style={styles.metaGridItem}>
              <Text style={styles.metaEmoji}>⭐</Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {recipe?.difficulty === 'easy' ? t('recipe.difficulty.easy') : recipe?.difficulty === 'medium' ? t('recipe.difficulty.medium') : t('recipe.difficulty.hard')}
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Tags */}
        <View style={styles.tagsContainer}>
          {recipe?.meal_type && (
            <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{
                recipe.meal_type === 'breakfast' ? t('home.meal.breakfast') :
                recipe.meal_type === 'lunch' ? t('home.meal.lunch') :
                recipe.meal_type === 'dinner' ? t('home.meal.dinner') :
                recipe.meal_type === 'snack' ? t('home.meal.snack') : recipe.meal_type
              }</Text>
            </View>
          )}
          {recipe?.dietary && (
            <View style={[styles.tag, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>{recipe.dietary}</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {recipe?.description && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('recipe.description')}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{recipe.description}</Text>
          </View>
        )}

        {/* Ingredients */}
        {recipe?.ingredients && recipe.ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('recipe.ingredients')}</Text>
            {recipe.ingredients.map((ing: any, i: number) => {
              const isChecked = checkedIngredients.has(i);
              return (
                <TouchableOpacity
                  key={ing?.id ?? i}
                  style={[styles.ingredientRow, { borderBottomColor: colors.border }]}
                  onPress={() => toggleIngredient(i)}
                  activeOpacity={0.7}
                >
                  <View style={styles.checkboxContainer}>
                    <View style={[styles.checkbox, { borderColor: colors.primary, backgroundColor: colors.surface }, isChecked && { backgroundColor: colors.primary }]}>
                      {isChecked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <View style={styles.ingredientContent}>
                      <Text style={[styles.itemName, { color: colors.textPrimary }, isChecked && styles.strikethrough]}>
                        {ing?.emoji ? `${ing.emoji} ` : ''}
                        {ing?.name ?? t('recipe.ingredientFallback')}
                      </Text>
                      <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>
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
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('recipe.steps')}</Text>
            {recipe.steps.map((step: any, idx: number) => (
              <View key={step?.id ?? idx} style={[styles.stepContainer, { borderBottomColor: colors.border }]}>
                <View style={[styles.stepNumberContainer, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumber}>{idx + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  {step?.action && <Text style={[styles.stepAction, { color: colors.textPrimary }]}>{step.action}</Text>}
                  <Text style={[styles.stepDescription, { color: colors.textSecondary }]}>{step?.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tips */}
        {recipe?.tips && (
          <View style={[styles.section, styles.tipSection, { backgroundColor: colors.creamWarm }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('recipe.tips')}</Text>
            <Text style={[styles.tipsText, { color: colors.textSecondary }]}>{recipe.tips}</Text>
          </View>
        )}

        {/* Feedback Section */}
        {voted && !dismissed ? (
          <View style={[styles.feedbackAlert, { borderLeftColor: colors.primary, backgroundColor: colors.surfaceHover }]}>
            <View style={styles.feedbackAlertContent}>
              <Text style={styles.feedbackAlertIcon}>✅</Text>
              <View>
                <Text style={[styles.feedbackAlertTitle, { color: colors.textPrimary }]}>{t('recipe.thanks')}</Text>
                <Text style={[styles.feedbackAlertText, { color: colors.textSecondary }]}>{t('recipe.feedbackSaved')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.feedbackAlertClose}
              onPress={() => setDismissed(true)}
            >
              <Text style={[styles.feedbackAlertCloseText, { color: colors.textSecondary }]}>×</Text>
            </TouchableOpacity>
          </View>
        ) : !voted ? (
          <View style={[styles.feedbackSection, { backgroundColor: colors.creamWarm }]}>
            <Text style={[styles.feedbackTitle, { color: colors.textPrimary }]}>{t('recipe.howDoYouLike')}</Text>
            <View style={styles.feedbackOptions}>
              <TouchableOpacity
                style={[styles.feedbackButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => handleVote('positive')}
              >
                <Text style={[styles.feedbackButtonText, { color: colors.textPrimary }]}>{t('recipe.delicious')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.feedbackButton, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={() => handleVote('negative')}
              >
                <Text style={[styles.feedbackButtonText, { color: colors.textPrimary }]}>{t('recipe.notReally')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{t('recipe.mightLike')}</Text>
            <View style={styles.relatedRecipesContainer}>
              {relatedRecipes.map((relatedRecipe: any) => (
                <View key={relatedRecipe.id} style={styles.relatedRecipeWrapper}>
                  <RecipeCard 
                    recipe={relatedRecipe}
                    onPress={() => navigation.push('RecipeDetail', { slug: relatedRecipe.slug })}
                  />
                </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  heroContainer: { position: 'relative', marginBottom: 20 },
  heroImage: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, overflow: 'hidden' },
  saveButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveIcon: { fontSize: 20 },
  
  title: { fontSize: 26, fontWeight: '900', marginBottom: 16, lineHeight: 32 },
  
  metaGrid: { marginBottom: 16, borderRadius: 12, padding: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  metaGridItem: { flexDirection: 'row', alignItems: 'center', width: '48%', gap: 8 },
  metaEmoji: { fontSize: 18 },
  metaText: { fontSize: 14, fontWeight: '600' },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  tagText: { fontSize: 12, fontWeight: '700' },
  
  section: { marginBottom: 24 },
  sectionTitle: { fontWeight: '800', fontSize: 18, marginBottom: 12 },
  description: { lineHeight: 22, marginBottom: 8 },
  
  ingredientRow: { paddingVertical: 12, borderBottomWidth: 1 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  ingredientContent: { flex: 1 },
  itemName: { fontWeight: '700', fontSize: 15, marginBottom: 4 },
  strikethrough: { textDecorationLine: 'line-through', opacity: 0.6 },
  itemMeta: { fontSize: 13 },
  
  stepContainer: { flexDirection: 'row', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1 },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumber: { color: '#fff', fontWeight: '800', fontSize: 16 },
  stepContent: { flex: 1, paddingTop: 2 },
  stepAction: { fontWeight: '700', marginBottom: 4 },
  stepDescription: { lineHeight: 22 },
  
  tipSection: { padding: 16, borderRadius: 12, marginBottom: 16 },
  tipsText: { lineHeight: 22 },

  feedbackAlert: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderLeftWidth: 4,
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
    marginBottom: 2,
  },
  feedbackAlertText: {
    fontSize: 12,
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
  },
  feedbackSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  feedbackTitle: {
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 12,
  },
  feedbackOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  feedbackButtonText: {
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },

  relatedRecipesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -4,
  },
  relatedRecipeWrapper: {
    width: '50%',
  },
});
