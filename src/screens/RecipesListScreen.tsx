import React, { useEffect, useMemo, useState } from 'react';
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
import { recipeService } from '../services/recipeService';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const MEAL_TYPES = [
  { value: '', label: 'Visi' },
  { value: 'breakfast', label: 'Pusryčiai' },
  { value: 'lunch', label: 'Pietūs' },
  { value: 'dinner', label: 'Vakarienė' },
  { value: 'snack', label: 'Užkandis' },
];

export default function RecipesListScreen({ navigation }: any) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [search, setSearch] = useState('');

  const [mealType, setMealType] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedMealType, setAppliedMealType] = useState('');

  const loadRecipes = async (overrides: { search?: string; meal_type?: string } = {}, isInitial = false) => {
    if (isInitial) setInitialLoading(true);
    else setIsFetching(true);

    try {
      const data = await recipeService.getRecipes({
        search: overrides.search ?? search,
        meal_type: overrides.meal_type ?? mealType,
        page_size: 100, // Fetch up to 100 recipes at once
      });

      setRecipes(Array.isArray(data) ? data : (data as any).results || []);
    } catch {
      setRecipes([]);
    } finally {
      setInitialLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void loadRecipes({}, true);
  }, []);

  const filteredRecipes = useMemo(() => {
    const normalizedSearch = appliedSearch.trim().toLowerCase();

    return recipes.filter((recipe) => {
      const recipeTitle = String(recipe?.title || '').toLowerCase();
      const recipeDescription = String(recipe?.one_liner_description || recipe?.description || '').toLowerCase();
      const recipeMealType = String(recipe?.meal_type || '').toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        recipeTitle.includes(normalizedSearch) ||
        recipeDescription.includes(normalizedSearch);
      const matchesMealType = appliedMealType.length === 0 || recipeMealType === appliedMealType;

      return matchesSearch && matchesMealType;
    });
  }, [recipes, appliedSearch, appliedMealType]);

  const handleApplyFilters = () => {
    setAppliedSearch(search);
    setAppliedMealType(mealType);
    void loadRecipes({ search, meal_type: mealType });
  };

  const handleResetFilters = () => {
    setSearch('');
    setMealType('');
    setAppliedSearch('');
    setAppliedMealType('');
    void loadRecipes({ search: '', meal_type: '' });
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
        <View style={styles.filterCard}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtras</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Paieška pagal pavadinimą</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Ieškoti receptų"
              placeholderTextColor={colors.textMute}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={handleApplyFilters}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Valgio tipas</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={mealType}
                onValueChange={(itemValue) => setMealType(itemValue)}
                style={styles.picker}
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
            <Pressable style={styles.filterButton} onPress={handleApplyFilters}>
              <Text style={styles.filterButtonText}>Filtruoti</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Receptai</Text>
          <Text style={styles.resultsCount}>{filteredRecipes.length} receptai</Text>
        </View>

        {isFetching ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Receptų nerasta</Text>
            <Text style={styles.emptyText}>Pabandykite kitą paieškos žodį arba pakeiskite valgio tipą.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredRecipes}
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 14,
  },
  filterHeader: {
    gap: 4,
  },
  filterTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  filterDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  filterActions: {
    gap: 10,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.textPrimary,
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    color: colors.textPrimary,
  },
  filterButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
  resetButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
  },
  resultsTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  resultsCount: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginTop: 8,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginTop: 10,
  },
  pageButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  pageButtonDisabled: {
    backgroundColor: colors.border,
  },
  pageButtonText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 14,
  },
  pageText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
