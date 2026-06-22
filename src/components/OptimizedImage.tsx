import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';
import { colors } from '../theme/colors';

interface OptimizedImageProps {
  uri?: string;
  style?: any;
  placeholder?: string; // base64 blur placeholder
  onLoadComplete?: () => void;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  aspectRatio?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  uri,
  style,
  placeholder,
  onLoadComplete,
  resizeMode = 'cover',
  aspectRatio = 16 / 9,
}) => {
  const [error, setError] = useState(false);

  if (!uri) {
    return (
      <View style={[styles.placeholder, { aspectRatio }, style]}>
        <Text style={styles.placeholderText}>🍳</Text>
      </View>
    );
  }

  const contentFit: ImageContentFit = resizeMode === 'cover' ? 'cover' : 'contain';

  return (
    <View style={[{ aspectRatio, overflow: 'hidden' }, style]}>
      <Image
        style={StyleSheet.absoluteFill}
        source={uri}
        placeholder={placeholder}
        contentFit={contentFit}
        transition={300}
        onLoad={() => onLoadComplete?.()}
        onError={() => setError(true)}
        cachePolicy="memory-disk"
      />
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
