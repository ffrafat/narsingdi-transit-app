import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const VerifyScreen = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert(
          'ইন্টারনেট সংযোগ নেই',
          'টিকিট যাচাই করতে ইন্টারনেট সংযোগ প্রয়োজন। অনুগ্রহ করে ইন্টারনেট সংযোগ চালু করে আবার চেষ্টা করুন।'
        );
      } else {
        setIsConnected(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>ইন্টারনেট সংযোগ পাওয়া যায়নি</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://eticket.railway.gov.bd/verify-ticket' }}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" color="#4caf50" style={styles.loader} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default VerifyScreen;
