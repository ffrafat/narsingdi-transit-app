import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
    themeMode: 'light', // 'light', 'dark'
    setThemeMode: () => { },
    isDark: false,
});

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');
    const [isDark, setIsDark] = useState(false);

    // Load saved preference
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('user_theme_preference');
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    setThemeMode(savedTheme);
                    setIsDark(savedTheme === 'dark');
                }
            } catch (e) {
                console.warn('Failed to load theme preference:', e);
            }
        };
        loadTheme();
    }, []);

    const changeThemeMode = async (mode) => {
        setThemeMode(mode);
        setIsDark(mode === 'dark');
        try {
            await AsyncStorage.setItem('user_theme_preference', mode);
        } catch (e) {
            console.warn('Failed to save theme preference:', e);
        }
    };

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode: changeThemeMode, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
