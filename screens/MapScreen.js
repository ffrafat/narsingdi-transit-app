// screens/MapScreen.js
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MapScreen = () => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const pinchHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = event.scale;
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    },
    onEnd: () => {
      scale.value = withTiming(1);
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onEnd: () => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={panHandler}>
      <Animated.View style={styles.container}>
        <PinchGestureHandler onGestureEvent={pinchHandler}>
          <Animated.View>
            <AnimatedImage
              source={require('../assets/route-map.png')}
              style={[styles.image, animatedStyle]}
              resizeMode="contain"
            />
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 1000,
    height: 1000,
  },
});

export default MapScreen;
