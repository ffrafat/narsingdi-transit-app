import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_WIDTH = 1000;  // your image size
const MAP_HEIGHT = 1000;

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MapScreen = () => {
  const scale = useSharedValue(2.5); // initial zoom
  const savedScale = useSharedValue(2);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // center on mount
  useEffect(() => {
    const centerOffsetX = (MAP_WIDTH * scale.value - SCREEN_WIDTH) / -2;
    const centerOffsetY = (MAP_HEIGHT * scale.value - SCREEN_HEIGHT) / -2;

    translateX.value = centerOffsetX;
    translateY.value = centerOffsetY;
    savedTranslateX.value = centerOffsetX;
    savedTranslateY.value = centerOffsetY;
  }, []);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startScale = savedScale.value;
    },
    onActive: (event, ctx) => {
      scale.value = ctx.startScale * event.scale;
    },
    onEnd: () => {
      savedScale.value = scale.value;
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = savedTranslateX.value;
      ctx.startY = savedTranslateY.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
});

export default MapScreen;
