import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


// Bengali digit conversion
const engToBengaliDigit = (input) => {
  const digitMap = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return input.toString().split('').map(char => digitMap[char] || char).join('');
};

// Format to 12-hour Bengali time without AM/PM
const getBengaliTimeFromString = (time24h) => {
  if (!time24h) return '';
  let [hours, minutes] = time24h.split(':').map(Number);
  hours = hours % 12 || 12; // convert to 12-hour clock
  const hourBn = engToBengaliDigit(hours.toString().padStart(2, '0'));
  const minuteBn = engToBengaliDigit(minutes.toString().padStart(2, '0'));
  return `${hourBn}:${minuteBn}`;
};

const TrainCard = ({ train, highlight, passed }) => {
  const navigation = useNavigation();
  const cardStyle = highlight
    ? styles.highlightCard
    : passed
    ? styles.passedCard
    : styles.normalCard;

  const trainNo = train['Train No.'];
  const dayNight = train['Day Night Time'] || '';
  const time = getBengaliTimeFromString(train['From Station Time']);
  const offDay = train['Off Day']?.trim();

  return (
    <Card style={[styles.card, cardStyle]} elevation={2}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.leftSide}>
          <View style={styles.trainHeader}>
            <Icon
              name="train"
              size={highlight ? 26 : 22}
              color={highlight ? 'white' : passed ? '#666' : '#4caf50'}
            />
            <Text style={[
              styles.trainNo,
              highlight && { color: 'white' },
              passed && { color: '#666' }
            ]}>
              {trainNo}
            </Text>
          </View>
          <Text style={[
            styles.trainName,
            highlight && { color: 'white' },
            passed && { color: '#444' }
          ]}>
            {train['Train Name']}
          </Text>
          <Text style={[
            styles.trainRoute,
            highlight && { color: 'rgba(255,255,255,0.7)' },
            passed && { color: '#777' }
          ]}>
            {train['Start Station']} - {train['End Station']}
          </Text>
        </View>

        <View style={styles.rightSideWrapper}>
          <View style={styles.timeColumn}>
            <Text style={[
              styles.dayNightText,
              highlight && { color: 'white' },
              passed && { color: '#666' }
            ]}>
              {dayNight}
            </Text>
            <Text style={[
              styles.trainTime,
              highlight && { color: 'white' },
              passed && { color: '#444' }
            ]}>
              {time}
            </Text>
            {offDay !== '' && offDay !== undefined && (
              <View style={styles.offDayRow}>
                <Icon
                  name="calendar-remove"
                  size={18}
                  color={highlight ? 'white' : passed ? '#666' : 'gray'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[
                  styles.offDayText,
                  highlight && { color: 'white' },
                  passed && { color: '#666' }
                ]}>
                  {offDay}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonColumn}>
            <IconButton
              icon="information-outline"
              size={22}
              mode="contained"
              containerColor={highlight ? 'white' : '#e8f5e9'}
              iconColor={highlight ? '#4caf50' : '#4caf50'}
onPress={() =>
  navigation.navigate('TrainDetails', {
    trainNo, // ✅ only this
  })
}

            />
            <IconButton
              icon="radar"
              size={22}
              mode="contained"
              containerColor={highlight ? 'white' : '#e8f5e9'}
              iconColor={highlight ? '#4caf50' : '#4caf50'}
              onPress={() =>
                navigation.navigate('WebTracking', { trainNo: train.no })
              }
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  highlightCard: { backgroundColor: '#4caf50' },
  normalCard: { backgroundColor: '#fff' },
  passedCard: { backgroundColor: '#d6d6d6' },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: { flex: 1 },
  trainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trainNo: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    color: '#4caf50',
  },
  trainName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  trainRoute: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  rightSideWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  timeColumn: {
    alignItems: 'flex-end',
    marginRight: 10,
    minWidth: 80,
  },
  dayNightText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 4,
  },
  trainTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  offDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  offDayText: {
    fontSize: 14,
    color: 'gray',
  },
  buttonColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default TrainCard;
