import api from '../config/api';
import { Recipe, RecipeList } from '../types';

export type RecipeRequestParams = {
  products?: string;
  dietary_preferences?: string;
  meal_type?: string;
  image_url?: string;
};

export type RecipeRequestResponse = {
  success: boolean;
  request_id: string;
  recipe_slug: string | null;
  message: string;
};

export type RecipeStatusResponse = {
  id: string;
  status: 'processing' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  recipe_slug?: string;
  recipe_id?: string;
};

export const recipeService = {
  // Fetch all public recipes
  getRecipes: async (filters: Record<string, any> = {}): Promise<{ count: number; next: string | null; previous: string | null; results: RecipeList[] }> => {
    try {
      const response = await api.get('/api/recipes/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw parseError(error);
    }
  },

  // Fetch single recipe by its slug
  getRecipeBySlug: async (slug: string): Promise<Recipe> => {
    try {
      const response = await api.get(`/api/recipes/by-slug/${slug}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe with slug ${slug}:`, error);

      // Backend occasionally returns 500 for by-slug even when the recipe exists.
      // Fallback 1: fetch by id suffix from slug (e.g. ...-995a7345).
      const slugParts = slug.split('-');
      const idCandidate = slugParts[slugParts.length - 1];

      if (idCandidate && /^[a-f0-9]{8}$/i.test(idCandidate)) {
        try {
          const fallbackById = await api.get(`/api/recipes/${idCandidate}/`);
          return fallbackById.data;
        } catch (fallbackError) {
          console.error(`Fallback by id failed for slug ${slug}:`, fallbackError);
        }
      }

      // Fallback 2: search list and match exact slug if present.
      try {
        const fallbackList = await api.get('/api/recipes/', {
          params: { search: slug, page_size: 50 },
        });

        const results = Array.isArray(fallbackList.data)
          ? fallbackList.data
          : (fallbackList.data?.results || []);
        const exactMatch = results.find((r: any) => r?.slug === slug);

        if (exactMatch?.id) {
          const fallbackByMatchedId = await api.get(`/api/recipes/${exactMatch.id}/`);
          return fallbackByMatchedId.data;
        }
      } catch (fallbackError) {
        console.error(`Fallback by search failed for slug ${slug}:`, fallbackError);
      }

      throw parseError(error);
    }
  },

  // Get related recipes
  getRelatedRecipes: async (slug: string): Promise<RecipeList[]> => {
    try {
      const response = await api.get(`/api/recipes/${slug}/related/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching related recipes for ${slug}:`, error);
      return [];
    }
  },

  // Create a new recipe request (AI generation)
  createRecipeRequest: async (data: RecipeRequestParams): Promise<RecipeRequestResponse> => {
    try {
      // POST requests need longer timeout for cloud backend processing
      const response = await api.post('/api/recipe-requests/', {
        products: data.products || '',
        dietary_prefs: data.dietary_preferences || '',
        meal_type: data.meal_type || 'lunch',
        budget: 'budget',
        language: 'lt', // Lithuania
        image_url: data.image_url || '',
      }, { timeout: 60000 }); // 60 seconds for recipe generation
      
      return {
        success: true,
        request_id: response.data.id,
        recipe_slug: response.data.recipe_slug || null,
        message: response.data.message || 'Generation started',
      };
    } catch (error) {
      console.error('Error creating recipe request:', error);
      throw parseError(error);
    }
  },

  // Poll for recipe generation status
  getRecipeRequestStatus: async (requestId: string): Promise<RecipeStatusResponse> => {
    try {
      const response = await api.get(`/api/recipe-requests/${requestId}/status/`);
      return response.data;
    } catch (error) {
      console.error(`Error checking status for request ${requestId}:`, error);

      // Fallback for deployments where trailing slash routing is inconsistent.
      try {
        const fallback = await api.get(`/api/recipe-requests/${requestId}/status`);
        return fallback.data;
      } catch (fallbackError) {
        console.error(`Fallback status check failed for request ${requestId}:`, fallbackError);
        throw parseError(error);
      }
    }
  },

  // Submit recipe rating/feedback
  submitFeedback: async (recipeId: string, vote: boolean, comment: string): Promise<any> => {
    try {
      const response = await api.post('/api/recipe-feedback/', {
        recipe: recipeId,
        vote: vote,
        comment: comment || '',
        language: 'lt',
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw parseError(error);
    }
  },
};

function parseError(error: any): Error {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === 'string') {
      if (/<html|<body|Server Error/i.test(data)) {
        return new Error('Serveris laikinai nepasiekiamas (500). Bandykite dar kartą.');
      }
      return new Error(data);
    }
    if (typeof data === 'object' && typeof data.detail === 'string' && /<html|Server Error/i.test(data.detail)) {
      return new Error('Serveris laikinai nepasiekiamas (500). Bandykite dar kartą.');
    }
    if (data.detail) return new Error(data.detail);
    if (data.error) return new Error(data.error);
    return new Error(JSON.stringify(data));
  }

  if (typeof error?.message === 'string' && /<html|Server Error/i.test(error.message)) {
    return new Error('Serveris laikinai nepasiekiamas (500). Bandykite dar kartą.');
  }

  return error || new Error('Network Connection Error');
}
