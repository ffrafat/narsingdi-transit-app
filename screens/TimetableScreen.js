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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import LiveDot from '../components/LiveDot';
import DropdownSelector from '../components/DropdownSelector';

import { fetchAndCacheRoute, loadFromCache } from '../utils/dataFetcher';

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
  const period = hours >= 12 ? 'pm' : 'am';
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
  const theme = useTheme();
  const styles = getStyles(theme);
  useUpdatePrompt();
  const navigation = useNavigation();
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('ঢাকা');
  const initialized = useRef(false);
  const [trains, setTrains] = useState([]);
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rawData, setRawData] = useState([]);
  const [passedTrains, setPassedTrains] = useState([]);
  const [expanded, setExpanded] = useState(false);


  // ✅ Only load default stations ONCE on first render
  useEffect(() => {
    const loadDefaultStationsOnce = async () => {
      if (initialized.current) return;
      try {
        const savedFrom = await AsyncStorage.getItem('default_from');
        const savedTo = await AsyncStorage.getItem('default_to');
        if (savedFrom) setFrom(savedFrom);
        if (savedTo) setTo(savedTo);
      } catch (e) {
        console.warn('Error loading default stations:', e);
      }
      initialized.current = true;
    };
    loadDefaultStationsOnce();
  }, []);



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, []);

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

  // Header calendar button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="calendar" size={24} iconColor={theme.colors.onPrimary} onPress={() => {
            setTempDate(date);
            setShowDatePicker(true);
          }} />
        </View>
      ),
    });
  }, [navigation, date]);

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

  return (
    <View style={styles.container}>
      {/* Immersive Header */}
      <LinearGradient
        colors={['#075d37', '#41ab5d']}
        style={styles.headerGradient}
      >
        <View style={styles.headerTop}>
          <View>
            <TouchableOpacity
              style={styles.headerDateContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <RNText style={styles.headerDateText}>{getBengaliDate(date)}</RNText>
              <Icon name="chevron-down" size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerTimeContainer}>
            <View style={styles.timeIconContainer}>
              <Icon name="clock-outline" size={16} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={styles.timeDisplay}>
              <RNText style={styles.headerTimeText}>{getBengaliTime(currentTime).time}</RNText>
              <RNText style={styles.timePeriod}>{getBengaliTime(currentTime).period}</RNText>
            </View>
          </View>
        </View>

        {/* Floating Journey Selector */}
        <Surface style={styles.floatingSelector} elevation={4}>
          <View style={styles.selectorRow}>
            <View style={styles.stationBlock}>
              <RNText style={styles.selectorHint}>যাত্রা</RNText>
              <DropdownSelector options={LOCATIONS} selected={from} onChange={setFrom} />
            </View>

            <TouchableOpacity
              style={styles.swapBtn}
              onPress={() => {
                const temp = from;
                setFrom(to);
                setTo(temp);
              }}
            >
              <Icon name="swap-horizontal" size={24} color={theme.colors.primary} />
            </TouchableOpacity>

            <View style={[styles.stationBlock, { alignItems: 'flex-end' }]}>
              <RNText style={styles.selectorHint}>গন্তব্য</RNText>
              <DropdownSelector options={LOCATIONS} selected={to} onChange={setTo} />
            </View>
          </View>
        </Surface>
      </LinearGradient>

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

          <View style={styles.passedHeader}>
            <RNText style={styles.passedHeaderText}>ছেড়ে যাওয়া ট্রেন ({passedTrains.length})</RNText>
            <View style={styles.headerLine} />
          </View>

          {passedTrains.map(item => <TrainCard key={item['Train No.']} train={item} passed />)}
        </ScrollView>
      )}

      {Array.isArray(trains) && trains.length > 0 && (
        <FlatList
          data={[
            { type: 'status' },
            { type: 'hero', item: trains[0] },
            ...(trains.length > 1 ? [{ type: 'subHeader' }] : []),
            ...trains.slice(1).map(item => ({ type: 'train', item })),
            ...(passedTrains.length > 0 ? [{ type: 'passedHeader' }] : []),
            ...passedTrains.map(item => ({ type: 'passed', item })),
          ]}
          keyExtractor={(item, index) => item.type + (item.item?.['Train No.'] || index)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === 'status') {
              return (
                <View style={styles.nextTrainBanner}>
                  <View style={styles.bannerInfo}>
                    <RNText style={styles.nextTrainLabel}>পরবর্তী ট্রেন</RNText>
                    <RNText style={styles.countdownText}>{getNextDepartureIn()} পর</RNText>
                  </View>
                  <LiveDot />
                </View>
              );
            }
            if (item.type === 'hero') return <TrainCard train={item.item} highlight />;
            if (item.type === 'subHeader') return (
              <View style={styles.sectionHeader}>
                <RNText style={styles.sectionHeaderText}>আজকের অন্যান্য ট্রেন</RNText>
                <View style={styles.headerLine} />
              </View>
            );
            if (item.type === 'train') return <TrainCard train={item.item} />;
            if (item.type === 'passedHeader') {
              return (
                <View style={styles.sectionHeader}>
                  <RNText style={styles.sectionHeaderText}>ছেড়ে যাওয়া ট্রেন ({passedTrains.length})</RNText>
                  <View style={styles.headerLine} />
                </View>
              );
            }
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
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) setDate(selectedDate);
            setShowDatePicker(false);
          }}
        />
      )}
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 70,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
  },
  headerDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerDateText: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '900',
    marginRight: 6,
  },
  headerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  timeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'transparent',
  },
  headerTimeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timePeriod: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'lowercase',
  },
  floatingSelector: {
    position: 'absolute',
    bottom: -65,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  swapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  nextTrainBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryContainer,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  bannerInfo: {
    flex: 1,
  },
  nextTrainLabel: {
    fontSize: 12,
    color: theme.colors.onPrimaryContainer,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  countdownText: {
    fontSize: 18,
    color: theme.colors.onPrimaryContainer,
    fontWeight: '900',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.outline,
    marginRight: 10,
    textTransform: 'uppercase',
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
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
    color: theme.colors.outline,
    fontWeight: 'bold',
  },
  allPassedContainer: {
    alignItems: 'center',
    padding: 30,
    marginTop: 20,
  },
  allPassedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  tomorrowBtn: {
    borderRadius: 14,
    paddingVertical: 4,
  },
  passedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  passedHeaderText: {
    fontSize: 14,
    fontWeight: '900',
    color: theme.colors.outline,
    marginRight: 10,
    textTransform: 'uppercase',
  },
  centeredList: {
    padding: 12,
  },
});




export default TimetableScreen;
