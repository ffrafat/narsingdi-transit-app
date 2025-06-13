import React from 'react';
import { View, Image, StyleSheet, Linking, ScrollView } from 'react-native';
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
        <Text style={styles.bold}>নরসিংদী ট্রানজিট</Text> অ্যাপটি নরসিংদী জেলার ট্রেন যাত্রীদের জন্য তৈরি একটি সহজ ও তথ্যবহুল অ্যাপ। 
        এই অ্যাপটি <Text style={styles.bold}>বাংলাদেশ রেলওয়ে</Text> এর অফিশিয়াল অ্যাপ নয় এবং এটির সাথে তাদের কোনো প্রত্যক্ষ সম্পর্ক নেই।
      </Text>
            <Divider style={styles.divider} />

            <View style={styles.header}>
        <Icon name="application-brackets-outline" size={28} color="#4caf50" />
        <Text style={styles.headerText}>ডেভেলপার</Text>
      </View>

      <View style={styles.profileContainer}>
  <Image
    source={require('../assets/dev.png')}
    style={styles.profilePic}
  />
</View>

      <View style={styles.itemRow}>
        <Icon name="account" size={22} color="#4caf50" />
        <Text style={styles.bold}>  ফয়সাল ফারুকী রাফাত</Text>
      </View>

                        <View style={styles.itemRow}>
        <Icon name="whatsapp" size={22} color="#4caf50" />
                <Text style={styles.linkText} onPress={() => openLink('https://wa.me/+8801734512161')}>
          +880 1734 512161
        </Text>
      </View>

                  <View style={styles.itemRow}>
        <Icon name="facebook" size={22} color="#4caf50" />
                <Text style={styles.linkText} onPress={() => openLink('https://facebook.com/fslfrqrft')}>
          fb.com/fslfrqrft
        </Text>
      </View>

      <View style={styles.itemRow}>
        <Icon name="web" size={22} color="#4caf50" />
                <Text style={styles.linkText} onPress={() => openLink('https://rafat.cc')}>
          rafat.cc
        </Text>
      </View>
    <Divider style={styles.divider} />

<View style={styles.header}>
  <Icon name="heart-outline" size={28} color="#4caf50" />
  <Text style={styles.headerText}>ডোনেট করে সাহায্য করুন</Text>
</View>

<Text style={styles.description}>
  আপনাদেরকে সুন্দর একটা অভিজ্ঞতা দিতে এই অ্যাপটি একদম ফ্রি এবং বিজ্ঞাপন-মুক্ত রাখা হয়েছে।
  কিন্তু অ্যাপটির মেন্টেনেন্স বাবদ নিয়মিত কিছু ব্যয় হয়।

  যদি মনে করেন এই অ্যাপটি আপনার উপকারে এসেছে, আপনি চাইলে সামান্য সাহায্য করতে পারেন—
  এটি আমাকে এই অ্যাপটিকে ফ্রি রাখতে এবং নিয়মিত আপডেট দিতে অনুপ্রাণিত করবে।
</Text>
            <Divider style={styles.divider} />
<View style={styles.header}>
  <Icon name="currency-bdt" size={28} color="#4caf50" />
  <Text style={styles.headerText}>bKash Send Money: 01734 512161</Text>
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  profileContainer: {
    marginVertical: 10,
  },
    profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4caf50',
  },
});

export default AboutScreen;
