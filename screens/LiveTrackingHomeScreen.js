import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const options = [
  { title: 'লাইভ ট্র্যাকিং', icon: 'satellite-variant', screen: 'TrainTrackingList' },
  { title: 'ট্রেন রিপোর্ট', icon: 'clipboard-text-outline', screen: 'TrainReportScreen' },
  { title: 'ড্যাশবোর্ড', icon: 'chart-line', screen: 'TrackingAnalyticsScreen' },
  { title: 'প্রোফাইল', icon: 'account', screen: 'TrackingProfileScreen' },
];

const numColumns = 2;
const cardSize = Dimensions.get('window').width / numColumns - 24;

const LiveTrackingHomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => navigation.navigate(item.screen)}
          style={styles.cardWrapper}
        >
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Icon name={item.icon} size={32} color="#4caf50" />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
  },
  cardWrapper: {
    width: cardSize,
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginHorizontal: 2,
    marginVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#222',
  },
});

export default LiveTrackingHomeScreen;
