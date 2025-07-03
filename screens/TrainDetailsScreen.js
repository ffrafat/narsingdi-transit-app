import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import trainDetailsData from '../assets/trainDetails.json'; // ✅ Adjust path if needed

const TrainDetailsScreen = ({ route, navigation }) => {
  const trainNo = route.params?.trainNo;
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (trainNo && trainDetailsData[trainNo]) {
      setDetails(trainDetailsData[trainNo]);
    } else {
      setDetails(null);
    }
  }, [trainNo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${details?.name || 'ট্রেন'} (${trainNo || '—'})`,
    });
  }, [navigation, details, trainNo]);

  if (!details) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>
          দুঃখিত! ট্রেনের বিস্তারিত তথ্য পাওয়া যায়নি।
        </Text>
      </View>
    );
  }

  const runsOn = Array.isArray(details.runsOn)
    ? details.runsOn.join(', ')
    : 'তথ্য নেই';

  const routeStops = Array.isArray(details.routes) ? details.routes : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {details.name} ({trainNo})
      </Text>

      <Text style={styles.subtitle}>চলে: {runsOn}</Text>
      <Divider style={{ marginVertical: 12 }} />

      <Text style={styles.sectionTitle}>স্টপেজসমূহ</Text>
      {routeStops.length > 0 ? (
        routeStops.map((stop, index) => (
          <View key={index} style={styles.routeItem}>
            <Text style={styles.station}>{stop.station}</Text>
            <Text>
              আগমন: {stop.arrival || '—'} | ছাড়ে: {stop.departure || '—'}
            </Text>
            <Text>
              বিরতি: {stop.halt || '—'} | সময়কাল: {stop.duration || '—'}
            </Text>
            <Divider style={{ marginVertical: 8 }} />
          </View>
        ))
      ) : (
        <Text style={styles.fallbackText}>স্টপেজ তথ্য পাওয়া যায়নি।</Text>
      )}

      <Text style={styles.totalDuration}>
        মোট সময়কাল: {details.totalDuration || 'তথ্য নেই'}
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
