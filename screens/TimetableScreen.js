import React, { useEffect, useState, useLayoutEffect, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text as RNText,
  Alert,
  Pressable,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import {
  Text,
  IconButton,
  useTheme,
  Surface,
  Button,
} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import TrainCard from '../components/TrainCard';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import PulsingTimerIcon from '../components/PulsingTimerIcon';
import DropdownSelector from '../components/DropdownSelector';

import { fetchAndCacheRoute, loadFromCache } from '../utils/dataFetcher';
import { useAppTheme } from '../ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useUpdatePrompt from '../hooks/useUpdatePrompt';

import trainDetailsData from '../assets/trainDetails.json';

const LOCATIONS = ['ঢাকা', 'তেজগাঁও', 'বিমানবন্দর', 'নরসিংদী', 'মেথিকান্দা', 'দৌলতকান্দি', 'ভৈরব'];

const bengaliDays = {
  Sunday: 'রবিবার',
  Monday: 'সোমবার',
  Tuesday: 'মঙ্গলবার',
  Wednesday: 'বুধবার',
  Thursday: 'বৃহস্পতিবার',
  Friday: 'শুক্রবার',
  Saturday: 'শনিবার',
};

const engToBengaliDigit = (input) => {
  const digitMap = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return input.toString().split('').map(char => digitMap[char] || char).join('');
};

const bengaliMonths = {
  January: 'জানুয়ারি',
  February: 'ফেব্রুয়ারি',
  March: 'মার্চ',
  April: 'এপ্রিল',
  May: 'মে',
  June: 'জুন',
  July: 'জুলাই',
  August: 'আগস্ট',
  September: 'সেপ্টেম্বর',
  October: 'অক্টোবর',
  November: 'নভেম্বর',
  December: 'ডিসেম্বর',
};

const getBengaliTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'অপ.' : 'পূ.';
  hours = hours % 12 || 12;
  return {
    time: `${engToBengaliDigit(hours.toString().padStart(2, '0'))}:${engToBengaliDigit(minutes.toString().padStart(2, '0'))}`,
    period: period
  };
};

const getBengaliDate = (date) => {
  const day = engToBengaliDigit(date.getDate());
  const month = bengaliMonths[date.toLocaleDateString('en-US', { month: 'long' })];
  const year = engToBengaliDigit(date.getFullYear());
  return `${day} ${month}, ${year}`;
};

