import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import AppHeader from '../components/AppHeader';
import { blogService } from '../services/blogService';
import { colors } from '../theme/colors';
import { resolveMediaUrl } from '../lib/media';
import { spacing } from '../theme/spacing';
import OptimizedImage from '../components/OptimizedImage';
import Markdown from 'react-native-markdown-display';

export default function BlogDetailScreen({ route }: any) {
  const { slug } = route.params || {};
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogService.getBlogPostDetail(slug).then((d) => setPost(d)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={[styles.center, { flex: 1, backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const imageUrl = resolveMediaUrl(post?.image);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          {imageUrl ? <OptimizedImage uri={imageUrl} style={styles.heroImage} /> : null}
          <Text style={styles.title}>{post?.title}</Text>
          <Text style={styles.meta}>{post?.meta_description}</Text>
        </View>

        <View style={styles.contentCard}>
          <Markdown style={markdownStyles}>{post?.content || ''}</Markdown>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: 12,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  content: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: colors.textPrimary,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
  },
  list_item: {
    marginBottom: 4,
  },
});
