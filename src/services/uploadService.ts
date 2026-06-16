import { API_BASE_URL, API_KEY } from '../config/env';

export const uploadService = {
  uploadImage: async (uri: string): Promise<string> => {
    try {
      const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const filename = `upload.${ext}`;

      const formData = new FormData();
      formData.append('image', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await fetch(`${API_BASE_URL}/recipes/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Api-Key ${API_KEY}`, // Include API Key if required by Django
        },
      });

      if (!response.ok) {
        throw new Error('Nepavyko įkelti nuotraukos į serverį');
      }

      const data = await response.json();
      return data.image_url;
    } catch (error) {
      console.error('Error uploading image via Django backend:', error);
      throw new Error('Nepavyko įkelti nuotraukos. Pabandykite dar kartą.');
    }
  },
};
