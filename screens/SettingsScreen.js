import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropdownSelector from '../components/DropdownSelector';
import NetInfo from '@react-native-community/netinfo';
import { fetchAndCacheRoute } from '../utils/dataFetcher';

const stationList = ['ঢাকা', 'তেজগাঁও', 'বিমানবন্দর', 'নরসিংদী', 'মেথিকান্দা', 'দৌলতকান্দি', 'ভৈরব'];

const SettingsScreen = () => {
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('ঢাকা');

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Default station card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Icon name="home-map-marker" size={24} color="#4caf50" />
            <Text style={styles.headerText}>  ডিফল্ট স্টেশন</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.half}>
              <Text style={styles.label}>উঠার স্টেশন</Text>
              <DropdownSelector
                label="উঠার স্টেশন"
                options={stationList}
                selected={from}
                onChange={setFrom}
              />
            </View>

            <View style={styles.half}>
              <Text style={styles.label}>নামার স্টেশন</Text>
              <DropdownSelector
                label="নামার স্টেশন"
                options={stationList}
                selected={to}
                onChange={setTo}
              />
            </View>
          </View>

          <Button
            icon="content-save"
            mode="contained"
            style={styles.saveBtn}
            contentStyle={{ flexDirection: 'row' }}
            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
            onPress={handleSave}
          >
            সেইভ করুন
          </Button>
        </Card.Content>
      </Card>

      {/* Database update card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Icon name="database-refresh" size={24} color="#4caf50" />
            <Text style={styles.headerText}>  ডেটাবেজ আপডেট</Text>
          </View>

          <Text style={styles.description}>
            ট্রেনের সময়সূচি আপডেট রাখতে এখানে ক্লিক করে ডেটাবেজ আপডেট করুন।
          </Text>

          <Button
            icon="update"
            mode="contained"
            style={styles.updateBtn}
            contentStyle={{ flexDirection: 'row', height: 48 }}
            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
            onPress={handleManualUpdate}
          >
            এখনই আপডেট করুন
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2e7d32',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  half: {
    width: '48%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#555',
  },
  saveBtn: {
    marginTop: 10,
    backgroundColor: '#4caf50',
    borderRadius: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  updateBtn: {
    backgroundColor: '#4caf50',
    borderRadius: 6,
    width: '100%',
  },
});

export default SettingsScreen;
