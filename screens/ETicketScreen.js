import React from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const ETicketScreen = () => {
  return (
    <View style={styles.container}>
      <WebView
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
});

export default ETicketScreen;
