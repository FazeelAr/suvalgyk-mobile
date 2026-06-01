import { useState, useEffect, useCallback } from 'react';
import { recipeService } from '../services/recipeService';
import { RecipeList } from '../types';

export const useRecipes = (initialFilters: Record<string, any> = {}) => {
  const [recipes, setRecipes] = useState<RecipeList[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  const fetchRecipes = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const queryFilters = {
        language: 'lt',
        ...filters
      };
      
      const data = await recipeService.getRecipes(queryFilters);
      const results = (data as any).results !== undefined ? (data as any).results : data;
      setRecipes(results);
    } catch (err: any) {
      setError(err.message || 'Nepavyko užkrauti receptų.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleRefresh = useCallback(() => {
    fetchRecipes(true);
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    refreshing,
    error,
    filters,
    updateFilters,
    refresh: handleRefresh,
  };
};
