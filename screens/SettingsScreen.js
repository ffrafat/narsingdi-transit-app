import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, useTheme, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropdownSelector from '../components/DropdownSelector';
import NetInfo from '@react-native-community/netinfo';
import { fetchAndCacheRoute } from '../utils/dataFetcher';
import { useAppTheme } from '../ThemeContext';

const stationList = ['ঢাকা', 'তেজগাঁও', 'বিমানবন্দর', 'নরসিংদী', 'মেথিকান্দা', 'দৌলতকান্দি', 'ভৈরব'];

const SettingsScreen = () => {
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('ঢাকা');
  const theme = useTheme();
  const styles = getStyles(theme);
  const { themeMode, setThemeMode } = useAppTheme();

  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const savedFrom = await AsyncStorage.getItem('default_from');
        const savedTo = await AsyncStorage.getItem('default_to');
        if (savedFrom) setFrom(savedFrom);
        if (savedTo) setTo(savedTo);
      } catch (e) {
        console.warn('Error loading settings:', e);
      }
    };
    loadDefaults();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('default_from', from);
      await AsyncStorage.setItem('default_to', to);
      Alert.alert('সেইভ হয়েছে', 'নতুন সেট করা স্টেশন দেখতে অ্যাপটি বন্ধ করে আবার চালু করুন।');
    } catch (e) {
      Alert.alert('সেইভ হয়নি', 'সেইভ করার সময় সমস্যা হয়েছে।');
      console.error('Error saving settings:', e);
    }
  };

  const handleManualUpdate = async () => {
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected || netState.isInternetReachable === false) {
        Alert.alert('ইন্টারনেট সংযোগ নেই', 'অনুগ্রহ করে ইন্টারনেটে সংযুক্ত হয়ে আবার চেষ্টা করুন।');
        return;
      }

      const routes = [
        ['নরসিংদী', 'ঢাকা'], ['নরসিংদী', 'বিমানবন্দর'], ['ঢাকা', 'নরসিংদী'], ['বিমানবন্দর', 'নরসিংদী'],
        ['মেথিকান্দা', 'ঢাকা'], ['মেথিকান্দা', 'বিমানবন্দর'], ['ঢাকা', 'মেথিকান্দা'], ['বিমানবন্দর', 'মেথিকান্দা'],
        ['ভৈরব', 'ঢাকা'], ['ভৈরব', 'বিমানবন্দর'], ['ঢাকা', 'ভৈরব'], ['বিমানবন্দর', 'ভৈরব'],
      ];

      for (const [from, to] of routes) {
        await fetchAndCacheRoute(from, to);
      }
      Alert.alert('আপডেটেড', 'ডেটা আপডেট সম্পন্ন হয়েছে!', [{ text: 'ঠিক আছে' }]);
    } catch (e) {
      Alert.alert('ঝামেলা হয়েছে', 'ডেটা আপডেট করা যায় নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।', [{ text: 'ঠিক আছে' }]);
      console.error(e);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageHeader}>অ্যাপ সেটিংস</Text>

      {/* Default station card */}
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <Icon name="map-marker-path" size={22} color={theme.colors.primary} />
          </View>
          <Text style={styles.headerText}>ডিফল্ট স্টেশন</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>যাত্রা শুরু</Text>
            <DropdownSelector options={stationList} selected={from} onChange={setFrom} />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>যাত্রা শেষ</Text>
            <DropdownSelector options={stationList} selected={to} onChange={setTo} />
          </View>
        </View>

        <Button
          icon="check-circle"
          mode="contained"
          style={styles.actionBtn}
          labelStyle={styles.btnLabel}
          onPress={handleSave}
        >
          পরিবর্তন সংরক্ষণ করুন
        </Button>
      </Surface>

      {/* Theme selection card */}
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.secondaryContainer }]}>
            <Icon name="palette-outline" size={22} color={theme.colors.secondary} />
          </View>
          <Text style={styles.headerText}>অ্যাপ থিম</Text>
        </View>

        <View style={styles.themeToggleRow}>
          <Button
            mode={themeMode === 'light' ? 'contained' : 'text'}
            onPress={() => setThemeMode('light')}
            style={styles.themeBtn}
            icon="weather-sunny"
            labelStyle={{ fontWeight: 'bold' }}
            compact
          >
            লাইট
          </Button>
          <Button
            mode={themeMode === 'dark' ? 'contained' : 'text'}
            onPress={() => setThemeMode('dark')}
            style={styles.themeBtn}
            icon="weather-night"
            labelStyle={{ fontWeight: 'bold' }}
            compact
          >
            ডার্ক
          </Button>
        </View>
      </Surface>

      {/* Database update card */}
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.errorContainer }]}>
            <Icon name="cloud-sync-outline" size={22} color={theme.colors.error} />
          </View>
          <Text style={styles.headerText}>তথ্য আপডেট</Text>
        </View>

        <Text style={styles.description}>
          অফলাইনে ব্যবহারের জন্য নতুন সময়সূচি ডাউনলোড বা আপডেট করতে নিচের বাটনে ক্লিক করুন।
        </Text>

        <Button
          icon="download-outline"
          mode="outlined"
          style={[styles.actionBtn, { borderColor: theme.colors.outline }]}
          labelStyle={[styles.btnLabel, { color: theme.colors.primary }]}
          onPress={handleManualUpdate}
        >
          এখনই আপডেট করুন
        </Button>
      </Surface>
    </ScrollView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  pageHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.outline,
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  surface: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  half: {
    width: '47%',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionBtn: {
    borderRadius: 12,
    marginTop: 4,
  },
  btnLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 2,
  },
  description: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 20,
    lineHeight: 18,
    fontWeight: '500',
  },
  themeToggleRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 4,
  },
  themeBtn: {
    flex: 1,
    borderRadius: 10,
  },
});

export default SettingsScreen;

