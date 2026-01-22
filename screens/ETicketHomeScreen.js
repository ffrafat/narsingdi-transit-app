import React from 'react';
import { View, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const options = [
  { title: 'টিকিট ক্রয়', icon: 'ticket-confirmation', screen: 'BuyTicket' },
  { title: 'টিকিট যাচাই', icon: 'ticket-account', screen: 'VerifyTicket' },
  { title: 'ট্রেনের তথ্য', icon: 'train', screen: 'TrainInfo' },
  { title: 'প্রোফাইল', icon: 'account', screen: 'Profile' },
  { title: 'ক্রয়কৃত টিকেট', icon: 'history', screen: 'PurchaseHistory' },
  { title: 'পাসওয়ার্ড পরিবর্তন', icon: 'lock-reset', screen: 'ChangePassword' },
  { title: 'হেল্পলাইন', icon: 'headset', screen: 'Helpline' },
  { title: 'শর্তাবলী', icon: 'file-document-outline', screen: 'Terms' },
];

const numColumns = 2;
const cardSize = Dimensions.get('window').width / numColumns - 24;

const ETicketHomeScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const styles = getStyles(theme);

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
              <Icon name={item.icon} size={32} color={theme.colors.primary} />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 12,
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  cardWrapper: {
    width: cardSize,
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
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
    color: theme.colors.onSurface,
  },
});


export default ETicketHomeScreen;
