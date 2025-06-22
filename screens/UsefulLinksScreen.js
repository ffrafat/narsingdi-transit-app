import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const links = [
  {
    title: 'নরসিংদী রেলওয়ে প্যাসেঞ্জারস কম্যুনিটি',
    icon: 'facebook',
    url: 'https://www.facebook.com/groups/315866319072545',
  },
  {
    title: 'নরসিংদী ট্রানজিট অ্যাপ চ্যাট গ্রুপ',
    icon: 'facebook-messenger',
    url: 'https://m.me/ch/AbZHGHvKxV-t7BW1/?send_source=cm%3Acopy_invite_link',
  },
  {
    title: 'পূর্বাঞ্চল ট্রেনের সময়সূচি',
    icon: 'calendar-month',
    url: 'https://railway.portal.gov.bd/site/page/988258c9-5f11-4719-91e2-fbc898d4c2a9/-%E0%A6%AA%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%B2%E0%A7%87%E0%A6%B0-%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A8%E0%A7%87%E0%A6%B0-%E0%A6%B8%E0%A6%AE%E0%A7%9F%E0%A6%B8%E0%A7%82%E0%A6%9A%E0%A6%BF',
  },
  {
    title: 'পূর্বাঞ্চল ট্রেনের ভাড়ার তালিকা',
    icon: 'currency-bdt',
    url: 'https://railway.portal.gov.bd/site/files/e290cbe6-88c6-445d-b7bd-28ee288f6a0a/%E0%A6%9F%E0%A6%BF%E0%A6%95%E0%A6%BF%E0%A6%9F%E0%A7%87%E0%A6%B0-%E0%A6%AE%E0%A7%82%E0%A6%B2%E0%A7%8D%E0%A6%AF-%E0%A6%A4%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%95%E0%A6%BE-(%E0%A6%AA%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%B2)',
  },
];

const UsefulLinksScreen = () => {
  const handlePress = (url) => {
    Linking.openURL(url).catch((err) => console.warn('Error opening URL:', err));
  };

  return (
    <View style={styles.container}>
      {links.map((item, index) => (
        <Pressable
          key={index}
          style={({ pressed }) => [
            styles.card,
            pressed && { opacity: 0.9 },
          ]}
          onPress={() => handlePress(item.url)}
        >
          <View style={styles.cardContent}>
            <Icon name={item.icon} size={26} color="#4caf50" style={styles.icon} />
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    color: '#222',
    flexShrink: 1,
  },
});

export default UsefulLinksScreen;
