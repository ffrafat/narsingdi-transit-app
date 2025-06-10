import React from 'react';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AboutScreen = () => {
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <Icon name="train" size={28} color="#4caf50" />
        <Text style={styles.headerText}>নরসিংদী ট্রানজিট</Text>
      </View>

      <Text style={styles.description}>
        <Text style={styles.bold}>নরসিংদী ট্রানজিট</Text> অ্যাপটি নরসিংদী জেলার ট্রেন যাত্রীদের জন্য তৈরি একটি সহজ, আধুনিক ও তথ্যবহুল অ্যাপ। 
        এই অ্যাপের মাধ্যমে আপনি অনলাইনে ট্রেনের সময়সূচি সহজেই দেখতে পারবেন। 
        সময়সূচিগুলো নিয়মিত হালনাগাদ করা হয়, যাতে যাত্রীরা সর্বশেষ তথ্য পান। 
        এটি একেবারে ফ্রি এবং ব্যবহার-বান্ধব।
      </Text>

      <Divider style={styles.divider} />

      <View style={styles.itemRow}>
        <Icon name="account" size={22} color="#4caf50" />
        <Text style={styles.itemText}>ডেভেলপার: <Text style={styles.bold}>ফয়সাল ফারুকী রাফাত</Text></Text>
      </View>

      <View style={styles.itemRow}>
        <Icon name="github" size={22} color="#4caf50" />
        <Text style={styles.linkText} onPress={() => openLink('https://github.com/ffrafat/narsingdi-transit-app')}>
          সোর্স কোড (GitHub)
        </Text>
      </View>

      <View style={styles.itemRow}>
        <Icon name="license" size={22} color="#4caf50" />
        <Text style={styles.itemText}>লাইসেন্স: MIT</Text>
      </View>

      <View style={styles.itemRow}>
        <Icon name="application" size={22} color="#4caf50" />
        <Text style={styles.itemText}>ভার্সন: ১.০.১</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.itemRow}>
        <Icon name="copyright" size={18} color="#4caf50" />
        <Text style={styles.itemText}>২০২৫ - ফয়সাল ফারুকী রাফাত - সর্বস্বত্ত্ব সংরক্ষিত</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
    color: '#2e7d32',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#ccc',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#444',
  },
  linkText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#4caf50',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});

export default AboutScreen;
