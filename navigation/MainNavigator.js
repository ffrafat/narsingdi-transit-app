import React from 'react';
import { Alert, StatusBar, Linking, View, Text, Image, useColorScheme } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, DefaultTheme as NavDefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';

// Main Screen Imports
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TimetableScreen from '../screens/TimetableScreen';
import AboutScreen from '../screens/AboutScreen';
import CreditsScreen from '../screens/CreditsScreen';
import UsefulLinksScreen from '../screens/UsefulLinksScreen';


// Tracking Related Screens
import LiveTrackingHomeScreen from '../screens/LiveTrackingHomeScreen';
import TrackingNavigator from '../trackingscreens/TrackingNavigator';
import TrackingWebViewScreen from '../trackingscreens/TrackingWebViewScreen';


// ETicket Related Screens
import ETicketHomeScreen from '../screens/ETicketHomeScreen';
import TicketNavigator from '../ticketscreens/TicketNavigator';

// Train Details Page Import
import TrainDetailsScreen from '../screens/TrainDetailsScreen';


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const playStoreLink = 'market://details?id=cc.rafat.narsingditransit';
const devProfileLink = 'https://play.google.com/store/apps/dev?id=8574740223570326359';

function CustomDrawerContent(props) {
  const theme = useTheme();
  const isDark = theme.dark;

  return (
    <LinearGradient
      colors={isDark ? ['#121212', '#2E7D32'] : ['#ffffff', '#4CAF50']}
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
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="train" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('সময়সূচী')}
        />
        <DrawerItem
          label="ট্রেন ট্র্যাকিং"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="satellite-variant" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('ট্রেন ট্র্যাকিং')}
        />

        <DrawerItem
          label="স্টেশন ম্যাপ"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="map" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('স্টেশন ম্যাপ')}
        />

        <DrawerItem
          label="সেটিংস"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="cog" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('সেটিংস')}
        />

        <View style={{ height: 1, backgroundColor: theme.colors.outlineVariant, marginVertical: 10, marginHorizontal: 16 }} />

        <DrawerItem
          label="রেলওয়ে ই-টিকিট"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="ticket-confirmation" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('রেলওয়ে ই-টিকিট')}
        />

        <DrawerItem
          label="প্রয়োজনীয় লিংকসমূহ"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="bookmark-multiple" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('প্রয়োজনীয় লিংকসমূহ')}
        />

        <View style={{ height: 1, backgroundColor: theme.colors.outlineVariant, marginVertical: 10, marginHorizontal: 16 }} />

        <DrawerItem
          label="অ্যাপ সম্পর্কে"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="information-outline" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('অ্যাপ সম্পর্কে')}
        />

        <DrawerItem
          label="ডেভেলপার"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="account" color={theme.colors.onSurface} size={size} />}
          onPress={() => props.navigation.navigate('ডেভেলপার')}
        />

        <DrawerItem
          label="৫ স্টার রিভিউ দিন"
          labelStyle={{ color: theme.colors.onSurface, fontWeight: 'bold' }}
          icon={({ size }) => <Icon name="star-outline" color={theme.colors.onSurface} size={size} />}
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
          <Text style={{ fontSize: 14, color: theme.colors.onSurface, textAlign: 'center' }}>
            ভালোবাসা দিয়ে তৈরি ❤️ নরসিংদীর মানুষের জন্য
          </Text>
          <Text style={{ fontSize: 12, color: theme.colors.onSurface, opacity: 0.7, textAlign: 'center' }}>
            © ২০২৫ - ফয়সাল ফারুকী রাফাত - সর্বস্বত্ত্ব সংরক্ষিত
          </Text>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
}

// Drawer wrapped in its own navigator
function DrawerContentNavigator() {
  const theme = useTheme();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: theme.colors.primary,
        drawerInactiveTintColor: theme.colors.onSurfaceVariant,
        drawerLabelStyle: { marginLeft: -16 },
        headerStyle: {
          backgroundColor: '#075d37',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="সময়সূচী" component={TimetableScreen} />
      <Drawer.Screen name="স্টেশন ম্যাপ" component={MapScreen} />
      <Drawer.Screen name="সেটিংস" component={SettingsScreen} />
      <Drawer.Screen name="রেলওয়ে ই-টিকিট" component={TicketNavigator} />
      <Drawer.Screen name="ট্রেন ট্র্যাকিং" component={TrackingNavigator} />
      <Drawer.Screen name="প্রয়োজনীয় লিংকসমূহ" component={UsefulLinksScreen} />
      <Drawer.Screen name="অ্যাপ সম্পর্কে" component={AboutScreen} />
      <Drawer.Screen name="ডেভেলপার" component={CreditsScreen} />
    </Drawer.Navigator>
  );
}

export default function MainNavigator() {
  const theme = useTheme();
  const isDark = theme.dark;

  const MyNavTheme = {
    ...(isDark ? NavDarkTheme : NavDefaultTheme),
    colors: {
      ...(isDark ? NavDarkTheme.colors : NavDefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.onSurface,
      border: theme.colors.outlineVariant,
      notification: theme.colors.error,
    },
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "light-content"}
        backgroundColor="#075d37"
      />
      <NavigationContainer theme={MyNavTheme}>

        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="DrawerHome" component={DrawerContentNavigator} />


          <Stack.Screen
            name="WebTracking"
            component={TrackingWebViewScreen}
            options={{
              headerShown: true,
              title: 'লাইভ ট্র্যাকিং আপডেট',
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />


          <Stack.Screen
            name="TrainDetails"
            component={TrainDetailsScreen}
            options={{
              headerShown: true,
              title: 'ট্রেনের বিস্তারিত',
              headerStyle: { backgroundColor: theme.colors.primary },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>

      </NavigationContainer>
    </>
  );
}
