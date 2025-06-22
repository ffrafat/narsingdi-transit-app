import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const options = [
  { title: 'টিকিট কিনুন', icon: 'ticket-confirmation', screen: 'BuyTicket' },
  { title: 'টিকিট যাচাই', icon: 'ticket-account', screen: 'VerifyTicket' },
  { title: 'ট্রেন তথ্য', icon: 'train', screen: 'TrainInfo' },
  { title: 'প্রোফাইল', icon: 'account', screen: 'Profile' },
  { title: 'ক্রয় ইতিহাস', icon: 'history', screen: 'PurchaseHistory' },
  { title: 'পাসওয়ার্ড পরিবর্তন', icon: 'lock-reset', screen: 'ChangePassword' },
  { title: 'হেল্পলাইন', icon: 'headset', screen: 'Helpline' },
  { title: 'শর্তাবলী', icon: 'file-document-outline', screen: 'Terms' },
];

const numColumns = 2;
const cardSize = Dimensions.get('window').width / numColumns - 24;

const ETicketHome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.cardWrapper}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <Icon name={item.icon} size={32} color="#4caf50" />
              <Text style={styles.title}>{item.title}</Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
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
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
});

export default ETicketHomeScreen;
