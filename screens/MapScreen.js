import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const stations = [
  { name: 'ভৈরব', mapUrl: 'https://maps.app.goo.gl/VtrF4pZNouEjXxNq5' },
  { name: 'দৌলতকান্দি', mapUrl: 'https://maps.app.goo.gl/bZhhDN3uCNr9Vjc96' },
  { name: 'স্রিনিধি', mapUrl: 'https://maps.app.goo.gl/8SpgP6FeVBXwdQhE9' },
  { name: 'মেথিকান্দা', mapUrl: 'https://maps.app.goo.gl/rkwX8jNLXM4X1sxS6' },
  { name: 'হাঁটুভাঙ্গা', mapUrl: 'https://maps.app.goo.gl/psDsbn8kq4A1wD9K9' },
  { name: 'খানাবাড়ি', mapUrl: 'https://maps.app.goo.gl/uUqtANxtPHGPJVFz8' },
  { name: 'আমীরগঞ্জ', mapUrl: 'https://maps.app.goo.gl/x8SyBMFud1dX2XVT8' },
  { name: 'নরসিংদী', mapUrl: 'https://maps.app.goo.gl/rAFXRWJdat5jgMw88' },
  { name: 'জিনারদী', mapUrl: 'https://maps.app.goo.gl/NzWCGarJoBkWcrKRA' },
  { name: 'ঘোড়াশাল', mapUrl: 'https://maps.app.goo.gl/skdUg3ZNxNpWSBud6' },
  { name: 'আড়িখোলা', mapUrl: 'https://maps.app.goo.gl/u8j3jgAFXSn2b1S67' },
  { name: 'পূবাইল', mapUrl: 'https://maps.app.goo.gl/eJLYEcaJUiWBQsvf8' },
  { name: 'টঙ্গী', mapUrl: 'https://maps.app.goo.gl/xfp9SuNM7UTdc8Yd9' },
  { name: 'এয়ারপোর্ট', mapUrl: 'https://maps.app.goo.gl/f8nuZu5gjd65ytU69' },
  { name: 'ক্যান্টনমেন্ট', mapUrl: 'https://maps.app.goo.gl/wAVDamtjAcvZ65MA8' },
  { name: 'তেজগাঁও', mapUrl: 'https://maps.app.goo.gl/Lq9ocMoAcywR2z4KA' },
  { name: 'কমলাপুর', mapUrl: 'https://maps.app.goo.gl/199jR4HkTmhb4TXX6' },
];


const MapScreen = () => {
  const openMap = (url) => {
    Linking.openURL(url).catch((err) => console.warn('Cannot open map:', err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {stations.map((station, index) => (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View style={styles.dot} />
            {index !== stations.length - 1 && <View style={styles.line} />}
          </View>

          <View style={styles.contentRow}>
            <Text style={styles.stationName} numberOfLines={1} ellipsizeMode="tail">
              {station.name}
            </Text>
            <Button
              icon="map-marker"
              mode="contained"
              onPress={() => openMap(station.mapUrl)}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              style={styles.mapButton}
              compact
            >
              গুগল ম্যাপ
            </Button>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 30,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4caf50',
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#ccc',
    marginTop: 4,
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    elevation: 2,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
    marginRight: 12,
  },
  mapButton: {
    borderRadius: 6,
    backgroundColor: '#4caf50',
  },
  buttonContent: {
    flexDirection: 'row-reverse',
  },
  buttonLabel: {
    color: '#fff',
    fontWeight: '600',
  },
});


export default MapScreen;
