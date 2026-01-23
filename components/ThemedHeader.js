import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../ThemeContext';

const ThemedHeader = ({ children }) => {
    const insets = useSafeAreaInsets();
    const { heroTheme } = useAppTheme();

    return (
        <View style={styles.headerWrapper}>
            <View style={styles.headerGradientContainer}>
                {heroTheme.image ? (
                    <ImageBackground
                        source={heroTheme.image}
                        style={styles.headerBackgroundImage}
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.5)', 'transparent']}
                            style={StyleSheet.absoluteFill}
                        />
                        <LinearGradient
                            colors={heroTheme.colors}
                            style={[
                                styles.headerGradient,
                                {
                                    paddingTop: insets.top + 40,
                                    backgroundColor: 'transparent'
                                }
                            ]}
                            opacity={0.85}
                        >
                            <View style={styles.headerTitleWrapper}>
                                {children}
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                ) : (
                    <LinearGradient
                        colors={heroTheme.colors}
                        style={[
                            styles.headerGradient,
                            { paddingTop: insets.top + 40 }
                        ]}
                    >
                        <View style={styles.headerTitleWrapper}>
                            {children}
                        </View>
                    </LinearGradient>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerWrapper: {
        backgroundColor: '#FFFFFF', // Default bg
    },
    headerGradientContainer: {
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
    },
    headerBackgroundImage: {
        width: '100%',
    },
    headerGradient: {
        paddingBottom: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleWrapper: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ThemedHeader;
