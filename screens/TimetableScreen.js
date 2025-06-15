import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text as RNText,
  Alert,
} from 'react-native';
import {
  Text,
  IconButton,
} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import TrainCard from '../components/TrainCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import LiveDot from '../components/LiveDot';
import DropdownSelector from '../components/DropdownSelector';


import { fetchAndCacheRoute, loadFromCache } from '../utils/dataFetcher';

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

const amPmMap = { AM: 'পূর্বাহ্ণ', PM: 'অপরাহ্ণ' };

const getBengaliTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
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
  const navigation = useNavigation();
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('কমলাপুর');
  const [trains, setTrains] = useState([]);
  const [date, setDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [rawData, setRawData] = useState([]);

useEffect(() => {
  const loadDefaultStations = async () => {
    const savedFrom = await AsyncStorage.getItem('default_from');
    const savedTo = await AsyncStorage.getItem('default_to');
    if (savedFrom) setFrom(savedFrom);
    if (savedTo) setTo(savedTo);
  };
  loadDefaultStations();
}, []);


useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // update every minute

  return () => clearInterval(timer); // cleanup on unmount
}, []);


// Data Fetching Logics
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

// Data Fetching Logic
const fetchData = useCallback(async () => {
  setTrains([]);

  const cacheKey = `route_${from}_${to}`;
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      setRawData(data);          // ✅ Save the raw timetable data
      filterAndSetTrains(data);  // ✅ Filter based on current time
    } else {
      setTrains(null);
    }
  } catch (e) {
    console.error('❌ Failed to load from cache', e);
    setTrains(null);
  }
}, [from, to, date]);


  const filterAndSetTrains = (data) => {
    const engToday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const today = bengaliDays[engToday];
    const now = new Date();

    const filtered = data
      .filter(item => item['Off Day'] !== today && item['From Station Time'])
      .map(item => {
        const [h, m] = item['From Station Time'].split(':').map(Number);
        const trainTime = new Date(date);
        trainTime.setHours(h, m, 0, 0);
        return { ...item, __trainTime: trainTime };
      })
      .filter(item => item.__trainTime >= now)
      .sort((a, b) => a.__trainTime - b.__trainTime);

    setTrains(filtered);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
  const interval = setInterval(() => {
    if (rawData.length > 0) {
      filterAndSetTrains(rawData);
    }
  }, 60000);

  return () => clearInterval(interval);
}, [rawData, date]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="calendar" size={24} iconColor="#4CAF50" onPress={() => {
            setTempDate(date);
            setShowDatePicker(true);
          }} />
        </View>
      ),
    });
  }, [navigation, fetchData, date]);

  const getNextDepartureIn = () => {
    if (!trains?.length) return '';
    const now = new Date();
    const [h, m] = trains[0]['From Station Time'].split(':').map(Number);
    const departure = new Date(date);
    departure.setHours(h, m, 0, 0);
    let diff = departure - now;
    if (diff < 0) diff += 86400000;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${engToBengaliDigit(hrs)} ঘন্টা ${engToBengaliDigit(mins)} মিনিট`;
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, paddingTop: 4 }}>
      <View style={styles.topRow}>
        <View style={styles.leftTopRow}>
          <Icon name="clock-outline" size={34} color="#555" style={{ marginRight: 4, marginTop: 4, marginRight: 4 }} />
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


            <TouchableOpacity
      onPress={() => {
        const temp = from;
        setFrom(to);
        setTo(temp);
      }}
      style={styles.reverseButton}
    >
      <Icon name="swap-horizontal" size={24} color="#fff" />
    </TouchableOpacity>

        </View>
        <DropdownSelector options={LOCATIONS} selected={to} onChange={setTo} circular icon="map-marker" />
      </View>
{trains === null && (
  <View>
    <View style={styles.errorBox}>
      <Icon name="alert-circle" size={20} color="#d32f2f" style={{ marginRight: 4 }} />
      <RNText style={styles.errorText}>দুঃখিত! এই রুটের জন্য সময়সূচী খুঁজে পাওয়া যায়নি।</RNText>
    </View>
  </View>
)}


      {Array.isArray(trains) && trains.length > 0 && (
        <>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.nextDepartureTitle}>
              পরবর্তী ট্রেন {getNextDepartureIn()} পর
            </Text>
          <LiveDot />
          </View>
          <TrainCard train={trains[0]} highlight showHeading />
          {trains.length > 1 && (
            <>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.upcomingTitle}>আজকের দিনের অন্যান্য ট্রেনসমূহ</Text>
              </View>
              <FlatList
                data={trains.slice(1)}
                keyExtractor={(_, i) => (i + 1).toString()}
                renderItem={({ item }) => (
                  <TrainCard train={item} highlight={false} showHeading={false} />
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            </>
          )}
        </>
      )}

      {Array.isArray(trains) && trains.length === 0 && (
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
};

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 },
  leftTopRow: { flexDirection: 'row', alignItems: 'center' },
  bigTime: { fontSize: 32, fontWeight: '700', color: '#555', marginRight: 12 },
  rightTopRow: { flexDirection: 'column', alignItems: 'flex-end' },
  mediumWeekday: { fontSize: 16, fontWeight: '700', color: '#555' },
  fullDate: { fontSize: 12, fontWeight: '700', color: '#666', marginBottom: 12 },
  sectionTitleContainer: { flexDirection: 'row', marginVertical: 8 },
  nextDepartureTitle: { fontSize: 18, fontWeight: '700', color: '#2e7d32' },
  upcomingTitle: { fontSize: 16, fontWeight: '600', color: '#555' },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffcdd2', padding: 8, borderRadius: 6, marginVertical: 12 },
  errorText: { color: '#d32f2f', fontSize: 16, margin: 4 },
  noTrainsBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#C8E6C9', padding: 8, borderRadius: 6, marginVertical: 12 },
  noTrainsText: { color: '#2E7D32', fontSize: 16, margin: 4 },
  updateButton: {
  backgroundColor: '#4caf50',
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  alignItems: 'center',
  marginTop: 10,
  alignSelf: 'center',
},
updateButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

dropdownRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8, alignItems: 'center' },
journeyLine: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
journeyDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4caf50' },
journeyLineBar: { width: 80, height: 2, backgroundColor: '#4caf50' },

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
}


});

export default TimetableScreen;
