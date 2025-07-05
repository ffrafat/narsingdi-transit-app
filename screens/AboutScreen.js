import React from 'react';
import { View, StyleSheet, ScrollView, Linking, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';
import { Image } from 'react-native';

const AboutAppScreen = () => {
  const openPrivacyPolicy = () => {
    Linking.openURL('https://transit.rafat.cc/privacy-policy');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

        {/* App Header with Icon, Name, Version */}
  <View style={styles.appHeader}>
    <Image source={require('../assets/icon.png')} style={styles.appIcon} />
    <View>
      <Text style={styles.appName}>নরসিংদী ট্রানজিট</Text>
      <Text style={styles.versionText}>ভার্সন: ১.৪</Text>
    </View>
  </View>
      {/* App Card */}
      <View style={styles.card}>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>নরসিংদী ট্রানজিট</Text> অ্যাপটি নরসিংদী জেলার ট্রেনযাত্রীদের জন্য তৈরি একটি অফলাইন ট্রেন সময়সূচী। এর পাশাপাশি এই অ্যাপের মাধ্যমে আপনি খুব সহজেই ট্টিকিট কাটতে এবং লাইভ লোকেশন দেখতে পারবেন।
        </Text>
        <Text style={styles.paragraph}>
          এটি <Text style={styles.bold}>বাংলাদেশ রেলওয়ের</Text> কোন অফিশিয়াল অ্যাপ নয়, এবং বাংলাদেশ রেলওয়ের সাথে আমাদের কোনো প্রত্যক্ষ বা পরোক্ষ সম্পর্ক নেই। যাত্রীসাধারণের সুবিধার কথা মাথায় রেখেই অলাভজনক এই অ্যাপটি তৈরি করা হয়েছে।
        </Text>
                <Text style={styles.paragraph}>
আমরা আপনার ব্যক্তিগত তথ্যের সুরক্ষাকে গুরুত্ব দেই। এই অ্যাপটি আপনার কোনো ব্যক্তিগত তথ্য জমা রাখে না। আমাদের সম্পূর্ণ গোপনীয়তা নীতি পড়তে নিচের লিংকে ক্লিক করুন।
        </Text>
        <Button
  icon="shield-lock"
  mode="contained"
  onPress={openPrivacyPolicy}
  style={styles.privacyButton}
  contentStyle={{ flexDirection: 'row' }}
  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
>
  গোপনীয়তা নীতি পড়ুন
</Button>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 4,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#2e7d32',
  },
  paragraph: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 10,
    textAlign: 'justify',
  },
  bullet: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
    paddingLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  linkText: {
    fontSize: 16,
    color: '#4caf50',
    textDecorationLine: 'underline',
    marginTop: 8,
  },

  privacyButton: {
  marginTop: 10,
  backgroundColor: '#4caf50',
  borderRadius: 6,
},

appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 48,
    height: 48,
    marginRight: 12,
    borderRadius: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  versionText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },

});

export default AboutAppScreen;
