export type RecipeList = {
  id: string;
  title: string;
  slug: string;
  budget: string;
  meal_type: string;
  image: string;
  one_liner_description: string;
  image_alt_text: string;
};

export type RecipeStep = {
  id: number;
  action?: string;
  text?: string;
  description: string;
  order: number;
};

export type DiscountItem = {
  id: number;
  item_name: string;
  price: number;
  currency: string;
  shop: string;
  created_at: string;
};

export type RecipeIngredient = {
  id: number;
  name: string;
  emoji?: string;
  amount?: string;
  discount?: DiscountItem;
};

export type Recipe = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  tips: string;
  meal_type: string;
  budget: string;
  estimated_cost: string;
  servings: number;
  steps: RecipeStep[];
  ingredients: RecipeIngredient[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  image_alt_text: string;
  prep_time_min?: number;
  cook_time_min?: number;
  total_time_min?: number;
  prep_time?: number;
  cook_time?: number;
  total_time?: number;
  difficulty?: "easy" | "medium" | "hard";
  rating_count?: number;
  rating_value?: number | null;
};

export type BlogList = {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  image: string;
};

export type Blog = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  meta_description: string;
  meta_keywords: string;
  image: string;
  content: string;
};

export type MealOption = {
  value: string;
  label: string;
  emoji: string;
};
