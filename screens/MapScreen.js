import { View, StyleSheet, ScrollView, Linking, ImageBackground, Text as RNText, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const stations = [
  { name: 'ভৈরব', mapUrl: 'https://maps.app.goo.gl/VtrF4pZNouEjXxNq5' },
  { name: 'দৌলতকান্দি', mapUrl: 'https://maps.app.goo.gl/bZhhDN3uCNr9Vjc96' },
  { name: 'শ্রীনিধি', mapUrl: 'https://maps.app.goo.gl/8SpgP6FeVBXwdQhE9' },
  { name: 'মেথিকান্দা', mapUrl: 'https://maps.app.goo.gl/rkwX8jNLXM4X1sxS6' },
  { name: 'হাঁটুভাঙ্গা', mapUrl: 'https://maps.app.goo.gl/psDsbn8kq4A1wD9K9' },
  { name: 'খানাবাড়ী', mapUrl: 'https://maps.app.goo.gl/uUqtANxtPHGPJVFz8' },
  { name: 'আমীরগঞ্জ', mapUrl: 'https://maps.app.goo.gl/x8SyBMFud1dX2XVT8' },
  { name: 'নরসিংদী', mapUrl: 'https://maps.app.goo.gl/rAFXRWJdat5jgMw88' },
  { name: 'জিনারদী', mapUrl: 'https://maps.app.goo.gl/NzWCGarJoBkWcrKRA' },
  { name: 'ঘোড়াশাল', mapUrl: 'https://maps.app.goo.gl/skdUg3ZNxNpWSBud6' },
  { name: 'আড়িখোলা', mapUrl: 'https://maps.app.goo.gl/u8j3jgAFXSn2b1S67' },
  { name: 'পূবাইল', mapUrl: 'https://maps.app.goo.gl/eJLYEcaJUiWBQsvf8' },
  { name: 'টঙ্গী', mapUrl: 'https://maps.app.goo.gl/xfp9SuNM7UTdc8Yd9' },
  { name: 'বিমানবন্দর', mapUrl: 'https://maps.app.goo.gl/f8nuZu5gjd65ytU69' },
  { name: 'ক্যান্টনমেন্ট', mapUrl: 'https://maps.app.goo.gl/wAVDamtjAcvZ65MA8' },
  { name: 'তেজগাঁও', mapUrl: 'https://maps.app.goo.gl/Lq9ocMoAcywR2z4KA' },
  { name: 'ঢাকা', mapUrl: 'https://maps.app.goo.gl/199jR4HkTmhb4TXX6' },
];

const MapScreen = () => {
  const { heroTheme } = useAppTheme();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const styles = getStyles(theme, insets);

  const openMap = (url) => {
    Linking.openURL(url).catch((err) => console.warn('Cannot open map:', err));
  };

  const HeaderContent = () => (
    <View style={styles.headerTitleWrapper}>
      {/* Title is handled by navigation header */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <View style={styles.headerGradientContainer}>
          {heroTheme.image ? (
            <ImageBackground
              source={heroTheme.image}
              style={styles.headerBackgroundImage}
              resizeMode="cover"
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'transparent']}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={heroTheme.colors}
                style={[styles.headerGradient, { backgroundColor: 'transparent' }]}
                opacity={0.85}
              >
                <HeaderContent />
              </LinearGradient>
            </ImageBackground>
          ) : (
            <LinearGradient
              colors={heroTheme.colors}
              style={styles.headerGradient}
            >
              <HeaderContent />
            </LinearGradient>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stations.map((station, index) => (
          <View
            key={index}
            style={styles.timelineItem}
          >
            <View style={styles.timelineLeft}>
              <View style={[styles.dot, index === 0 && styles.firstDot, index === stations.length - 1 && styles.lastDot]} />
              {index !== stations.length - 1 && <View style={styles.line} />}
            </View>

            <Surface style={styles.stationCard} elevation={1}>
              <View style={styles.cardContent}>
                <View style={styles.stationInfo}>
                  <View style={styles.markerContainer}>
                    <Icon name="train" size={20} color={theme.colors.primary} />
                  </View>
                  <Text style={styles.stationName}>{station.name}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => openMap(station.mapUrl)}
                  style={styles.mapIconButton}
                >
                  <Icon name="directions" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Surface>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const getStyles = (theme, insets) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerWrapper: {
    backgroundColor: 'transparent',
  },
  headerGradientContainer: {
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#075d37', // Fallback base color
  },
  headerBackgroundImage: {
    width: '100%',
  },
  headerGradient: {
    paddingTop: insets.top + 40, // Reduced from 50
    paddingBottom: 15, // Reduced from 25
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrapper: {
    height: 30, // Maintains structure without visible content
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 40,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.outlineVariant,
    zIndex: 2,
    marginTop: 22,
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  firstDot: {
    backgroundColor: theme.colors.primary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  lastDot: {
    backgroundColor: theme.colors.secondary,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  line: {
    position: 'absolute',
    top: 22,
    bottom: -22,
    width: 2,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
  },
  stationCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    marginBottom: 16,
    borderRadius: 20, // Unified borderRadius
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 0, // Removed border
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(65, 171, 93, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stationName: {
    fontSize: 18,
    fontFamily: 'AnekBangla_800ExtraBold',
    color: theme.colors.onSurface,
    flexShrink: 1,
  },
  mapIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default MapScreen;
