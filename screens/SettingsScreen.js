import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';

const stationList = ['নরসিংদী', 'কমলাপুর', 'এয়ারপোর্ট', 'ভৈরব বাজার', 'মেথিকান্দা'];

const SettingsScreen = () => {
  const [from, setFrom] = useState('নরসিংদী');
  const [to, setTo] = useState('কমলাপুর');

  useEffect(() => {
    const loadDefaults = async () => {
      const storedFrom = await AsyncStorage.getItem('default_from');
      const storedTo = await AsyncStorage.getItem('default_to');
      if (storedFrom) setFrom(storedFrom);
      if (storedTo) setTo(storedTo);
    };
    loadDefaults();
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('default_from', from);
    await AsyncStorage.setItem('default_to', to);
    Alert.alert('সেইভ হয়েছে', 'আপনার পরিবর্তনগুলো সফলভাবে সেইভ করা হয়েছে।');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Icon name="map-marker-radius" size={24} color="#4caf50" />
        <Text style={styles.headerText}>  ডিফল্ট স্টেশন</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text>উঠার স্টেশন</Text>
          <Picker selectedValue={from} onValueChange={setFrom}>
            {stationList.map((station) => (
              <Picker.Item key={station} label={station} value={station} />
            ))}
          </Picker>
        </View>

        <View style={styles.half}>
          <Text>নামার স্টেশন</Text>
          <Picker selectedValue={to} onValueChange={setTo}>
            {stationList.map((station) => (
              <Picker.Item key={station} label={station} value={station} />
            ))}
          </Picker>
        </View>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.saveBtn}>
        সেইভ করুন
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  headerText: { fontSize: 18, fontWeight: 'bold', color: '#4caf50' },
  saveBtn: { marginTop: 20, backgroundColor: '#4caf50' },
});

export default SettingsScreen;
