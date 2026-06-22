import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import RecipeCard from '../components/RecipeCard';
import Pagination from '../components/Pagination';
import { recipeService } from '../services/recipeService';
import { useSettings } from '../contexts/SettingsContext';

export default function RecipesListScreen({ navigation }: any) {
  const { colors, t } = useSettings();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');

  const MEAL_TYPES = [
    { value: '', label: t('recipe.all') },
    { value: 'breakfast', label: t('home.meal.breakfast') },
    { value: 'lunch', label: t('home.meal.lunch') },
    { value: 'dinner', label: t('home.meal.dinner') },
    { value: 'snack', label: t('home.meal.snack') },
  ];

  const [mealType, setMealType] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const loadRecipes = async (overrides: { search?: string; meal_type?: string; page?: number } = {}, isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    else setIsFetching(true);

    const targetPage = overrides.page !== undefined ? overrides.page : page;

    try {
      const data = await recipeService.getRecipes({
        search: overrides.search ?? search,
        meal_type: overrides.meal_type ?? mealType,
        page: targetPage,
        page_size: 12,
      });

      setRecipes(data.results || []);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
      setTotalCount(data.count || 0);
    } catch {
      setRecipes([]);
      setHasNext(false);
      setHasPrevious(false);
      setTotalCount(0);
    } finally {
      setInitialLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void loadRecipes({}, true);
  }, []);

  const handleApplyFilters = () => {
    setPage(1);
    void loadRecipes({ search, meal_type: mealType, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    void loadRecipes({ page: newPage });
  };

  if (initialLoading) {
    return (
      <View style={[styles.center, { flex: 1, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.filterCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.filterHeader}>
            <Text style={[styles.filterTitle, { color: colors.textPrimary }]}>{t('recipe.filter')}</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>{t('recipe.searchTitle')}</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('recipe.searchPlaceholder')}
              placeholderTextColor={colors.textMute}
              style={[styles.input, { backgroundColor: colors.background, borderColor: colors.border, color: colors.textPrimary }]}
              returnKeyType="search"
              onSubmitEditing={handleApplyFilters}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>{t('home.meal.label')}</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Picker
                selectedValue={mealType}
                onValueChange={(itemValue) => setMealType(itemValue)}
                style={[styles.picker, { color: colors.textPrimary }]}
              >
                {MEAL_TYPES.map((option) => (
                  <Picker.Item
                    key={option.value || 'all'}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterActions}>
            <Pressable style={[styles.filterButton, { backgroundColor: colors.primary }]} onPress={handleApplyFilters}>
              <Text style={[styles.filterButtonText, { color: '#fff' }]}>{t('recipe.filterBtn')}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: colors.textPrimary }]}>{t('tab.recipes')}</Text>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>{totalCount} {t('recipe.recipesCount')}</Text>
        </View>

        {isFetching ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : recipes.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t('recipe.notFound')}</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('recipe.emptySearch')}</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id?.toString() || item.slug}
              renderItem={({ item }) => (
                <RecipeCard
                  recipe={item}
                  onPress={() => navigation.navigate('RecipeDetail', { slug: item.slug })}
                />
              )}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.list}
            />

            {totalCount > 0 && (
              <Pagination
                page={page}
                count={totalCount}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  list: { paddingTop: 8, paddingBottom: 8 },
  center: { alignItems: 'center', justifyContent: 'center' },
  filterCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 14,
  },
  filterHeader: {
    gap: 4,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  filterActions: {
    gap: 10,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
  },
  filterButton: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 15,
    fontWeight: '900',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
