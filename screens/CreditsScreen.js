import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CreditsScreen = () => {
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.header}>
        <Icon name="information-outline" size={28} color="#4caf50" />
        <Text style={styles.headerText}>তথ্যসূত্র ও কৃতজ্ঞতা</Text>
      </View>

      <Text style={styles.description}>
        <Text style={styles.bold}>নরসিংদী ট্রানজিট</Text> অ্যাপের ডেটাবেজ সংগ্রহ, যাচাই ও প্রকাশে অনেকের সাহায্য ও উৎসাহ ছিল। 
      </Text>

      <Divider style={styles.divider} />

      <View style={styles.header}>
        <Icon name="database" size={26} color="#4caf50" />
        <Text style={styles.headerText}>তথ্য ও ডেটাবেজ</Text>
      </View>

<View style={styles.itemRow}>
  <Icon name="google-spreadsheet" size={22} color="#4caf50" />
  <Text
    style={styles.linkText}
    onPress={() => openLink('https://github.com/benborgers/opensheet#readme')}
  >
    ডেটাবেজ হোস্টিং: Opensheet (by Ben Borgers)
  </Text>
</View>


      <View style={styles.itemRow}>
        <Icon name="train-car" size={22} color="#4caf50" />
        <Text style={styles.itemText}>
          মূল ট্রেন সময়সূচি: বাংলাদেশ রেলওয়ে
        </Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.header}>
        <Icon name="account-group-outline" size={26} color="#4caf50" />
        <Text style={styles.headerText}>সামাজিক সহায়তা</Text>
      </View>

      <View style={styles.itemRow}>
        <Icon name="facebook" size={22} color="#4caf50" />
        <Text style={styles.linkText} onPress={() => openLink('https://www.facebook.com/groups/nrc.nrpc/')}>
          নরসিংদী রেলওয়ে প্যাসেঞ্জার কম্যুনিটি
        </Text>
      </View>

      <View style={styles.itemRow}>
        <Icon name="account-tie" size={22} color="#4caf50" />
        <Text style={styles.itemText}>
          গ্রুপ অ্যাডমিন ও সদস্যদের অসংখ্য ধন্যবাদ ডেটা সংগ্রহ ও যাচাইয়ে সহায়তা করার জন্য।
        </Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
    color: '#2e7d32',
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#ccc',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#444',
    flex: 1,
  },
  linkText: {
    fontSize: 15,
    marginLeft: 10,
    color: '#4caf50',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});

export default CreditsScreen;
