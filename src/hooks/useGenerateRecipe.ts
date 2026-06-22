import { useState, useCallback, useRef } from 'react';
import { recipeService } from '../services/recipeService';
import { API_BASE_URL } from '../config/env';

export const useGenerateRecipe = () => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState('');
  const pollIntervalRef = useRef<any>(null);
  const pollTimeoutRef = useRef<any>(null);

  const cleanTimers = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const generateRecipe = useCallback(async (formData: any, onSuccess?: (slug: string) => void) => {
    cleanTimers();
    setGenerating(true);
    setError(null);
    setProgressMsg('Gaminamas receptas...');

    try {
      // If we have a local image URI, upload it first
      if (formData.image_uri) {
        setProgressMsg('Įkeliama nuotrauka...');
        const imageUrl = await recipeService.uploadImage(formData.image_uri);
        formData.image_url = imageUrl;
        delete formData.image_uri;
      }

      setProgressMsg('Gaminamas receptas...');
      const response = await recipeService.createRecipeRequest(formData);

      if (response.success) {
        const { request_id, recipe_slug } = response;

        if (recipe_slug) {
          setGenerating(false);
          if (onSuccess) onSuccess(recipe_slug);
          return;
        }

        setProgressMsg('Mūsų šefas galvoja jūsų receptą... (gali užtrukti iki 1 min.)');

        let pollCount = 0;
        let consecutiveStatusErrors = 0;

        pollIntervalRef.current = setInterval(async () => {
          pollCount++;
          try {
            const statusData = await recipeService.getRecipeRequestStatus(request_id);
            consecutiveStatusErrors = 0;
            if (statusData.status === 'approved' && statusData.recipe_slug) {
              cleanTimers();
              setGenerating(false);
              if (onSuccess) onSuccess(statusData.recipe_slug as string);
            } else if (statusData.status === 'rejected') {
              cleanTimers();
              setGenerating(false);
              setError('Recepto generavimas buvo atmestas. Prašome patikrinti ingredientus.');
            } else {
              const dots = '.'.repeat((pollCount % 3) + 1);
              setProgressMsg(`Mūsų šefas galvoja jūsų receptą${dots}`);
            }
          } catch (statusErr) {
            console.error('Error polling recipe status:', statusErr);
            consecutiveStatusErrors += 1;

            if (consecutiveStatusErrors >= 3) {
              cleanTimers();
              setGenerating(false);
              setError(
                `Nepavyko gauti recepto būsenos iš serverio. Patikrinkite interneto ryšį ir bandykite dar kartą.`
              );
            }
          }
        }, 10000);

        pollTimeoutRef.current = setTimeout(() => {
          cleanTimers();
          setGenerating(false);
          setError('Gavimo laikas baigėsi (5 min). Receptas gali dar būti kuriamas. Bandykite dar kartą.');
        }, 300000);
      } else {
        setGenerating(false);
        setError('Nepavyko sukurti recepto užklausos.');
      }
    } catch (err: any) {
      cleanTimers();
      setGenerating(false);
      
      // Better error messages for common issues
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Serveris neatsako (timeout). Patikrinkite interneto ryšį ir bandykite dar kartą.');
      } else if (err.message?.includes('Network')) {
        setError('Tinklo klaida. Patikrinkite savo interneto ryšį.');
      } else if (err.response?.status === 429) {
        setError('Per daug užklausų. Palaukite kelias minutes ir bandykite dar kartą.');
      } else {
        setError(err.message || 'Nepavyko sugeneruoti recepto. Bandykite dar kartą.');
      }
    }
  }, []);

  return { generateRecipe, generating, error, progressMsg, cancel: cleanTimers };
};
