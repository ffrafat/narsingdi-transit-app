import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const LiveDot = () => {
  const theme = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  return (
    <View style={styles.dotContainer}>
      <Animated.View style={[styles.dot, { opacity, transform: [{ scale }], backgroundColor: theme.colors.primary }]} />
      <View style={[styles.innerDot, { backgroundColor: theme.colors.primary }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  dotContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginVertical: 6,
  },
  dot: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default LiveDot;

