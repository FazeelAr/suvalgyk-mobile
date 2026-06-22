import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { blogService } from '../services/blogService';
import { resolveMediaUrl } from '../lib/media';
import { spacing } from '../theme/spacing';
import OptimizedImage from '../components/OptimizedImage';
import Markdown from 'react-native-markdown-display';
import { useSettings } from '../contexts/SettingsContext';

export default function BlogDetailScreen({ route }: any) {
  const { slug } = route.params || {};
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { colors, t } = useSettings();
  const navigation = useNavigation<any>();

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

  const markdownStyles = {
    body: { color: colors.textPrimary, fontSize: 15, lineHeight: 24 },
    heading1: { fontSize: 24, fontWeight: 'bold' as const, marginTop: 16, marginBottom: 8, color: colors.textPrimary },
    heading2: { fontSize: 20, fontWeight: 'bold' as const, marginTop: 16, marginBottom: 8, color: colors.textPrimary },
    heading3: { fontSize: 18, fontWeight: 'bold' as const, marginTop: 12, marginBottom: 6, color: colors.textPrimary },
    paragraph: { marginTop: 0, marginBottom: 12 },
    list_item: { marginBottom: 4 },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('BlogList')}>
          <Text style={[styles.backButtonText, { color: colors.primary }]}>{t('common.back')}</Text>
        </TouchableOpacity>
        
        <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {imageUrl ? <OptimizedImage uri={imageUrl} style={styles.heroImage} /> : null}
          <Text style={[styles.title, { color: colors.textPrimary }]}>{post?.title}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>{post?.meta_description}</Text>
        </View>

        <View style={[styles.contentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  meta: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 14,
  },
  contentCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
