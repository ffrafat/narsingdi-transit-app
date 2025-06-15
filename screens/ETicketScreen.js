import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const ETicketScreen = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://eticket.railway.gov.bd/' }}
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

export default ETicketScreen;
