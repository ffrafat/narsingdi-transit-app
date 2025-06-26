import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { StatusBar } from 'react-native';
import { Linking } from 'react-native';
import { View, Text, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';


// Main Screen Imports
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TimetableScreen from '../screens/TimetableScreen';
import AboutScreen from '../screens/AboutScreen';
import CreditsScreen from '../screens/CreditsScreen';
import DatabaseUpdateScreen from '../screens/DatabaseUpdateScreen';
import ETicketHomeScreen from '../screens/ETicketHomeScreen';
import UsefulLinksScreen from '../screens/UsefulLinksScreen';
import TicketNavigator from '../ticketscreens/TicketNavigator';


import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();





const Drawer = createDrawerNavigator();
const playStoreLink = 'market://details?id=cc.rafat.narsingditransit';
const devProfileLink = 'https://play.google.com/store/apps/dev?id=8574740223570326359';


function CustomDrawerContent(props) {



  return (

      <LinearGradient
    colors={['#ffffff', '#4CAF50']}   // white top to green bottom
    start={{ x: 0.5, y: 0.3 }}
    end={{ x: 0.5, y: 1 }}
    style={{ flex: 1 }}
  >
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 20, flex: 1 }}>
<View style={{ alignItems: 'center', marginBottom: 10, marginTop: 20 }}>
  <Image
    source={require('../assets/drawer-icon.png')}
    style={{ width: 100, height: 100, resizeMode: 'contain' }}
  />
</View>

      {/* Main Section */}
      <DrawerItem
        label="সময়সূচী"
          labelStyle={{ color: '#333', fontWeight: 'bold'}}
        icon={({ color, size }) => <Icon name="train" color="#333" size={size} />}
        onPress={() => props.navigation.navigate('সময়সূচী')}
      />

            <DrawerItem
        label="স্টেশন ম্যাপ"
          labelStyle={{ color: '#333', fontWeight: 'bold'}}
        icon={({ color, size }) => <Icon name="map" color="#333" size={size} />}
        onPress={() => props.navigation.navigate('স্টেশন ম্যাপ')}
      />

      <DrawerItem
        label="ডেটাবেজ আপডেট"
          labelStyle={{ color: '#333', fontWeight: 'bold'}}
        icon={({ color, size }) => <Icon name="database-refresh" color="#333" size={size} />}
        onPress={() => props.navigation.navigate('ডেটাবেজ আপডেট')}
      />

      <DrawerItem
        label="সেটিংস"
          labelStyle={{ color: '#333', fontWeight: 'bold'}}
        icon={({ color, size }) => <Icon name="cog" color="#333" size={size} />}
        onPress={() => props.navigation.navigate('সেটিংস')}
      />
      <View
        style={{
          height: 1,
          backgroundColor: '#333',
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      />

      {/* Extras Section */}

<DrawerItem
  label="রেলওয়ে ই-টিকেট"
    labelStyle={{ color: '#333', fontWeight: 'bold'}}
  icon={({ color, size }) => <Icon name="ticket-confirmation" color="#333" size={size} />}
 onPress={() => props.navigation.navigate('রেলওয়ে ই-টিকিট')}
/>

<DrawerItem
  label="প্রয়োজনীয় লিংকসমূহ"
  labelStyle={{ color: '#333', fontWeight: 'bold'}}
  icon={({ color, size }) => <Icon name="bookmark-multiple" color="#333" size={size} />}
 onPress={() => props.navigation.navigate('প্রয়োজনীয় লিংকসমূহ')}
/>

      <View
        style={{
          height: 1,
          backgroundColor: '#333',
          marginVertical: 10,
          marginHorizontal: 16,
        }}
      />

      <DrawerItem
        label="অ্যাপ সম্পর্কে"
          labelStyle={{ color: '#333', fontWeight: 'bold'}}
        icon={({ color, size }) => <Icon name="information-outline" color="#333" size={size} />}
        onPress={() => props.navigation.navigate('অ্যাপ সম্পর্কে')}
      />

      <DrawerItem
  label="ডেভেলপার"
    labelStyle={{ color: '#333', fontWeight: 'bold'}}
  icon={({ color, size }) => <Icon name="account" color="#333" size={size} />}
  onPress={() => props.navigation.navigate('ডেভেলপার')}
/>


<DrawerItem
  label="৫ স্টার রিভিউ দিন"
    labelStyle={{ color: '#333', fontWeight: 'bold'}}
  icon={({ color, size }) => <Icon name="star-outline" color="#333" size={size} />}
  onPress={() => Linking.openURL(playStoreLink)}
/>


<View style={{ alignItems: 'center'}}>
  <LottieView
    source={require('../assets/train-animation.json')}
    autoPlay
    loop
    style={{ width: 120, height: 120 }}
  />
</View>

      <View style={{ flex: 1 }} />

      <View style={{ padding: 0 }}>
<Text style={{ fontSize: 14, color: '#333', textAlign: 'center' }}>
  ভালোবাসা দিয়ে তৈরি ❤️ নরসিংদীর মানুষের জন্য
</Text>
<Text style={{ fontSize: 12, color: '#333', textAlign: 'center' }}>
  © ২০২৫ - ফয়সাল ফারুকী রাফাত - সর্বস্বত্ত্ব সংরক্ষিত
</Text>


      </View>
    </DrawerContentScrollView>
    </LinearGradient>
  );
}

export default function MainNavigator() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: true,
  drawerActiveTintColor: '#4CAF50',         // Active item color
  drawerInactiveTintColor: '#777',          // Inactive item color
            drawerLabelStyle: { marginLeft: -16 },

            headerStyle: {
              backgroundColor: '#4CAF50',  // primary green background
            },
            headerTintColor: '#fff', // white color for title and icons (hamburger, back etc)
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Drawer.Screen name="সময়সূচী" component={TimetableScreen} />
          <Drawer.Screen name="স্টেশন ম্যাপ" component={MapScreen} />
          <Drawer.Screen name="ডেটাবেজ আপডেট" component={DatabaseUpdateScreen} />
          <Drawer.Screen name="সেটিংস" component={SettingsScreen} />
          <Drawer.Screen name="রেলওয়ে ই-টিকিট" component={TicketNavigator} />
          <Drawer.Screen name="প্রয়োজনীয় লিংকসমূহ" component={UsefulLinksScreen} />
          <Drawer.Screen name="অ্যাপ সম্পর্কে" component={AboutScreen} />
          <Drawer.Screen name="ডেভেলপার" component={CreditsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
