import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, ImageBackground, Text as RNText } from 'react-native';
import { Text, Button, Card, useTheme, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DropdownSelector from '../components/DropdownSelector';
import NetInfo from '@react-native-community/netinfo';
import { fetchAndCacheRoute } from '../utils/dataFetcher';
import { useAppTheme } from '../ThemeContext';
import { HERO_THEMES } from '../constants/heroThemes';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const stationList = ['ঢাকা', 'তেজগাঁও', 'বিমানবন্দর', 'নরসিংদী', 'মেথিকান্দা', 'দৌলতকান্দি', 'ভৈরব'];

const SettingsScreen = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  const {
    themeMode,
    setThemeMode,
    heroTheme,
    setHeroTheme,
    defaultFrom,
    setDefaultFrom,
    defaultTo,
    setDefaultTo
  } = useAppTheme();

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

  const HeaderContent = () => (
    <View style={styles.headerTitleWrapper}>
      {/* Title is handled by navigation header */}
    </View>
  );

  return (
    <View style={styles.container}>
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
                style={[styles.headerGradient, { backgroundColor: 'transparent' }]}
                opacity={0.85}
              >
                <HeaderContent />
              </LinearGradient>
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={heroTheme.colors}
              style={styles.headerGradient}
            >
              <HeaderContent />
            </LinearGradient>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Database update card - NOW FIRST */}
        <Surface style={styles.surface} elevation={1}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(65, 171, 93, 0.08)' }]}>
              <Icon name="cloud-sync-outline" size={22} color={theme.colors.primary} />
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
            আপডেট করুন
          </Button>
        </Surface>

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
              <DropdownSelector options={stationList} selected={defaultFrom} onChange={setDefaultFrom} />
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>যাত্রা শেষ</Text>
              <DropdownSelector options={stationList} selected={defaultTo} onChange={setDefaultTo} />
            </View>
          </View>
        </Surface>

        {/* Theme selection card */}
        <Surface style={styles.surface} elevation={1}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(65, 171, 93, 0.08)' }]}>
              <Icon name="palette-outline" size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerText}>কালার মোড</Text>
          </View>

          <View style={styles.themeToggleRow}>
            <Button
              mode={themeMode === 'light' ? 'contained' : 'text'}
              onPress={() => setThemeMode('light')}
              style={styles.themeBtn}
              icon="weather-sunny"
              labelStyle={{ fontFamily: 'AnekBangla_700Bold' }}
              compact
            >
              লাইট
            </Button>
            <Button
              mode={themeMode === 'dark' ? 'contained' : 'text'}
              onPress={() => setThemeMode('dark')}
              style={styles.themeBtn}
              icon="weather-night"
              labelStyle={{ fontFamily: 'AnekBangla_700Bold' }}
              compact
            >
              ডার্ক
            </Button>
          </View>
        </Surface>

        {/* Hero Theme Selection */}
        <Surface style={styles.surface} elevation={1}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(65, 171, 93, 0.08)' }]}>
              <Icon name="image-outline" size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerText}>ব্যাকগ্রাউন্ড থিম</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.heroThemeScroll}>
            {HERO_THEMES.map((t) => {
              const isActive = heroTheme.id === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setHeroTheme(t)}
                  activeOpacity={0.8}
                  style={[
                    styles.heroThemeCard,
                    isActive && styles.heroThemeCardActive
                  ]}
                >
                  <View style={styles.heroThemePreviewContainer}>
                    {t.image ? (
                      <ImageBackground
                        source={t.image}
                        style={styles.heroThemePreview}
                        imageStyle={{ borderRadius: 10 }}
                      >
                        <LinearGradient
                          colors={['rgba(0,0,0,0.5)', 'transparent']}
                          style={StyleSheet.absoluteFill}
                        />
                        <LinearGradient
                          colors={t.colors}
                          style={StyleSheet.absoluteFill}
                          opacity={0.85}
                        />
                        {isActive && (
                          <View style={styles.selectionOverlay}>
                            <Icon name="check-circle" size={24} color="#FFFFFF" />
                          </View>
                        )}
                      </ImageBackground>
                    ) : (
                      <LinearGradient
                        colors={t.colors}
                        style={styles.heroThemePreview}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        {isActive && (
                          <View style={styles.selectionOverlay}>
                            <Icon name="check-circle" size={24} color="#FFFFFF" />
                          </View>
                        )}
                      </LinearGradient>
                    )}
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.heroThemeName,
                      isActive && styles.heroThemeNameActive
                    ]}
                  >
                    {t.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Surface>

        {/* Sections below moved above locally within the single chunk */}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerWrapper: {
    // Basic wrapper
  },
  headerGradientContainer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#075d37', // Fallback base color
  },
  headerBackgroundImage: {
    width: '100%',
  },
  headerGradient: {
    paddingTop: insets.top + 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrapper: {
    height: 30,
  },
  content: {
    padding: 12,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  surface: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(65, 171, 93, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    fontSize: 17,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  half: {
    width: '47%',
  },
  label: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    marginBottom: 8,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionBtn: {
    borderRadius: 12,
    marginTop: 0,
    height: 42,
    justifyContent: 'center',
  },
  btnLabel: {
    fontSize: 14,
    fontFamily: 'AnekBangla_800ExtraBold',
    paddingVertical: 0,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 16,
    lineHeight: 18,
    fontFamily: 'AnekBangla_600SemiBold',
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
  heroThemeScroll: {
    paddingVertical: 4,
    paddingRight: 20,
    gap: 12,
  },
  heroThemeCard: {
    width: 95,
    alignItems: 'center',
    borderRadius: 14,
    padding: 2,
    opacity: 0.6,
  },
  heroThemeCardActive: {
    opacity: 1,
  },
  heroThemePreviewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 6,
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  heroThemePreview: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroThemeName: {
    fontSize: 10,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  heroThemeNameActive: {
    color: theme.colors.primary,
    fontFamily: 'AnekBangla_800ExtraBold',
  },
});

export default SettingsScreen;

