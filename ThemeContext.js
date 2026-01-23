import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HERO_THEMES, DEFAULT_HERO_THEME } from './constants/heroThemes';

export const ThemeContext = createContext({
    themeMode: 'light', // 'light', 'dark'
    setThemeMode: () => { },
    isDark: false,
    heroTheme: DEFAULT_HERO_THEME,
    setHeroTheme: () => { },
    defaultFrom: 'নরসিংদী',
    setDefaultFrom: () => { },
    defaultTo: 'ঢাকা',
    setDefaultTo: () => { },
});

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');
    const [isDark, setIsDark] = useState(false);
    const [heroTheme, setHeroTheme] = useState(DEFAULT_HERO_THEME);
    const [defaultFrom, setDefaultFrom] = useState('নরসিংদী');
    const [defaultTo, setDefaultTo] = useState('ঢাকা');

    // Load saved preferences
    useEffect(() => {
        const loadTheme = async () => {
            try {
                // Load App Theme (Light/Dark)
                const savedTheme = await AsyncStorage.getItem('user_theme_preference');
                if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
                    setThemeMode(savedTheme);
                    setIsDark(savedTheme === 'dark');
                }

                // Load Hero Theme (Colors)
                const savedHeroThemeId = await AsyncStorage.getItem('user_hero_theme_id');
                if (savedHeroThemeId) {
                    const found = HERO_THEMES.find(t => t.id === savedHeroThemeId);
                    if (found) setHeroTheme(found);
                }

                // Load Default Stations
                const savedFrom = await AsyncStorage.getItem('default_from');
                const savedTo = await AsyncStorage.getItem('default_to');
                if (savedFrom) setDefaultFrom(savedFrom);
                if (savedTo) setDefaultTo(savedTo);
            } catch (e) {
                console.warn('Failed to load theme preferences:', e);
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

    const changeHeroTheme = async (theme) => {
        setHeroTheme(theme);
        try {
            await AsyncStorage.setItem('user_hero_theme_id', theme.id);
        } catch (e) {
            console.warn('Failed to save hero theme:', e);
        }
    };

    const changeDefaultFrom = async (val) => {
        setDefaultFrom(val);
        try {
            await AsyncStorage.setItem('default_from', val);
        } catch (e) {
            console.warn('Failed to save default from:', e);
        }
    };

    const changeDefaultTo = async (val) => {
        setDefaultTo(val);
        try {
            await AsyncStorage.setItem('default_to', val);
        } catch (e) {
            console.warn('Failed to save default to:', e);
        }
    };

    return (
        <ThemeContext.Provider value={{
            themeMode,
            setThemeMode: changeThemeMode,
            isDark,
            heroTheme,
            setHeroTheme: changeHeroTheme,
            defaultFrom,
            setDefaultFrom: changeDefaultFrom,
            defaultTo,
            setDefaultTo: changeDefaultTo,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => useContext(ThemeContext);