const TimetableScreen = () => {
  const { themeMode, heroTheme, defaultFrom, defaultTo } = useAppTheme();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, insets);
  useUpdatePrompt();
  const navigation = useNavigation();
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('ঢাকা');
  const initialized = useRef(false);
  const [trains, setTrains] = useState([]);
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [passedTrains, setPassedTrains] = useState([]);
  const [expanded, setExpanded] = useState(false);


  // ✅ Sync local state whenever global default settings change
  useEffect(() => {
    setFrom(defaultFrom);
    setTo(defaultTo);
  }, [defaultFrom, defaultTo]);




  // Initial data fetch & caching
  useEffect(() => {
    const init = async () => {
      const allRoutes = [
        { from: 'নরসিংদী', to: 'ঢাকা' },
        { from: 'নরসিংদী', to: 'বিমানবন্দর' },
        { from: 'নরসিংদী', to: 'তেজগাঁও' },

        { from: 'ঢাকা', to: 'নরসিংদী' },
        { from: 'বিমানবন্দর', to: 'নরসিংদী' },
        { from: 'তেজগাঁও', to: 'নরসিংদী' },


        { from: 'মেথিকান্দা', to: 'ঢাকা' },
        { from: 'মেথিকান্দা', to: 'বিমানবন্দর' },
        { from: 'মেথিকান্দা', to: 'তেজগাঁও' },

        { from: 'ঢাকা', to: 'মেথিকান্দা' },
        { from: 'বিমানবন্দর', to: 'মেথিকান্দা' },
        { from: 'তেজগাঁও', to: 'মেথিকান্দা' },


        { from: 'ভৈরব', to: 'ঢাকা' },
        { from: 'ভৈরব', to: 'বিমানবন্দর' },
        { from: 'ভৈরব', to: 'তেজগাঁও' },

        { from: 'ঢাকা', to: 'ভৈরব' },
        { from: 'বিমানবন্দর', to: 'ভৈরব' },
        { from: 'তেজগাঁও', to: 'ভৈরব' },


        { from: 'দৌলতকান্দি', to: 'ঢাকা' },
        { from: 'দৌলতকান্দি', to: 'বিমানবন্দর' },
        { from: 'দৌলতকান্দি', to: 'তেজগাঁও' },

        { from: 'ঢাকা', to: 'দৌলতকান্দি' },
        { from: 'বিমানবন্দর', to: 'দৌলতকান্দি' },
        { from: 'তেজগাঁও', to: 'দৌলতকান্দি' },
      ];

      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected;
      const cachedKeys = await AsyncStorage.getAllKeys();
      const hasAnyCache = cachedKeys.some(k => k.startsWith('route_'));

      if (!hasAnyCache && !isConnected) {
        Alert.alert(
          'ইন্টারনেট সংযোগ নেই',
          'প্রথমবার ডেটাবেজ আপডেট করতে ইন্টারনেট চালু করুন। তবে পরবর্তীতে আর ইন্টারনেট প্রয়োজন নেই। অ্যাপটি সম্পূর্ণ অফলাইনে কাজ করবে।',
          [{ text: 'ঠিক আছে' }]
        );
        return;
      }

      if (isConnected) {
        for (const route of allRoutes) {
          await fetchAndCacheRoute(route.from, route.to);
        }
      }
    };

    init();
  }, []);

  // Filter trains by time and off day
  const filterAndSetTrains = (data) => {
    const engToday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const today = bengaliDays[engToday];
    const now = new Date();

    const withTimes = data
      .filter(item => item['Off Day'] !== today && item['From Station Time'])
      .map(item => {
        const [h, m] = item['From Station Time'].split(':').map(Number);
        const trainTime = new Date(date);
        trainTime.setHours(h, m, 0, 0);
        return { ...item, __trainTime: trainTime };
      });

    const upcoming = withTimes
      .filter(item => item.__trainTime >= now)
      .sort((a, b) => a.__trainTime - b.__trainTime);

    const passed = withTimes
      .filter(item => item.__trainTime < now)
      .sort((a, b) => b.__trainTime - a.__trainTime); // reverse order

    setTrains(upcoming);
    setPassedTrains(passed);
  };

  // Fetch data from AsyncStorage cache
  const fetchData = useCallback(async () => {
    setTrains([]);

    const cacheKey = `route_${from}_${to}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const data = JSON.parse(cached);
        setRawData(data);
        filterAndSetTrains(data);
      } else {
        setTrains(null);
      }
    } catch (e) {
      console.error('❌ Failed to load from cache', e);
      setTrains(null);
    }
  }, [from, to, date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Re-filter every minute for accurate next train display
  useEffect(() => {
    const interval = setInterval(() => {
      if (rawData.length > 0) {
        filterAndSetTrains(rawData);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [rawData, date]);

  // Move date pill to navigation header right
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.navDatePill}
          activeOpacity={0.7}
          onPress={() => setShowDatePicker(true)}
        >
          <RNText style={styles.navDateText}>{getBengaliDate(date)}</RNText>
          <Icon name="chevron-down" size={14} color="#FFFFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, date, styles]);
  // Next departure countdown text
  const getNextDepartureIn = () => {
    if (!trains?.length) return '';
    const now = new Date();
    const [h, m] = trains[0]['From Station Time'].split(':').map(Number);
    const departure = new Date(date);
    departure.setHours(h, m, 0, 0);
    let diff = departure - now;
    if (diff < 0) diff += 86400000; // add 24h if negative
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${engToBengaliDigit(hrs)} ঘন্টা ${engToBengaliDigit(mins)} মিনিট`;
  };

  // Helper to navigate to train details
  const goToTrainDetails = (trainNo) => {
    const details = trainDetailsData[trainNo];
    if (details) {
      navigation.navigate('TrainDetails', { trainDetails: details, trainNo: trainNo });
    } else {
      Alert.alert('তথ্য নেই', 'এই ট্রেনের বিস্তারিত তথ্য পাওয়া যায়নি।');
    }
  };

  // Header Content Sub-component
  const HeaderContent = () => (
    <>
      {/* New Two-Line Countdown - Middle aligned and balanced */}
      {Array.isArray(trains) && trains.length > 0 && (
        <View style={styles.headerCountdownWrapper}>
          <RNText style={styles.headerCountdownLabel}>পরবর্তী ট্রেন</RNText>
          <View style={styles.countdownValueRow}>
            <PulsingTimerIcon size={18} color="#FFFFFF" />
            <RNText style={styles.headerCountdownValue}>
              {getNextDepartureIn()}
              <RNText style={styles.headerCountdownSuffixInline}> পর</RNText>
            </RNText>
          </View>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Immersive Header and Floating Selector Container */}
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

        {/* Floating Journey Selector */}
        <Surface style={styles.floatingSelector} elevation={2}>
          <View style={styles.selectorRow}>
            <View style={styles.stationBlock}>
              <View style={styles.hintRow}>
                <RNText style={styles.selectorHint}>যাত্রা</RNText>
              </View>
              <DropdownSelector
                options={LOCATIONS}
                selected={from}
                onChange={setFrom}
              />
            </View>

            <View style={styles.swapBtnWrapper}>
              <TouchableOpacity
                style={styles.swapBtn}
                activeOpacity={0.8}
                onPress={() => {
                  const temp = from;
                  setFrom(to);
                  setTo(temp);
                }}
              >
                <Icon name="swap-horizontal" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.stationBlock}>
              <View style={[styles.hintRow, { justifyContent: 'flex-end' }]}>
                <RNText style={styles.selectorHint}>গন্তব্য</RNText>
              </View>
              <DropdownSelector
                options={LOCATIONS}
                selected={to}
                onChange={setTo}
              />
            </View>
          </View>
        </Surface>
      </View>

      {trains === null && (
        <View style={styles.emptyState}>
          <Icon name="calendar-question" size={64} color={theme.colors.outlineVariant} />
          <RNText style={styles.emptyText}>এই রুটে কোনো তথ্য নেই</RNText>
        </View>
      )}

      {Array.isArray(trains) && trains.length === 0 && passedTrains.length > 0 && (
        <ScrollView contentContainerStyle={styles.centeredList}>
          <View style={styles.allPassedContainer}>
            <Icon name="check-circle-outline" size={48} color={theme.colors.primary} />
            <RNText style={styles.allPassedText}>আজকের সব ট্রেন ছেড়ে গেছে</RNText>

            <Button
              mode="contained"
              onPress={() => {
                const tomorrow = new Date(date);
                tomorrow.setDate(date.getDate() + 1);
                setDate(tomorrow);
              }}
              style={styles.tomorrowBtn}
            >
              আগামীকালের সূচী দেখুন
            </Button>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Icon name="clock-check-outline" size={20} color={theme.colors.outline} />
              <RNText style={styles.passedHeaderText}>ছেড়ে যাওয়া ট্রেন</RNText>
            </View>
            <View style={styles.headerLine} />
          </View>

          {passedTrains.map(item => <TrainCard key={item['Train No.']} train={item} passed />)}
        </ScrollView>
      )}

      {Array.isArray(trains) && trains.length > 0 && (
        <FlatList
          data={[
            { type: 'hero', item: trains[0] },
            ...trains.slice(1).map(item => ({ type: 'train', item })),
            ...(passedTrains.length > 0 ? [{ type: 'passedHeader' }] : []),
            ...passedTrains.map(item => ({ type: 'passed', item })),
          ]}
          keyExtractor={(item, index) => item.type + (item.item?.['Train No.'] || index)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'hero') return <TrainCard train={item.item} highlight />;
            if (item.type === 'train') return <TrainCard train={item.item} />;
            if (item.type === 'passedHeader') return (
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Icon name="clock-check-outline" size={20} color={theme.colors.outline} />
                  <RNText style={styles.passedHeaderText}>ছেড়ে যাওয়া ট্রেন</RNText>
                </View>
                <View style={styles.headerLine} />
              </View>
            );
            if (item.type === 'passed') return <TrainCard train={item.item} passed />;
            return null;
          }}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="calendar"
          accentColor={theme.colors.primary}
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) setDate(selectedDate);
            setShowDatePicker(false);
          }}
        />
      )}
    </View>
  );
}

const getStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerWrapper: {
    // Removed zIndex: 100 to avoid covering the transparent navigation header
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
    paddingTop: insets.top + 60, // Account for transparent header height
    paddingBottom: 75,
    paddingHorizontal: 20,
  },
  navDatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginRight: 10,
  },
  navDateText: {
    fontSize: 12,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: '#FFFFFF',
    marginRight: 4,
  },
  headerCountdownWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  countdownValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerCountdownLabel: {
    fontSize: 12,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerCountdownValue: {
    fontSize: 22,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  headerCountdownSuffixInline: {
    fontSize: 12,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  floatingSelector: {
    marginTop: -55,
    marginHorizontal: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 4,
  },
  selectorRow: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stationBlock: {
    flex: 1,
  },
  selectorHint: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 4,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  swapBtnWrapper: {
    paddingTop: 20, // To align with the dropdown pills
    marginHorizontal: 12,
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  listContainer: {
    paddingTop: 4, // Further reduced to move cards significantly higher up
    paddingBottom: 30,
  },
  nextTrainBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(65, 171, 93, 0.08)',
  },
  timerIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(65, 171, 93, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  bannerInfo: {
    flex: 1,
  },
  nextTrainLabel: {
    fontSize: 11,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.8,
  },
  countdownText: {
    fontSize: 18,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    marginTop: 2,
  },
  liveStatus: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(65, 171, 93, 0.12)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(65, 171, 93, 0.15)',
  },
  sectionHeaderText: {
    fontSize: 13,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.primary,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  passedHeaderText: {
    fontSize: 13,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.outline,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.outline,
  },
  allPassedContainer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  allPassedText: {
    fontSize: 20,
    fontFamily: 'AnekBangla_700Bold',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  tomorrowBtn: {
    borderRadius: 14,
    paddingVertical: 4,
  },
  centeredList: {
    padding: 12,
  },
});




export default TimetableScreen;
