import { useState, useEffect, useCallback } from 'react';
import { recipeService } from '../services/recipeService';

export const useRecipeDetail = (slug?: string) => {
  const [recipe, setRecipe] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getRecipeBySlug(slug);
      setRecipe(data);

      try {
        const relatedData = await recipeService.getRelatedRecipes(slug);
        setRelated((relatedData as any).results || relatedData);
      } catch (relErr) {
        console.warn('Error fetching related recipes:', relErr);
        setRelated([]);
      }
    } catch (err: any) {
      setError(err.message || 'Nepavyko užkrauti recepto.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { recipe, related, loading, error, refetch: fetchDetail };
};
