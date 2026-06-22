import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useSettings } from '../contexts/SettingsContext';

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const opacity = new Animated.Value(0);
  const { colors, theme } = useSettings();

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.logoWrapper, { opacity }]}>
        <SvgUri
          width="240"
          height="120"
          uri="https://media.suvalgyk.lt/suvalgyk-lt-logo.svg"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
