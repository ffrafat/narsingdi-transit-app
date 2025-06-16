import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import { useFocusEffect } from '@react-navigation/native';

const ETicketScreen = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [webViewKey, setWebViewKey] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert(
          'ইন্টারনেট সংযোগ নেই',
          'ই-টিকিট বুকিং পেইজ দেখতে ইন্টারনেট সংযোগ প্রয়োজন। অনুগ্রহ করে ইন্টারনেট সংযোগ চালু করে আবার চেষ্টা করুন।'
        );
      } else {
        setIsConnected(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Force reload WebView when screen is focused
  useFocusEffect(
    useCallback(() => {
      setWebViewKey((prevKey) => prevKey + 1);
    }, [])
  );

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
        key={webViewKey}
        source={{ uri: 'https://eticket.railway.gov.bd/' }}
        startInLoadingState
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
        renderLoading={() => (
          <ActivityIndicator size="large" color="#4caf50" style={styles.loader} />
        )}
        onError={() => {
          Alert.alert(
            'লোডিং সমস্যা',
            'ওয়েব পেজ লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।'
          );
        }}
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

export default ETicketScreen;
