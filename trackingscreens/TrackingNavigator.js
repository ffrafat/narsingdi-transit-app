import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Necessary Screens
import LiveTrackingHomeScreen from '../screens/LiveTrackingHomeScreen';
import TrainTrackingList from '../trackingscreens/TrainTrackingList';
import TrainReportScreen from '../trackingscreens/TrainReportScreen';
import TrackingProfileScreen from '../trackingscreens/TrackingProfileScreen';
import TrackingAnalyticsScreen from '../trackingscreens/TrackingAnalyticsScreen';


const Stack = createNativeStackNavigator();

const TrackingNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LiveTrackingHomeScreen" component={LiveTrackingHomeScreen} options={{ title: 'ট্রেন ট্র্যাকিং' }} />
      <Stack.Screen name="TrainTrackingList" component={TrainTrackingList} />
      <Stack.Screen name="TrainReportScreen" component={TrainReportScreen} />
      <Stack.Screen name="TrackingProfileScreen" component={TrackingProfileScreen} />
      <Stack.Screen name="TrackingAnalyticsScreen" component={TrackingAnalyticsScreen} />
    </Stack.Navigator>
  );
};

export default TrackingNavigator;