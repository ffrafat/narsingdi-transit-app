import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const PulsingTimerIcon = ({ size, color }) => {
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [pulseAnim]);

    const scale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.15],
    });

    const opacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.7, 1],
    });

    return (
        <Animated.View style={{ transform: [{ scale }], opacity }}>
            <Icon name="timer-outline" size={size} color={color} />
        </Animated.View>
    );
};

export default PulsingTimerIcon;
