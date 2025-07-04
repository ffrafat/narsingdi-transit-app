import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Text, IconButton, Card } from 'react-native-paper';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import * as Device from 'expo-device';

const isWithinLast3Hours = (timestamp) => {
  if (!timestamp) return false;
  const reportTime = new Date(timestamp?.toDate?.() || timestamp);
  const now = new Date();
  const diffMs = now - reportTime;
  return diffMs <= 3 * 60 * 60 * 1000; // 3 hours
};

const getTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp?.toDate?.() || timestamp);
  const now = new Date();
  const diffMs = now - date;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const bnDigits = (n) =>
    n.toString().replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);

  const timeStr = `${bnDigits(hours)} ঘণ্টা ${bnDigits(minutes)} মিনিট আগে`;
  const actualTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${timeStr} (${actualTime})`;
};

const TrainTrackingScreen = ({ route, navigation }) => {
  const trainNo = route?.params?.trainNo;
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const id = Device.osInternalBuildId || Device.modelId || 'unknown-device';
    setDeviceId(id);
  }, []);

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
          .filter(item => isWithinLast3Hours(item.timestamp));

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
          iconColor="#fff"
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

  const latestReport = reports[0];
  const otherReports = reports.slice(1);

  const renderCard = (item, isLatest = false) => {
    const isOwner = item.deviceId === deviceId;

    const handleDelete = () => {
      Alert.alert('মুছবেন?', 'আপনি কি এই রিপোর্টটি মুছতে চান?', [
        { text: 'না', style: 'cancel' },
        {
          text: 'হ্যাঁ, মুছুন',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'trackingReports', item.id));
            } catch (err) {
              console.error('মুছতে ব্যর্থ:', err);
              Alert.alert('ত্রুটি', 'রিপোর্ট মোছা যায়নি।');
            }
          },
        },
      ]);
    };

    return (
      <Card style={[styles.card, isLatest ? styles.latestCard : null]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={[styles.title, isLatest && { color: '#fff' }]}>
              {item.station} - {item.status}
            </Text>
            {isOwner && (
              <IconButton
                icon="delete"
                size={20}
                iconColor={isLatest ? '#fff' : '#d32f2f'}
                onPress={handleDelete}
                style={styles.deleteIcon}
              />
            )}
          </View>

          <Text style={[styles.timeAgo, isLatest && { color: '#fff' }]}>
            {getTimeAgo(item.timestamp)}
          </Text>

          {item.note ? (
            <Text style={[styles.note, isLatest && { color: '#fff' }]}>
              মন্তব্য: {item.note}
            </Text>
          ) : null}
          {item.name ? (
            <Text style={[styles.reporter, isLatest && { color: '#fff' }]}>
              রিপোর্ট করেছেন: {item.name}
            </Text>
          ) : null}
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      {reports.length === 0 ? (
        <Text style={styles.noDataText}>গত ৩ ঘণ্টায় কোনও রিপোর্ট পাওয়া যায়নি।</Text>
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.sectionHeader}>সর্বশেষ অবস্থা</Text>
              {renderCard(latestReport, true)}
              {otherReports.length > 0 && (
                <Text style={styles.sectionHeader}>গত ৩ ঘণ্টার অন্যান্য আপডেট</Text>
              )}
            </>
          }
          data={otherReports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>{renderCard(item)}</View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchReports();
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: 32 }}
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2e7d32',
    marginTop: 12,
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    marginBottom: 12,
  },
  latestCard: {
    backgroundColor: '#4caf50',
  },
  cardWrapper: {
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteIcon: {
    margin: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 14,
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
