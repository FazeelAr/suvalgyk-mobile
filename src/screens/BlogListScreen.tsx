import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Image, ScrollView } from 'react-native';
import { blogService } from '../services/blogService';
import { resolveMediaUrl } from '../lib/media';
import { spacing } from '../theme/spacing';
import OptimizedImage from '../components/OptimizedImage';
import ErrorState from '../components/ErrorState';
import { useSettings } from '../contexts/SettingsContext';

export default function BlogListScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { colors, t } = useSettings();

  const loadBlogs = () => {
    setLoading(true);
    setError('');
    blogService
      .getBlogPosts()
      .then((d: any) => setPosts(Array.isArray(d) ? d : d.results || []))
      .catch((err) => {
        setError(
          err.message === 'Network Error' || !err.response 
            ? 'Nepavyko užmegzti ryšio su serveriu. Patikrinkite interneto ryšį.' 
            : t('common.error')
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBlogs();
  }, [t]);

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderPostCard = (item: any) => {
    const imageUrl = resolveMediaUrl(item.image);

    return (
      <Pressable style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => navigation.navigate('BlogDetail', { slug: item.slug })}>
        {imageUrl ? (
          <OptimizedImage uri={imageUrl} style={[styles.cardImage, { borderColor: colors.border }]} />
        ) : (
          <View style={[styles.cardPlaceholder, { backgroundColor: colors.creamWarm, borderColor: colors.border }]}>
            <Text style={styles.cardPlaceholderText}>📝</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.title}</Text>
          <Text style={[styles.cardDescription, { color: colors.textSecondary }]} numberOfLines={3}>
            {item.meta_description}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: colors.creamWarm, borderBottomColor: colors.border }]}>
          <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>{t('tab.blogs')}</Text>
          <Text style={[styles.heroText, { color: colors.textSecondary }]}>
            {t('blog.heroText')}
          </Text>
          <Image source={require('../../assets/blog.png')} style={styles.heroImage} />
        </View>

        {error ? (
          <ErrorState 
            message={error} 
            onRetry={loadBlogs} 
          />
        ) : null}

        {!error && posts.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t('blog.notFound')}</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('blog.emptyDesc')}
            </Text>
          </View>
        ) : null}

        <View style={styles.postsWrap}>
          {posts.map((item) => (
            <View key={item.id?.toString() || item.slug}>
              {renderPostCard(item)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: 20,
  },
  postsWrap: {
    paddingHorizontal: spacing.md,
    gap: 12,
    paddingTop: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
    gap: 16,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    height: undefined,
    borderRadius: 12,
    borderWidth: 1,
    resizeMode: 'cover',
  },
  cardPlaceholder: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPlaceholderText: {
    fontSize: 34,
  },
  cardBody: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 24,
  },
  heroCard: {
    borderBottomWidth: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 16,
    gap: 10,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  heroText: {
    fontSize: 14,
    lineHeight: 20,
  },
  heroImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  emptyState: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    lineHeight: 19,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
