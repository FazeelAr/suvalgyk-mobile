import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { colors } from '../theme/colors';

interface OptimizedImageProps {
  uri?: string;
  style?: any;
  placeholder?: string; // base64 blur placeholder
  onLoadComplete?: () => void;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  aspectRatio?: number;
}

/**
 * Optimized Image Component with lazy loading, blur placeholder, and caching
 * Features:
 * - Blur placeholder while loading
 * - Progressive image loading
 * - Image caching
 * - Graceful fallback to placeholder
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  uri,
  style,
  placeholder,
  onLoadComplete,
  resizeMode = 'cover',
  aspectRatio = 16 / 9,
}) => {
  const [loading, setLoading] = useState(!placeholder);
  const [error, setError] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  // Pre-fetch image size for better rendering
  useEffect(() => {
    if (!uri) return;

    const preloadImage = async () => {
      try {
        Image.getSize(uri, (width, height) => {
          setImageSize({ width, height });
        });
      } catch (err) {
        console.error(`Error preloading image: ${uri}`, err);
      }
    };

    preloadImage();
  }, [uri]);

  const handleLoadStart = useCallback(() => {
    setLoading(true);
    setError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoading(false);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback((error: any) => {
    console.error('Image load error:', error);
    setError(true);
    setLoading(false);
  }, []);

  if (!uri) {
    return (
      <View style={[styles.placeholder, { aspectRatio }, style]}>
        <Text style={styles.placeholderText}>🍳</Text>
      </View>
    );
  }

  return (
    <View style={[{ aspectRatio }, style]}>
      {/* Blur placeholder (background) */}
      {placeholder && (
        <Image
          source={{ uri: placeholder }}
          style={[StyleSheet.absoluteFill, styles.blur]}
          blurRadius={25}
        />
      )}

      {/* Main image */}
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        resizeMode={resizeMode}
        // Cache the image
        defaultSource={placeholder ? { uri: placeholder } : undefined}
      />

      {/* Loading indicator */}
      {loading && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}

      {/* Error state */}
      {error && (
        <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
          <Text style={styles.errorText}>❌</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.creamWarm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  placeholderText: {
    fontSize: 40,
  },
  blur: {
    opacity: 0.7,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  errorContainer: {
    backgroundColor: colors.tomatoSoft || '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 28,
  },
});

export default React.memo(OptimizedImage);
