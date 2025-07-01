// screens/TrainDetailsScreen.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';

const TrainDetailsScreen = ({ route }) => {
  const trainDetails = route?.params?.trainDetails;

  if (!trainDetails) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>দুঃখিত! ট্রেনের বিস্তারিত তথ্য পাওয়া যায়নি।</Text>
      </View>
    );
  }

  const runsOn = Array.isArray(trainDetails.runsOn) ? trainDetails.runsOn.join(', ') : 'তথ্য নেই';
  const routeStops = Array.isArray(trainDetails.routes) ? trainDetails.routes : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {trainDetails.name} ({route.params.trainNo})
      </Text>
      <Text style={styles.subtitle}>চলে: {runsOn}</Text>

      <Divider style={{ marginVertical: 12 }} />

      <Text style={styles.sectionTitle}>স্টপেজসমূহ</Text>
      {routeStops.length > 0 ? (
        routeStops.map((stop, index) => (
          <View key={index} style={styles.routeItem}>
            <Text style={styles.station}>{stop.station}</Text>
            <Text>আগমন: {stop.arrival || '—'} | ছাড়ে: {stop.departure || '—'}</Text>
            <Text>বিরতি: {stop.halt || '—'} | সময়কাল: {stop.duration || '—'}</Text>
            <Divider style={{ marginVertical: 8 }} />
          </View>
        ))
      ) : (
        <Text style={styles.fallbackText}>স্টপেজ তথ্য পাওয়া যায়নি।</Text>
      )}

      <Text style={styles.totalDuration}>
        মোট সময়কাল: {trainDetails.totalDuration || 'তথ্য নেই'}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  fallbackText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4caf50',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  routeItem: {
    marginBottom: 4,
  },
  station: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalDuration: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#000',
  },
});

export default TrainDetailsScreen;
