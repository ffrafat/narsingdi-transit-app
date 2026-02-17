import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

const DEFAULT_FAVORITES = ['ঢাকা', 'বিমানবন্দর', 'নরসিংদী', 'ভৈরব', 'সিলেট', 'চট্টগ্রাম'];
const STORAGE_KEY = '@favorite_stations';

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
    const [isLoading, setIsLoading] = useState(true);

    // Load favorites from AsyncStorage on mount
    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored !== null) {
                setFavorites(JSON.parse(stored));
            } else {
                // First time - save defaults
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FAVORITES));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveFavorites = async (newFavorites) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
            setFavorites(newFavorites);
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    const toggleFavorite = (station) => {
        if (favorites.includes(station)) {
            // Prevent removing if it would leave less than 2 favorites
            if (favorites.length <= 2) {
                console.warn('Cannot remove favorite: At least 2 stations must remain in favorites');
                return;
            }
            const newFavorites = favorites.filter(s => s !== station);
            saveFavorites(newFavorites);
        } else {
            const newFavorites = [...favorites, station];
            saveFavorites(newFavorites);
        }
    };

    const isFavorite = (station) => {
        return favorites.includes(station);
    };

    const getFavorites = () => {
        return favorites;
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            toggleFavorite,
            isFavorite,
            getFavorites,
            isLoading
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};
