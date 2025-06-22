import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Necessary Screens
import ETicketHomeScreen from '../screens/ETicketHomeScreen';
import BuyTicketScreen from '../ticketscreens/BuyTicketScreen';
import VerifyTicketScreen from '../ticketscreens/VerifyTicketScreen';
import TrainInfoScreen from '../ticketscreens/TrainInfoScreen';
import ProfileScreen from '../ticketscreens/ProfileScreen';
import PurchaseHistoryScreen from '../ticketscreens/PurchaseHistoryScreen';
import ChangePasswordScreen from '../ticketscreens/ChangePasswordScreen';
import HelplineScreen from '../ticketscreens/HelplineScreen';
import TermsScreen from '../ticketscreens/TermsScreen';


const Stack = createNativeStackNavigator();

const TicketNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ETicketHome" component={ETicketHomeScreen} options={{ title: 'ই-টিকিট' }} />
      <Stack.Screen name="BuyTicket" component={BuyTicketScreen} options={{ title: 'টিকিট কিনুন' }} />
      <Stack.Screen name="VerifyTicket" component={VerifyTicketScreen} />
      <Stack.Screen name="TrainInfo" component={TrainInfoScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Helpline" component={HelplineScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
    </Stack.Navigator>
  );
};

export default TicketNavigator;
