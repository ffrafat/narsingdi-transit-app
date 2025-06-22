import React from 'react';
import { View, StyleSheet, Image, Linking, ScrollView } from 'react-native';
import { Text, Card, Divider, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const openLink = async (url) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) await Linking.openURL(url);
};

const CreditScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>

          <View style={styles.profileContainer}>
            <Image
              source={require('../assets/dev.png')}
              style={styles.profilePic}
            />
            <Text style={styles.name}>ফয়সাল ফারুকী রাফাত</Text>
            <Text style={styles.role}>অ্যাপ ডেভেলপার</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.itemRow}>
            <Icon name="web" size={22} color="#4caf50" />
            <Text style={styles.linkText} onPress={() => openLink('https://rafat.cc')}>rafat.cc</Text>
          </View>

          <View style={styles.itemRow}>
            <Icon name="facebook" size={22} color="#4caf50" />
            <Text style={styles.linkText} onPress={() => openLink('https://facebook.com/fslfrqrft')}>
              fb.com/fslfrqrft
            </Text>
          </View>

          <View style={styles.itemRow}>
            <Icon name="whatsapp" size={22} color="#4caf50" />
            <Text style={styles.linkText} onPress={() => openLink('https://wa.me/8801734512161')}>
              +880 1734 512161
            </Text>
          </View>

        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.description}>
আমরা এই অ্যাপটিকে বিজ্ঞাপনমুক্ত এবং সবার জন্য বিনামূল্যে রেখেছি। আপনার যদি এটি কার্যকর মনে হয় এবং আপনি আমাদের এই প্রচেষ্টাকে সমর্থন করতে চান, তাহলে আপনার ইচ্ছামতো ডোনেশন দিয়ে সাহায্য করতে পারেন।
          </Text>
<Button
  icon="currency-bdt"
  mode="contained"

  style={styles.donateButton}
  contentStyle={{ flexDirection: 'row' }}
  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
>
  বিকাশ সেন্ড মানি: 01734512161
</Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#4caf50',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#888',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#ccc',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#4caf50',
    textDecorationLine: 'underline',
    marginLeft: 8,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'justify',
  },
  boldCenter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: 8,
  },
    donateButton: {
  marginTop: 10,
  backgroundColor: '#4caf50',
  borderRadius: 6,
},
});

export default CreditScreen;
