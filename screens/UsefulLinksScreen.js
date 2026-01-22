import React from 'react';
import { View, StyleSheet, Pressable, Linking, ScrollView } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const links = [
  {
    title: 'নরসিংদী রেলওয়ে প্যাসেঞ্জারস কম্যুনিটি',
    subtitle: 'ফেসবুক গ্রুপ (Facebook)',
    icon: 'facebook',
    url: 'https://www.facebook.com/groups/315866319072545',
  },
  {
    title: 'নরসিংদী ট্রানজিট অ্যাপ চ্যাট গ্রুপ',
    subtitle: 'মেসেঞ্জার কমিউনিটি (Messenger)',
    icon: 'facebook-messenger',
    url: 'https://m.me/ch/AbZHGHvKxV-t7BW1/?send_source=cm%3Acopy_invite_link',
  },
  {
    title: 'পূর্বাঞ্চল ট্রেনের সময়সূচি',
    subtitle: 'বাংলাদেশ রেলওয়ে নোটিশ বোর্ড',
    icon: 'calendar-clock-outline',
    url: 'https://railway.portal.gov.bd/site/page/988258c9-5f11-4719-91e2-fbc898d4c2a9/-%E0%A6%AA%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%B2%E0%A7%87%E0%A6%B0-%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A8%E0%A7%87%E0%A6%B0-%E0%A6%B8%E0%A6%AE%E0%A7%9F%E0%A6%B8%E0%A7%82%E0%A6%9A%E0%A6%BF',
  },
  {
    title: 'পূর্বাঞ্চল ট্রেনের ভাড়ার তালিকা',
    subtitle: 'বাংলাদেশ রেলওয়ে ওয়েবসাইট',
    icon: 'currency-bdt',
    url: 'https://railway.portal.gov.bd/site/files/e290cbe6-88c6-445d-b7bd-28ee288f6a0a/%E0%A6%9F%E0%A6%BF%E0%A6%9F%E0%A6%BF%E0%A6%9F%E0%A7%87%E0%A6%B0-%E0%A6%AE%E0%A7%82%E0%A6%B2%E0%A7%8D%E0%A6%AF-%E0%A6%A4%E0%A6%BE%E0%A6%B2%E0%A6%BF%E0%A6%95%E0%A6%BE-(%E0%A6%AA%E0%A7%82%E0%A6%B0%E0%A7%8D%E0%A6%AC%E0%A6%BE%E0%A6%9E%E0%A7%8D%E0%A6%9A%E0%A6%B2)',
  },
];

const UsefulLinksScreen = () => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const handlePress = (url) => {
    Linking.openURL(url).catch((err) => console.warn('Error opening URL:', err));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>গুরুত্বপূর্ণ লিংকসমূহ</Text>
      {links.map((item, index) => (
        <Surface key={index} style={styles.card} elevation={1}>
          <Pressable
            style={({ pressed }) => [
              styles.pressable,
              pressed && { backgroundColor: theme.colors.surfaceVariant },
            ]}
            onPress={() => handlePress(item.url)}
          >
            <View style={styles.iconCircle}>
              <Icon name={item.icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={theme.colors.outline} />
          </Pressable>
        </Surface>
      ))}
    </ScrollView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
});

export default UsefulLinksScreen;
