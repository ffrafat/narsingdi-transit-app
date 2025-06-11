import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Linking } from 'react-native';
import { View, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TimetableScreen from '../screens/TimetableScreen';
import AboutScreen from '../screens/AboutScreen';


import NetInfo from '@react-native-community/netinfo';
import { fetchAndCacheRoute } from '../utils/dataFetcher';

const handleManualUpdate = async () => {
  const netState = await NetInfo.fetch();

  if (!netState.isConnected) {
    Alert.alert('ইন্টারনেট সংযোগ নেই',
       'অনুগ্রহ করে ইন্টারনেটে সংযুক্ত হয়ে আবার চেষ্টা করুন।');
    return;
  }

  try {
    await fetchAndCacheRoute('নরসিংদী', 'কমলাপুর');
    await fetchAndCacheRoute('নরসিংদী', 'এয়ারপোর্ট');
    await fetchAndCacheRoute('কমলাপুর', 'নরসিংদী');
    await fetchAndCacheRoute('এয়ারপোর্ট', 'নরসিংদী');
    await fetchAndCacheRoute('মেথিকান্দা', 'কমলাপুর');
    await fetchAndCacheRoute('মেথিকান্দা', 'এয়ারপোর্ট');
    await fetchAndCacheRoute('কমলাপুর', 'মেথিকান্দা');
    await fetchAndCacheRoute('এয়ারপোর্ট', 'মেথিকান্দা');
    Alert.alert(
      'আপডেটেড',
      'ডেটা আপডেট সম্পন্ন হয়েছে!',
      [{ text: 'ঠিক আছে' }]
    );
  } catch (e) {
    Alert.alert(
      'ঝামেলা হয়েছে',
      'ডেটা আপডেট করা যায় নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
    [{ text: 'ঠিক আছে' }]
  );
    console.error(e);
  }
};



const Drawer = createDrawerNavigator();
const playStoreLink = 'market://details?id=cc.rafat.narsingditransit';
const devProfileLink = 'https://play.google.com/store/apps/dev?id=8574740223570326359';


function CustomDrawerContent(props) {



  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 60, flex: 1 }}>
      <View style={{ marginBottom: 10, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#4CAF50' }}>
          নরসিংদী ট্রানজিট
        </Text>
        <Text style={{ fontSize: 16, color: '#888', marginTop: 4 }}>
          অ্যাপ ভার্সন: ১.০.১
        </Text>

      </View>


      {/* Main Section */}
      <DrawerItem
        label="সময়সূচী"
        icon={({ color, size }) => <Icon name="train" color={color} size={size} />}
        onPress={() => props.navigation.navigate('সময়সূচী')}
      />

      <DrawerItem
  label="ডেটাবেজ আপডেট"
  icon={({ color, size }) => <Icon name="database-refresh" color={color} size={size} />}
  onPress={handleManualUpdate}
/>

      <View
        style={{
          height: 1,
          backgroundColor: '#ddd',
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      />

      {/* Extras Section */}
<DrawerItem
  label="ই-টিকেট"
  icon={({ color, size }) => <Icon name="ticket-confirmation" color={color} size={size} />}
  onPress={() => Linking.openURL('https://eticket.railway.gov.bd/')}
/>

<DrawerItem
  label="নরসিংদী রেলওয়ে প্যাসেঞ্জার কম্যুনিটি"
  icon={({ color, size }) => <Icon name="facebook" color={color} size={size} />}
  onPress={() => Linking.openURL('https://www.facebook.com/groups/nrc.nrpc/')}
/>

      <View
        style={{
          height: 1,
          backgroundColor: '#ddd',
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      />

      <DrawerItem
        label="আমাদের সম্পর্কে"
        icon={({ color, size }) => <Icon name="information-outline" color={color} size={size} />}
        onPress={() => props.navigation.navigate('আমাদের সম্পর্কে')}
      />

<DrawerItem
  label="রেটিং দিন"
  icon={({ color, size }) => <Icon name="star-outline" color={color} size={size} />}
  onPress={() => Linking.openURL(playStoreLink)}
/>
<DrawerItem
  label="আমাদের আরও অ্যাপ"
  icon={({ color, size }) => <Icon name="apps" color={color} size={size} />}
  onPress={() => Linking.openURL(devProfileLink)}
/>

      <View style={{ flex: 1 }} />

      <View style={{ padding: 16 }}>
<Text style={{ fontSize: 12, color: '#aaa', textAlign: 'center' }}>
  ভালোবাসা দিয়ে তৈরি ❤️ নরসিংদীর মানুষের জন্য
</Text>

      </View>
    </DrawerContentScrollView>
  );
}

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: '#4CAF50',
          drawerLabelStyle: { marginLeft: -16 },
        }}
      >
        <Drawer.Screen name="সময়সূচী" component={TimetableScreen} />
        <Drawer.Screen name="আমাদের সম্পর্কে" component={AboutScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
