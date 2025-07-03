import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import { fetchAndCacheRoute } from '../utils/dataFetcher';


import { useNavigation } from '@react-navigation/native';


const DatabaseUpdateScreen = () => {
  const handleManualUpdate = async () => {
    try {
      const netState = await NetInfo.fetch();

      if (!netState.isConnected || netState.isInternetReachable === false) {
        Alert.alert('ইন্টারনেট সংযোগ নেই', 'অনুগ্রহ করে ইন্টারনেটে সংযুক্ত হয়ে আবার চেষ্টা করুন।');
        return;
      }

      await fetchAndCacheRoute('নরসিংদী', 'কমলাপুর');
      await fetchAndCacheRoute('নরসিংদী', 'এয়ারপোর্ট');
      await fetchAndCacheRoute('কমলাপুর', 'নরসিংদী');
      await fetchAndCacheRoute('এয়ারপোর্ট', 'নরসিংদী');
      await fetchAndCacheRoute('মেথিকান্দা', 'কমলাপুর');
      await fetchAndCacheRoute('মেথিকান্দা', 'এয়ারপোর্ট');
      await fetchAndCacheRoute('কমলাপুর', 'মেথিকান্দা');
      await fetchAndCacheRoute('এয়ারপোর্ট', 'মেথিকান্দা');
      await fetchAndCacheRoute('ভৈরব', 'কমলাপুর');
      await fetchAndCacheRoute('ভৈরব', 'এয়ারপোর্ট');
      await fetchAndCacheRoute('কমলাপুর', 'ভৈরব');
      await fetchAndCacheRoute('এয়ারপোর্ট', 'ভৈরব');

      Alert.alert('আপডেটেড', 'ডেটা আপডেট সম্পন্ন হয়েছে!', [{ text: 'ঠিক আছে' }]);
    } catch (e) {
      Alert.alert('ঝামেলা হয়েছে', 'ডেটা আপডেট করা যায় নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।', [{ text: 'ঠিক আছে' }]);
      console.error(e);
    }
  };
const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.description}>
            ট্রেনের সর্বশেষ তথ্য পেতে ডেটা আপডেট রাখা খুবই জরুরি। আমাদের ডেটার উৎস হলো বাংলাদেশ রেলওয়ের অফিশিয়াল সময়সূচি, যা প্রায়শই পরিবর্তিত হয়।
            রেলওয়ে যখন সময়সূচি পরিবর্তন করে, আমরাও ডেটাবেজ আপডেট করার চেষ্টা করি। তবে, এই আপডেটে বিলম্ব হতে পারে, তাই ব্যবহারকারীদের সতর্ক থাকার পরামর্শ দেওয়া হচ্ছে।
            সেই সাথে মাঝে মাঝে এই অপশন থেকে ডেটাবেজ আপডেট করুন যেন সর্বশেষ প্রকাশিত সময়সূচী দেখতে পারেন।
            পুরনো ডেটার কারণে কোনো অসুবিধা হলে, এর জন্য ডেভেলপার দায়ী থাকবে না।
          </Text>
        </Card.Content>
<View style={styles.fullWidthAction}>
  <Button
    icon="database-refresh"
    mode="contained"
    style={styles.updateButton}
    contentStyle={{ flexDirection: 'row', height: 48 }}
    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
    onPress={handleManualUpdate}
  >
    এখনই আপডেট করুন
  </Button>




<Button
  mode="contained"
  style={{ marginTop: 16 }}
  onPress={() => navigation.navigate('TrainTrackingScreen', { trainNo: '৭১০' })}
>
  লাইভ ট্র্যাকিং টেস্ট করুন (৭১০)
</Button>


</View>

      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#4caf50',
  },
  card: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
      marginBottom: 16,
  },

fullWidthAction: {
  paddingHorizontal: 16,
  paddingBottom: 16,
},
updateButton: {
  backgroundColor: '#4caf50',
  borderRadius: 6,
  width: '100%',
},

});

export default DatabaseUpdateScreen;
