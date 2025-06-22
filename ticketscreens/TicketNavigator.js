import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ETicketHomeScreen from '../screens/ETicketHomeScreen';
import BuyTicketScreen from '..ticketscreens/BuyTicketScreen';
import VerifyTicketScreen from '..ticketscreens/VerifyTicketScreen';

const Stack = createNativeStackNavigator();

const TicketNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ETicketHome" component={ETicketHomeScreen} options={{ title: 'ই-টিকিট' }} />
      <Stack.Screen name="BuyTicket" component={BuyTicketScreen} options={{ title: 'টিকিট কিনুন' }} />
      <Stack.Screen name="VerifyTicket" component={VerifyTicketScreen} options={{ title: 'টিকিট যাচাই' }} />
    </Stack.Navigator>
  );
};

export default TicketNavigator;
