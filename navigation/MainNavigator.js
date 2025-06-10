import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import { View, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import TimetableScreen from '../screens/TimetableScreen';
import AboutScreen from '../screens/AboutScreen';

const Drawer = createDrawerNavigator();
const playStoreLink = 'market://details?id=cc.rafat.narsingditransit';
const devProfileLink = 'market://dev?id=8574740223570326359';


function CustomDrawerContent(props) {



  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 60, flex: 1 }}>
      <View style={{ marginBottom: 10, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#4CAF50' }}>
          নরসিংদী ট্রানজিট
        </Text>
        <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
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
        label="আমাদের সম্পর্কে"
        icon={({ color, size }) => <Icon name="information-outline" color={color} size={size} />}
        onPress={() => props.navigation.navigate('আমাদের সম্পর্কে')}
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
