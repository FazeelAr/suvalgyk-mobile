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
  getRecipes: async (filters: Record<string, any> = {}): Promise<RecipeList[] | { results: RecipeList[] }> => {
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
      const response = await api.post('/api/recipe-requests/', {
        products: data.products || '',
        dietary_prefs: data.dietary_preferences || '',
        meal_type: data.meal_type || 'lunch',
        budget: 'budget',
        language: 'lt', // Lithuania
        image_url: data.image_url || '',
      });
      
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
      throw parseError(error);
    }
  },

  // Submit recipe rating/feedback
  submitFeedback: async (recipeId: string, rating: number, comment: string): Promise<any> => {
    try {
      const response = await api.post('/api/recipe-feedback/', {
        recipe: recipeId,
        rating: rating,
        comment: comment || '',
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
    if (typeof data === 'string') return new Error(data);
    if (data.detail) return new Error(data.detail);
    if (data.error) return new Error(data.error);
    return new Error(JSON.stringify(data));
  }
  return error || new Error('Network Connection Error');
}
