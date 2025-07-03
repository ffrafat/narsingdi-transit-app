import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Text, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { db } from '../utils/firebaseConfig';
import trainDetails from '../assets/trainDetails.json';

const STATIONS = [
  'ভৈরব', 'দৌলতকান্দি', 'শ্রীনিধি', 'মেথিকান্দা', 'হাঁটুভাঙ্গা', 'খানাবাড়ি',
  'আমীরগঞ্জ', 'নরসিংদী', 'জিনারদী', 'ঘোড়াশাল', 'আড়িখোলা', 'পূবাইল',
  'টঙ্গী', 'এয়ারপোর্ট', 'ক্যান্টনমেন্ট', 'তেজগাঁও', 'কমলাপুর',
];

const STATUS = ['এইমাত্র পৌছালো', 'এইমাত্র ছেড়ে গেল', 'দাঁড়িয়ে আছে', 'দেরি করছে', 'পার করে চলে গেল'];

const trainList = Object.keys(trainDetails).map(no => ({
  no,
  name: trainDetails[no].name,
}));

const TrackingReportScreen = ({ navigation }) => {
  const [trainNo, setTrainNo] = useState('');
  const [station, setStation] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [now, setNow] = useState(new Date());

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const savedName = await AsyncStorage.getItem('reporter_name');
        const savedContact = await AsyncStorage.getItem('reporter_contact');
        if (savedName) setName(savedName);
        if (savedContact) setContact(savedContact);
        setDeviceId(Device.osInternalBuildId || Device.modelId || 'unknown-device');

        setTrainNo('');
        setStation('');
        setStatus('');
        setNote('');
        setNow(new Date());
      };

      loadData();
    }, [])
  );

  const handleSubmit = async () => {
    if (!trainNo || !station || !status) {
      Alert.alert('ত্রুটি', 'ট্রেন, স্টেশন এবং স্ট্যাটাস পূরণ করুন।');
      return;
    }

    try {
      await AsyncStorage.setItem('reporter_name', name);
      await AsyncStorage.setItem('reporter_contact', contact);

      const reportData = {
        trainNo,
        station,
        status,
        note,
        name,
        contact,
        reportedAt: now.toISOString(),
        timestamp: serverTimestamp(),
        deviceId,
      };

      await addDoc(collection(db, 'trackingReports'), reportData);

      setTrainNo('');
      setStation('');
      setStatus('');
      setNote('');
      setNow(new Date());

      Alert.alert('ধন্যবাদ', 'রিপোর্ট সফলভাবে জমা হয়েছে।');
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('ব্যর্থ হয়েছে', 'রিপোর্ট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।');
    }
  };

  const Label = ({ icon, text }) => (
    <View style={styles.labelRow}>
      <IconButton icon={icon} size={20} color="#2e7d32" style={{ margin: 0, marginRight: 4 }} />
      <Text style={styles.label}>{text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <Label icon="train" text="ট্রেন" />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={trainNo}
            onValueChange={(value) => setTrainNo(value)}
            style={styles.picker}
          >
            <Picker.Item label="ট্রেন নির্বাচন করুন" value="" />
            {trainList.map(train => (
              <Picker.Item
                key={train.no}
                label={`${train.name} (${train.no})`}
                value={train.no}
              />
            ))}
          </Picker>
        </View>

        <Label icon="map-marker" text="স্টেশন" />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={station}
            onValueChange={(value) => setStation(value)}
            style={styles.picker}
          >
            <Picker.Item label="স্টেশন নির্বাচন করুন" value="" />
            {STATIONS.map((s, idx) => (
              <Picker.Item key={idx} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <Label icon="flag-checkered" text="স্ট্যাটাস" />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={status}
            onValueChange={(value) => setStatus(value)}
            style={styles.picker}
          >
            <Picker.Item label="স্ট্যাটাস নির্বাচন করুন" value="" />
            {STATUS.map((s, idx) => (
              <Picker.Item key={idx} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <Label icon="clock-outline" text="সময় ও তারিখ" />
        <TextInput
          style={styles.input}
          value={now.toLocaleString()}
          editable={false}
        />

        <Label icon="note-text-outline" text="মন্তব্য" />
        <TextInput
          style={styles.input}
          placeholder="ট্রেনের অবস্থা (ঐচ্ছিক)"
          value={note}
          onChangeText={setNote}
        />

        <Label icon="account" text="আপনার নাম" />
        <TextInput
          style={styles.input}
          placeholder="আপনার নাম লিখুন"
          value={name}
          onChangeText={setName}
        />

        <Label icon="phone" text="মোবাইল নম্বর" />
        <TextInput
          style={styles.input}
          placeholder="মোবাইল নম্বর"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />

        <Button
          mode="contained"
          style={styles.submitBtn}
          onPress={handleSubmit}
          icon="check"
        >
          রিপোর্ট সাবমিট করুন
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  input: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4,
    backgroundColor: '#f1f1f1',
  },
  picker: { height: 48 },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    borderRadius: 6,
  },
});

export default TrackingReportScreen;
