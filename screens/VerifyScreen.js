import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const VerifyScreen = () => {
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
});

export default VerifyScreen;
