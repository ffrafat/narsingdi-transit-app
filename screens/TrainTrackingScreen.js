import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, Divider, IconButton, Card } from 'react-native-paper';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const isToday = (timestamp) => {
  if (!timestamp) return false;
  const date = new Date(timestamp?.toDate ? timestamp.toDate() : timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const TrainTrackingScreen = ({ route, navigation }) => {
  console.log('📥 Received params:', route?.params);
  const trainNo = route?.params?.trainNo;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = useCallback(() => {
    if (!trainNo) {
      setReports([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'trackingReports'),
      where('trainNo', '==', trainNo),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const items = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => isToday(item.timestamp));

        setReports(items);
        setLoading(false);
        setRefreshing(false);
      },
      err => {
        console.error('লাইভ ট্র্যাকিং ত্রুটি:', err);
        setReports([]);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return unsubscribe;
  }, [trainNo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `ট্রেন ${trainNo} - লাইভ ট্র্যাকিং`,
      headerRight: () => (
        <IconButton
          icon="refresh"
          size={24}
          onPress={() => {
            setRefreshing(true);
            fetchReports();
          }}
        />
      ),
    });
  }, [navigation, fetchReports, trainNo]);

  useEffect(() => {
    const unsubscribe = fetchReports();
    return () => unsubscribe?.();
  }, [fetchReports]);

  if (loading) {
    return <Text style={styles.loadingText}>লোড হচ্ছে...</Text>;
  }

  const renderItem = ({ item, index }) => {
    const time = item.timestamp?.toDate?.()
      ? new Date(item.timestamp.toDate())
      : new Date(item.timestamp || item.reportedAt);

    return (
      <View style={styles.timelineItem}>
        <View style={styles.timelineColumn}>
          <View style={styles.timelineDot} />
          {index !== reports.length - 1 && <View style={styles.timelineLine} />}
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{item.station} - {item.status}</Text>
            <Text style={styles.time}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {item.note ? <Text style={styles.note}>মন্তব্য: {item.note}</Text> : null}
            {item.name ? <Text style={styles.reporter}>প্রেরক: {item.name}</Text> : null}
          </Card.Content>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {reports.length === 0 ? (
        <Text style={styles.noDataText}>আজকের জন্য কোনও লাইভ রিপোর্ট নেই।</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => {
              setRefreshing(true);
              fetchReports();
            }} />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 32, textAlign: 'center', fontSize: 16 },
  noDataText: {
    marginTop: 48,
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 20,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4caf50',
    marginTop: 6,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#c8e6c9',
    marginVertical: 4,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#666',
  },
  note: {
    fontSize: 14,
    marginTop: 6,
    color: '#444',
  },
  reporter: {
    fontSize: 13,
    marginTop: 6,
    fontStyle: 'italic',
    color: '#888',
  },
});

export default TrainTrackingScreen;
