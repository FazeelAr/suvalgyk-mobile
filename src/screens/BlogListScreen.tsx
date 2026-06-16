import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Image, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { blogService } from '../services/blogService';
import { resolveMediaUrl } from '../lib/media';
import { spacing } from '../theme/spacing';
import OptimizedImage from '../components/OptimizedImage';

export default function BlogListScreen({ navigation }: any) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    blogService
      .getBlogPosts()
      .then((d: any) => setPosts(Array.isArray(d) ? d : d.results || []))
      .catch((err) => setError(err instanceof Error ? err.message : 'Nepavyko įkelti tinklaraščio.'))
      .finally(() => setLoading(false));
  }, []);

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
      <Pressable style={styles.card} onPress={() => navigation.navigate('BlogDetail', { slug: item.slug })}>
        {imageUrl ? (
          <OptimizedImage uri={imageUrl} style={styles.cardImage} />
        ) : (
          <View style={styles.cardPlaceholder}>
            <Text style={styles.cardPlaceholderText}>📝</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription} numberOfLines={3}>
            {item.meta_description}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Tinklaraštis</Text>
          <Text style={styles.heroText}>
            Straipsniai ir naujienos iš mūsų virtuvės, pateikti taip pat, kaip svetainės mobiliajame vaizde.
          </Text>
          <OptimizedImage uri="https://suvalgyk.lt/blog.png" style={styles.heroImage} />
        </View>

        {error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Tinklaraštis laikinai nepasiekiamas</Text>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : null}

        {!error && posts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Straipsnių kol kas nėra</Text>
            <Text style={styles.emptyText}>
              Kai backend grąžins įrašus, jie čia bus rodomi su nuotraukomis ir santraukomis.
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
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: colors.creamWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPlaceholderText: {
    fontSize: 34,
  },
  cardBody: {
    padding: 14,
    gap: 6,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  heroCard: {
    backgroundColor: colors.creamWarm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 16,
    gap: 10,
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  heroText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  emptyState: {
    padding: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    marginHorizontal: spacing.md,
    marginTop: 12,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
