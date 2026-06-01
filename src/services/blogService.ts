import api from '../config/api';
import { Blog, BlogList } from '../types';

export const blogService = {
  getBlogPosts: async (filters: Record<string, any> = {}): Promise<BlogList[] | { results: BlogList[] }> => {
    try {
      const response = await api.get('/api/blogs/', {
        params: {
          language: 'lt',
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      const status = (error as any)?.response?.status;
      if (status !== 404) {
        console.error('Error fetching blog posts:', error);
      }
      return [];
    }
  },

  getBlogPostDetail: async (slug: string): Promise<Blog> => {
    try {
      const response = await api.get(`/api/blogs/${slug}/`, {
        params: { language: 'lt' },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog detail for ${slug}:`, error);
      throw error;
    }
  },
};
