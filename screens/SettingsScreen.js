import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropdownSelector from '../components/DropdownSelector';

const stationList = ['নরসিংদী', 'কমলাপুর', 'এয়ারপোর্ট', 'ভৈরব', 'মেথিকান্দা'];

const SettingsScreen = () => {
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('কমলাপুর');

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
      Alert.alert('সেইভ হয়েছে', 'আপনার পরিবর্তনগুলো সফলভাবে সেইভ করা হয়েছে।');
    } catch (e) {
      Alert.alert('সেইভ হয়নি', 'সেইভ করার সময় সমস্যা হয়েছে।');
      console.error('Error saving settings:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
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
});

export default SettingsScreen;
