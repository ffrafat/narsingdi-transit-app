
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const ChangePasswordScreen = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert('ইন্টারনেট নেই', 'অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      {isConnected ? (
        <WebView
          source={{ uri: 'https://railapp.railway.gov.bd/profile/change-password' }}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator size="large" color="#4caf50" style={styles.loader} />
          )}
        />
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4caf50" />
        </View>
      )}
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

export default ChangePasswordScreen;