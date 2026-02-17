import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import bundledData from './assets/trainDetails.json';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [trainData, setTrainData] = useState(bundledData);
    const [version, setVersion] = useState(bundledData._metadata?.version || '0');
    const [loading, setLoading] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [lastChecked, setLastChecked] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // BASE_URL for GitHub updates
    const BASE_URL = 'https://raw.githubusercontent.com/ffrafat/narsingdi-transit-app/refs/heads/dev/assets';

    // Load data and auto-check on startup
    useEffect(() => {
        const init = async () => {
            await loadData();
            await autoCheckUpdates();
        };
        init();
    }, []);

    const loadData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('train_data_v2');
            const storedLastChecked = await AsyncStorage.getItem('last_update_check');
            const storedLastUpdated = await AsyncStorage.getItem('last_update_success');

            if (storedLastChecked) setLastChecked(parseInt(storedLastChecked));
            if (storedLastUpdated) setLastUpdated(parseInt(storedLastUpdated));

            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const bundledVersion = bundledData._metadata?.version || '0';
                const storedVersion = parsedData._metadata?.version || '0';

                // String comparison for version (YYMM.DD.XXX)
                if (storedVersion > bundledVersion) {
                    setTrainData(parsedData);
                    setVersion(storedVersion);
                } else {
                    await AsyncStorage.removeItem('train_data_v2');
                }
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const autoCheckUpdates = async () => {
        try {
            const lastCheck = await AsyncStorage.getItem('last_update_check');
            const now = Date.now();
            const ONE_DAY = 24 * 60 * 60 * 1000;

            if (!lastCheck || now - parseInt(lastCheck) > ONE_DAY) {
                console.log('Running scheduled update check...');
                const updateRes = await checkVersionOnly();
                if (updateRes) {
                    setUpdateAvailable(true);
                }
                const checkTime = Date.now();
                await AsyncStorage.setItem('last_update_check', checkTime.toString());
                setLastChecked(checkTime);
            }
        } catch (e) {
            console.log('Auto-check skipped:', e.message);
        }
    };

    const checkVersionOnly = async () => {
        try {
            // Fetch tiny version.json instead of full file
            const response = await fetch(`${BASE_URL}/version.json`, { headers: { 'Cache-Control': 'no-cache' } });
            if (!response.ok) return false;
            const remote = await response.json();
            return remote.version > version;
        } catch (e) {
            return false;
        }
    };

    const checkForUpdates = async (isManual = false) => {
        setLoading(true);
        try {
            const netState = await NetInfo.fetch();
            if (!netState.isConnected) {
                if (isManual) Alert.alert('ইন্টারনেট সংযোগ নেই', 'অনুগ্রহ করে ইন্টারনেটে সংযুক্ত হয়ে আবার চেষ্টা করুন।');
                setLoading(false);
                return;
            }

            console.log('Checking for full updates...');
            const response = await fetch(`${BASE_URL}/trainDetails.json`, { headers: { 'Cache-Control': 'no-cache' } });

            if (!response.ok) throw new Error('Network request failed');

            const newData = await response.json();
            const newVersion = newData._metadata?.version || 0;

            if (newVersion > version) {
                Alert.alert(
                    'নতুন আপডেট পাওয়া গেছে',
                    `নতুন সময়সূচি (v${newVersion}) পাওয়া গেছে। আপনি কি আপডেট করতে চান?`,
                    [
                        { text: 'না', style: 'cancel' },
                        {
                            text: 'হ্যাঁ, আপডেট করুন',
                            onPress: async () => {
                                try {
                                    const now = Date.now();
                                    await AsyncStorage.setItem('train_data_v2', JSON.stringify(newData));
                                    await AsyncStorage.setItem('last_update_success', now.toString());
                                    setTrainData(newData);
                                    setVersion(newVersion);
                                    setLastUpdated(now);
                                    setUpdateAvailable(false);
                                    Alert.alert('সফল', 'সময়সূচি সফলভাবে আপডেট করা হয়েছে!');
                                } catch (e) {
                                    Alert.alert('ত্রুটি', 'আপডেট সেভ করতে সমস্যা হয়েছে।');
                                }
                            }
                        }
                    ]
                );
            } else if (isManual) {
                Alert.alert('কোনো আপডেট নেই', 'আপনার অ্যাপে সর্বশেষ সময়সূচি দেওয়া আছে।');
            }

            // Update last checked time on every manual check
            const checkTime = Date.now();
            await AsyncStorage.setItem('last_update_check', checkTime.toString());
            setLastChecked(checkTime);
        } catch (error) {
            if (isManual) Alert.alert('আপডেট চেক ব্যর্থ', 'সার্ভারের সাথে সংযোগ করা যাচ্ছে না।');
        } finally {
            setLoading(false);
        }
    };

    const resetToFactory = async () => {
        try {
            await AsyncStorage.removeItem('train_data_v2');
            await AsyncStorage.removeItem('last_update_success');
            setTrainData(bundledData);
            setVersion(bundledData._metadata?.version || '0');
            setLastUpdated(null);
            setUpdateAvailable(false);
            Alert.alert('রিসেট সফল', 'অ্যাপটি অরিজিনাল অবস্থায় ফিরে এসেছে।');
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <DataContext.Provider value={{
            trains: trainData,
            version,
            loading,
            updateAvailable,
            lastChecked,
            lastUpdated,
            checkForUpdates,
            resetToFactory
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useTrainData = () => useContext(DataContext);
