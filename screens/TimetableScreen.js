import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text as RNText,
  Alert,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  IconButton,
} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import TrainCard from '../components/TrainCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LiveDot from '../components/LiveDot';
import DropdownSelector from '../components/DropdownSelector';

import { fetchAndCacheRoute, loadFromCache } from '../utils/dataFetcher';

import useUpdatePrompt from '../hooks/useUpdatePrompt';

import trainDetailsData from '../assets/trainDetails.json';

const LOCATIONS = ['কমলাপুর', 'এয়ারপোর্ট', 'নরসিংদী', 'মেথিকান্দা', 'ভৈরব'];

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
  hours = hours % 12 || 12;
  return `${engToBengaliDigit(hours.toString().padStart(2, '0'))}:${engToBengaliDigit(minutes.toString().padStart(2, '0'))}`;
};

const getBengaliDate = (date) => {
  const day = engToBengaliDigit(date.getDate());
  const month = bengaliMonths[date.toLocaleDateString('en-US', { month: 'long' })];
  const year = engToBengaliDigit(date.getFullYear());
  return `${day} ${month}, ${year}`;
};

const TimetableScreen = () => {
  useUpdatePrompt();
  const navigation = useNavigation();
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('কমলাপুর');
  const [trains, setTrains] = useState([]);
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rawData, setRawData] = useState([]);
  const [passedTrains, setPassedTrains] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Load default stations on focus
  useFocusEffect(
    useCallback(() => {
      const loadDefaultStations = async () => {
        try {
          const savedFrom = await AsyncStorage.getItem('default_from');
          const savedTo = await AsyncStorage.getItem('default_to');
          if (savedFrom) setFrom(savedFrom);
          if (savedTo) setTo(savedTo);
        } catch (e) {
          console.warn('Error loading default stations:', e);
        }
      };
      loadDefaultStations();
    }, [])
  );

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
        { from: 'নরসিংদী', to: 'কমলাপুর' },
        { from: 'নরসিংদী', to: 'এয়ারপোর্ট' },
        { from: 'কমলাপুর', to: 'নরসিংদী' },
        { from: 'এয়ারপোর্ট', to: 'নরসিংদী' },
        { from: 'মেথিকান্দা', to: 'কমলাপুর' },
        { from: 'মেথিকান্দা', to: 'এয়ারপোর্ট' },
        { from: 'কমলাপুর', to: 'মেথিকান্দা' },
        { from: 'এয়ারপোর্ট', to: 'মেথিকান্দা' },
        { from: 'ভৈরব', to: 'কমলাপুর' },
        { from: 'ভৈরব', to: 'এয়ারপোর্ট' },
        { from: 'কমলাপুর', to: 'ভৈরব' },
        { from: 'এয়ারপোর্ট', to: 'ভৈরব' },
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
          <IconButton icon="calendar" size={24} iconColor="#fff" onPress={() => {
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
    <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 4 }}>
      <View style={styles.topRow}>
        <View style={styles.leftTopRow}>
          <Icon name="clock-outline" size={34} color="#000" style={{ marginRight: 4, marginTop: 4, marginLeft: 16 }} />
          <RNText style={styles.bigTime}>{getBengaliTime(currentTime)}</RNText>
        </View>
        <View style={styles.rightTopRow}>
          <RNText style={styles.mediumWeekday}>
            {bengaliDays[date.toLocaleDateString('en-US', { weekday: 'long' })]}
          </RNText>
          <RNText style={styles.fullDate}>{getBengaliDate(date)}</RNText>
        </View>
      </View>

      <View style={styles.dropdownRow}>
        <DropdownSelector options={LOCATIONS} selected={from} onChange={setFrom} circular icon="map-marker" />
        <View style={styles.journeyLine}>
          <View style={styles.journeyDot} />
          <View style={styles.journeyLineBar} />
          <View style={styles.journeyDot} />

          <Pressable
            onPress={() => {
              const temp = from;
              setFrom(to);
              setTo(temp);
            }}
            style={styles.reverseButton}
          >
            <Icon name="swap-horizontal" size={24} color="#fff" />
          </Pressable>

        </View>
        <DropdownSelector options={LOCATIONS} selected={to} onChange={setTo} circular icon="map-marker" />
      </View>

      {trains === null && (
        <View>
          <View style={styles.errorBox}>
            <Icon name="alert-circle" size={20} color="#d32f2f" style={{ marginRight: 4 }} />
            <RNText style={styles.errorText}>দুঃখিত! এই রুটের জন্য সময়সূচী খুঁজে পাওয়া যায়নি।</RNText>
          </View>
        </View>
      )}

      {Array.isArray(trains) && trains.length === 0 && passedTrains.length > 0 && (
        <>
          <View style={styles.noTrainsBox}>
            <Icon name="information" size={20} color="#2E7D32" style={{ marginRight: 4 }} />
            <RNText style={styles.noTrainsText}>আজকের জন্য এই রুটে আর কোনো ট্রেন নেই।</RNText>
          </View>

          <TouchableOpacity
            style={styles.nextDayButton}
            onPress={() => {
              const tomorrow = new Date(date);
              tomorrow.setDate(date.getDate() + 1);
              setTempDate(tomorrow);
              setShowDatePicker(true);
            }}
          >
            <RNText style={styles.nextDayButtonText}>পরবর্তী দিনের ট্রেনসমূহ দেখুন</RNText>
          </TouchableOpacity>
        </>
      )}

      {Array.isArray(trains) && trains.length > 0 && (
        <>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.nextDepartureTitle}>
              পরবর্তী ট্রেন {getNextDepartureIn()} পর
            </Text>
            <LiveDot />
          </View>

          <TouchableOpacity onPress={() => goToTrainDetails(trains[0]['Train No.'])}>
            <TrainCard train={trains[0]} highlight showHeading />
          </TouchableOpacity>

          {(trains.length > 1 || passedTrains.length > 0) && (
            <FlatList
              data={[
                ...(trains.length > 1 ? [{ type: 'upcomingHeader' }] : []),
                ...trains.slice(1).map(item => ({ type: 'train', item })),
                ...(passedTrains.length > 0 ? [{ type: 'passedToggle' }] : []),
                ...(expanded ? passedTrains.map(item => ({ type: 'passed', item })) : []),
              ]}
              keyExtractor={(item, index) => {
                if (item.type === 'train' || item.type === 'passed') return item.item['Train No.'] || index.toString();
                return item.type + index.toString();
              }}
              renderItem={({ item }) => {
                if (item.type === 'upcomingHeader') {
                  return (
                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.upcomingTitle}>আজকের দিনের অন্যান্য ট্রেনসমূহ</Text>
                    </View>
                  );
                }
                if (item.type === 'train') {
                  return (
                    <TouchableOpacity onPress={() => goToTrainDetails(item.item['Train No.'])}>
                      <TrainCard train={item.item} highlight={false} showHeading={false} />
                    </TouchableOpacity>
                  );
                }
                if (item.type === 'passedToggle') {
                  return (
                    <TouchableOpacity
                      onPress={() => setExpanded(!expanded)}
                      style={styles.expandableHeader}
                    >
                      <Text style={styles.noTrainsText}>ইতিমধ্যে ছেড়ে যাওয়া ট্রেনসমূহ</Text>
                      <Icon
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#2E7D32"
                      />
                    </TouchableOpacity>
                  );
                }
                if (item.type === 'passed') {
                  return (
                    <TouchableOpacity onPress={() => goToTrainDetails(item.item['Train No.'])}>
                      <TrainCard train={item.item} highlight={false} passed showHeading={false} />
                    </TouchableOpacity>
                  );
                }
                return null;
              }}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </>
      )}

      {Array.isArray(trains) && trains.length === 0 && passedTrains.length === 0 && (
        <View style={styles.noTrainsBox}>
          <Icon name="information" size={20} color="#2E7D32" style={{ marginRight: 4 }} />
          <RNText style={styles.noTrainsText}>আজকের জন্য এই রুটে আর কোনো ট্রেন নেই।</RNText>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            if (event.type === 'set' && selectedDate) {
              setDate(selectedDate);
              setShowDatePicker(false);
            } else {
              setShowDatePicker(false);
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  leftTopRow: { flexDirection: 'row', alignItems: 'center' },
  bigTime: { fontSize: 32, fontWeight: '700', color: '#000', marginRight: 12 },
  rightTopRow: { flexDirection: 'column', alignItems: 'flex-end' },
  mediumWeekday: { fontSize: 16, fontWeight: '700', color: '#000', marginRight: 16 },
  fullDate: { fontSize: 12, fontWeight: '700', color: '#000', marginBottom: 12, marginRight: 16 },
  sectionTitleContainer: { flexDirection: 'row', marginVertical: 8, alignItems: 'center' },
  nextDepartureTitle: { fontSize: 18, fontWeight: '700', color: '#2e7d32' },
  upcomingTitle: { fontSize: 16, fontWeight: '700', color: '#555' },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffcdd2', padding: 8, borderRadius: 6, marginVertical: 12 },
  errorText: { color: '#d32f2f', fontSize: 16, margin: 4 },
  noTrainsBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#C8E6C9', padding: 8, borderRadius: 6, marginVertical: 12 },
  noTrainsText: { color: '#2E7D32', fontSize: 16, margin: 4 },
  dropdownRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8, alignItems: 'center' },
  journeyLine: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  journeyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4caf50' },
  journeyLineBar: { width: 60, height: 2, backgroundColor: '#4caf50' },
  reverseButton: {
    position: 'absolute',
    top: '5%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: '#4caf50',
    borderRadius: 24,
    padding: 4,
    elevation: 3,
    zIndex: 10,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#C8E6C9', padding: 8, borderRadius: 6, marginVertical: 12
  },
  nextDayButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    alignSelf: 'center',
  },
  nextDayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default TimetableScreen;
