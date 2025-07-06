import React from 'react';
import { Alert, StatusBar, Linking, View, Text, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Main Screen Imports
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TimetableScreen from '../screens/TimetableScreen';
import AboutScreen from '../screens/AboutScreen';
import CreditsScreen from '../screens/CreditsScreen';
import DatabaseUpdateScreen from '../screens/DatabaseUpdateScreen';
import UsefulLinksScreen from '../screens/UsefulLinksScreen';

import TrackingReportScreen from '../screens/TrackingReportScreen';


// Tracking Related Screens
import LiveTrackingHomeScreen from '../screens/LiveTrackingHomeScreen';
import TrackingNavigator from '../trackingscreens/TrackingNavigator';


// ETicket Related Screens
import ETicketHomeScreen from '../screens/ETicketHomeScreen';
import TicketNavigator from '../ticketscreens/TicketNavigator';

// Train Details Page Import
import TrainDetailsScreen from '../screens/TrainDetailsScreen';
import TrainTrackingScreen from '../screens/TrainTrackingScreen';


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const playStoreLink = 'market://details?id=cc.rafat.narsingditransit';
const devProfileLink = 'https://play.google.com/store/apps/dev?id=8574740223570326359';

function CustomDrawerContent(props) {
  return (
    <LinearGradient
      colors={['#ffffff', '#4CAF50']}
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

        <DrawerItem
          label="সময়সূচী"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="train" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('সময়সূচী')}
        />
        <DrawerItem
          label="ট্রেন ট্র্যাকিং"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="ticket-confirmation" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('ট্রেন ট্র্যাকিং')}
        />
        <DrawerItem
          label="রিপোর্ট লোকেশন"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="map-marker-check" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('রিপোর্ট লোকেশন')}
        />

        <DrawerItem
          label="স্টেশন ম্যাপ"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="map" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('স্টেশন ম্যাপ')}
        />

        <DrawerItem
          label="ডেটাবেজ আপডেট"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="database-refresh" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('ডেটাবেজ আপডেট')}
        />

        <DrawerItem
          label="সেটিংস"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="cog" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('সেটিংস')}
        />

        <View style={{ height: 1, backgroundColor: '#333', marginVertical: 10, marginHorizontal: 16 }} />

        <DrawerItem
          label="রেলওয়ে ই-টিকিট"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="ticket-confirmation" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('রেলওয়ে ই-টিকিট')}
        />

        <DrawerItem
          label="প্রয়োজনীয় লিংকসমূহ"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="bookmark-multiple" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('প্রয়োজনীয় লিংকসমূহ')}
        />

        <View style={{ height: 1, backgroundColor: '#333', marginVertical: 10, marginHorizontal: 16 }} />

        <DrawerItem
          label="অ্যাপ সম্পর্কে"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="information-outline" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('অ্যাপ সম্পর্কে')}
        />

        <DrawerItem
          label="ডেভেলপার"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="account" color="#333" size={size} />}
          onPress={() => props.navigation.navigate('ডেভেলপার')}
        />

        <DrawerItem
          label="৫ স্টার রিভিউ দিন"
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="star-outline" color="#333" size={size} />}
          onPress={() => Linking.openURL(playStoreLink)}
        />

        <View style={{ alignItems: 'center' }}>
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

// Drawer wrapped in its own navigator
function DrawerContentNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: '#4CAF50',
        drawerInactiveTintColor: '#777',
        drawerLabelStyle: { marginLeft: -16 },
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="সময়সূচী" component={TimetableScreen} />
      <Drawer.Screen name="স্টেশন ম্যাপ" component={MapScreen} />
      <Drawer.Screen name="ডেটাবেজ আপডেট" component={DatabaseUpdateScreen} />
      <Drawer.Screen name="সেটিংস" component={SettingsScreen} />
      <Drawer.Screen name="রেলওয়ে ই-টিকিট" component={TicketNavigator} />
      <Drawer.Screen name="ট্রেন ট্র্যাকিং" component={TrackingNavigator} />
      <Drawer.Screen name="প্রয়োজনীয় লিংকসমূহ" component={UsefulLinksScreen} />
      <Drawer.Screen name="অ্যাপ সম্পর্কে" component={AboutScreen} />
      <Drawer.Screen name="ডেভেলপার" component={CreditsScreen} />
      <Drawer.Screen name="রিপোর্ট লোকেশন" component={TrackingReportScreen} />
    </Drawer.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <NavigationContainer>
<Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen name="DrawerHome" component={DrawerContentNavigator} />
  
  <Stack.Screen
    name="TrainDetails"
    component={TrainDetailsScreen}
    options={{
      headerShown: true,
      title: 'ট্রেনের বিস্তারিত',
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  />

  <Stack.Screen
    name="TrainTrackingScreen"
    component={TrainTrackingScreen} // ✅ make sure it's imported at the top
    options={{
      headerShown: true,
      title: 'লাইভ ট্র্যাকিং',
      headerStyle: { backgroundColor: '#4CAF50' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  />
</Stack.Navigator>

      </NavigationContainer>
    </>
  );
}
