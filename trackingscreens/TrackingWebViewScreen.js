// src/screens/WebViewScreen.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const TrackingWebViewScreen = ({ route }) => {
  const { trainNo } = route.params;

  const url = `https://narsingdi-transit-tracking.vercel.app/tracking/${trainNo}`;

  useEffect(() => {
    console.log('🚀 Navigating to URL:', url);
  }, [url]);

  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} startInLoadingState />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default TrackingWebViewScreen;
