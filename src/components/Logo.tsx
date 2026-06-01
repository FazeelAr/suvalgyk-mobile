import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { resolveMediaUrl } from '../lib/media';

const logoUrl = resolveMediaUrl('https://media.suvalgyk.lt/suvalgyk-lt-logo.svg');
const supportsRasterLogo = Boolean(logoUrl && /\.(png|jpe?g|webp|gif)$/i.test(logoUrl));

type Props = {
  size?: number;
};

export default function Logo({ size = 120 }: Props) {
  if (logoUrl && /\.svg$/i.test(logoUrl)) {
    return (
      <WebView
        source={{
          html: `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: transparent;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: left center;
        display: block;
      }
    </style>
  </head>
  <body>
    <img src="${logoUrl}" alt="Suvalgyk" />
  </body>
</html>`,
        }}
        style={[styles.webView, { width: size, height: Math.round(size * 0.46) }]}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pointerEvents="none"
        originWhitelist={["*"]}
      />
    );
  }

  if (logoUrl && supportsRasterLogo) {
    return (
      <Image
        source={{ uri: logoUrl }}
        resizeMode="contain"
        style={[styles.image, { width: size, height: Math.round(size * 0.46) }]}
      />
    );
  }

  return (
    <View style={[styles.fallback, { minHeight: Math.round(size * 0.46) }]}>
      <Text style={styles.fallbackText}>SUVALGYK</Text>
      <Text style={styles.leaf}>🌿</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    maxWidth: '100%',
  },
  webView: {
    backgroundColor: 'transparent',
    opacity: 0.99,
  },
  fallback: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#1f4d35',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fallbackText: {
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  leaf: {
    fontSize: 14,
  },
});
