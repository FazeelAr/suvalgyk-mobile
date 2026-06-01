import api from '../config/api';

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export const contactService = {
  submitContactForm: async (data: ContactFormData): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await api.post('/api/contact/create/', {
        name: data.name || '',
        email: data.email || '',
        message: data.message || '',
        language: 'lt',
      });
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Nepavyko išsiųsti žinutės.');
      }
      throw new Error('Tinklo klaida. Bandykite dar kartą.');
    }
  },
};
