
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

import ThemedHeader from '../components/ThemedHeader';

import TicketBottomNav from '../components/TicketBottomNav';

const HelplineScreen = () => {
  const [isConnected, setIsConnected] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert('ইন্টারনেট নেই', 'অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন');
      }
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ThemedHeader />
      {isConnected ? (
        <WebView
          source={{ uri: 'https://eticket.railway.gov.bd/contact-us' }}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
          )}
        />
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      <TicketBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HelplineScreen;