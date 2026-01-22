import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Bengali digit converter
const engToBengaliDigit = (input) => {
  const digitMap = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return input.toString().split('').map(char => digitMap[char] || char).join('');
};

const convertBnToEnDigits = (input) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let output = '';
  for (let char of String(input)) {
    const index = bnDigits.indexOf(char);
    output += index === -1 ? char : index.toString();
  }
  return output;
};

const getBengaliTimeFromString = (time24h) => {
  if (!time24h) return '';
  let [hours, minutes] = time24h.split(':').map(Number);
  hours = hours % 12 || 12;
  return `${engToBengaliDigit(hours.toString().padStart(2, '0'))}:${engToBengaliDigit(minutes.toString().padStart(2, '0'))}`;
};

const TrainCard = ({ train, highlight, passed }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const trainNo = train['Train No.'] || '';
  const trainName = train['Train Name'] || '';
  const dayNight = train['Day Night Time'] || '';
  const time = getBengaliTimeFromString(train['From Station Time']);
  const offDay = train['Off Day']?.trim();
  const englishTrainNo = convertBnToEnDigits(String(trainNo));

  const styles = getStyles(theme, highlight, passed);

  // Define dynamic colors to avoid StyleSheet property access issues
  const iconColors = {
    info: highlight ? '#FFFFFF' : theme.colors.onSecondaryContainer,
    track: highlight ? '#FFFFFF' : theme.colors.onPrimaryContainer,
    route: highlight ? 'rgba(255,255,255,0.8)' : theme.colors.onSurfaceVariant,
    offDay: highlight ? '#FFCDD2' : theme.colors.error,
  };

  const CardContent = () => (
    <View style={styles.content}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        <View style={styles.header}>
          <View style={styles.trainNoBox}>
            <Text style={styles.trainNoText}>{trainNo}</Text>
          </View>
          <Text style={styles.trainName} numberOfLines={1}>{trainName}</Text>
        </View>

        <View style={styles.routeRow}>
          <Icon name="map-marker-path" size={16} color={iconColors.route} />
          <Text style={styles.routeText} numberOfLines={1}>
            {train['Start Station']} → {train['End Station']}
          </Text>
        </View>

        {offDay && (
          <View style={styles.offDayRow}>
            <Icon name="calendar-remove" size={14} color={iconColors.offDay} />
            <Text style={styles.offDayText}>{offDay} বন্ধ</Text>
          </View>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        <View style={styles.timeContainer}>
          <Text style={styles.dayNight}>{dayNight}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={styles.time}>{time}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TrainDetails', { trainNo })}
            style={[styles.btn, styles.btnInfo]}
          >
            <Icon name="information" size={20} color={iconColors.info} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('WebTracking', { trainNo: englishTrainNo })}
            style={[styles.btn, styles.btnTrack]}
          >
            <Icon name="map-marker" size={18} color={iconColors.track} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (highlight) {
    return (
      <LinearGradient
        colors={['#075d37', '#41ab5d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <CardContent />
      </LinearGradient>
    );
  }

  return (
    <View style={styles.card}>
      <CardContent />
    </View>
  );
};

const getStyles = (theme, highlight, passed) => {
  const cardBg = highlight ? theme.colors.primary : passed ? theme.colors.surfaceVariant : theme.colors.surface;
  const textColor = highlight ? '#FFFFFF' : passed ? theme.colors.outline : theme.colors.onSurface;
  const mutedColor = highlight ? 'rgba(255,255,255,0.8)' : theme.colors.onSurfaceVariant;

  return StyleSheet.create({
    card: {
      marginHorizontal: 12,
      marginVertical: 6,
      borderRadius: 16,
      backgroundColor: highlight ? 'transparent' : cardBg,
      elevation: highlight ? 4 : 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: highlight ? 'rgba(255,255,255,0.2)' : theme.colors.outlineVariant,
      overflow: 'hidden',
    },
    content: {
      flexDirection: 'row',
      padding: 16,
    },
    leftSection: {
      flex: 1,
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    trainNoBox: {
      backgroundColor: highlight ? 'rgba(255,255,255,0.2)' : theme.colors.primaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      marginRight: 10,
    },
    trainNoText: {
      fontSize: 11,
      fontWeight: '900',
      color: highlight ? '#FFFFFF' : theme.colors.onPrimaryContainer,
      letterSpacing: 0.5,
    },
    trainName: {
      fontSize: 18,
      fontWeight: '800',
      color: textColor,
      flex: 1,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    routeText: {
      fontSize: 13,
      fontWeight: '600',
      color: mutedColor,
      marginLeft: 8,
      flex: 1,
    },
    offDayRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    offDayText: {
      fontSize: 11,
      fontWeight: '700',
      color: highlight ? '#FFCDD2' : theme.colors.error,
      marginLeft: 6,
    },
    rightSection: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginLeft: 16,
    },
    timeContainer: {
      alignItems: 'flex-end',
    },
    dayNight: {
      fontSize: 10,
      fontWeight: '900',
      color: highlight ? 'rgba(255,255,255,0.7)' : theme.colors.secondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    time: {
      fontSize: 28,
      fontWeight: '900',
      color: highlight ? '#FFFFFF' : theme.colors.primary,
      letterSpacing: -1,
      lineHeight: 32,
    },

    actions: {
      flexDirection: 'row',
      marginTop: 8,
    },
    btn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    btnInfo: {
      backgroundColor: highlight ? 'rgba(255, 255, 255, 0.2)' : theme.colors.secondaryContainer,
      borderWidth: highlight ? 1 : 0,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    btnTrack: {
      backgroundColor: highlight ? 'rgba(255, 255, 255, 0.2)' : theme.colors.primaryContainer,
      borderWidth: highlight ? 1 : 0,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
  });
};

export default TrainCard;
