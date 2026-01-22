import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Divider, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import trainDetailsData from '../assets/trainDetails.json';

const TrainDetailsScreen = ({ route, navigation }) => {
  const trainNo = route.params?.trainNo;
  const [details, setDetails] = useState(null);
  const theme = useTheme();
  const styles = getStyles(theme);

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
      <Text style={styles.title}>{details.name} ({trainNo})</Text>
      <Text style={styles.subtitle}>চলে: {runsOn}</Text>
      <Divider style={{ marginVertical: 12 }} />

      <View style={styles.sectionHeader}>
        <Icon name="train-car" size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
        <Text style={styles.sectionTitle}>স্টপেজসমূহ</Text>
      </View>

      {routeStops.length > 0 ? (
        routeStops.map((stop, index) => (
          <Card key={index} style={styles.stopCard} mode="outlined">
            <Card.Content>
              <Text style={styles.station}>{stop.station}</Text>

              <View style={styles.row}>
                <Icon name="clock-outline" size={16} color={theme.colors.onSurfaceVariant} style={styles.icon} />
                <Text style={styles.stopInfo}>
                  আগমন: {stop.arrival || '—'} | ছাড়ে: {stop.departure || '—'}
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="timer-sand" size={16} color={theme.colors.onSurfaceVariant} style={styles.icon} />
                <Text style={styles.stopInfo}>
                  বিরতি: {stop.halt || '—'} মিনিট | সময়কাল: {stop.duration || '—'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text style={styles.fallbackText}>স্টপেজ তথ্য পাওয়া যায়নি।</Text>
      )}

      <View style={styles.durationCard}>
        <View style={styles.rowCenter}>
          <Icon name="clock-check-outline" size={18} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.durationText}>
            মোট সময়কাল: {details.totalDuration || 'তথ্য নেই'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: theme.colors.background,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.colors.background,
  },
  fallbackText: {
    fontSize: 18,
    color: theme.colors.error,
    textAlign: 'center',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
    color: theme.colors.onSurface,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  stopCard: {
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderColor: theme.colors.outlineVariant,
  },
  station: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 6,
  },
  stopInfo: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  durationCard: {
    marginTop: 20,
    padding: 14,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 8,
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onPrimaryContainer,
    textAlign: 'center',
  },
  icon: {
    marginRight: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default TrainDetailsScreen;
