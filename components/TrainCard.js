import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Bengali digit conversion
const engToBengaliDigit = (input) => {
  const digitMap = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  };
  return input.toString().split('').map(char => digitMap[char] || char).join('');
};

// AM/PM mapping
const amPmMap = {
  AM: 'পূর্বাহ্ণ',
  PM: 'অপরাহ্ণ',
};

// Format Date object to Bengali time string
const getBengaliTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  const hourBn = engToBengaliDigit(hours);
  const minuteBn = engToBengaliDigit(minutes.toString().padStart(2, '0'));
  const ampmBn = amPmMap[ampm];

  return `${hourBn}:${minuteBn}`;
};

// Convert "HH:mm" string to Bengali time format
const getBengaliTimeFromString = (time24h) => {
  if (!time24h) return '';
  const [hours, minutes] = time24h.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return getBengaliTime(date);
};

const TrainCard = ({ train, highlight, passed }) => {
  const cardStyle = highlight
    ? styles.highlightCard
    : passed
    ? styles.passedCard
    : styles.normalCard;

  return (
    <Card style={[styles.card, cardStyle]}>
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
              {train['Train No.']}
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

        <View style={styles.rightSide}>
          <Text style={[
            styles.dayNightText,
            highlight && { color: 'white' },
            passed && { color: '#666' }
          ]}>
            {train['Day Night Time']}
          </Text>
          <Text style={[
            styles.trainTime,
            highlight && { color: 'white' },
            passed && { color: '#444' }
          ]}>
            {getBengaliTimeFromString(train['From Station Time'])}
          </Text>

          {train['Off Day']?.trim() !== '' && (
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
                {train['Off Day'] || 'None'}
              </Text>
            </View>
          )}
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
    elevation: 4,
  },
  highlightCard: {
    backgroundColor: '#4caf50', // green bg
  },
  normalCard: {
    backgroundColor: 'white',
  },
  passedCard: {
    backgroundColor: '#d6d6d6', // dark gray
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flex: 1,
  },
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
  rightSide: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 100,
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
  dayNightText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
  },
});

export default TrainCard;
