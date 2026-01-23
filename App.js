import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { useColorScheme, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from './theme';
import MainNavigator from './navigation/MainNavigator';
import { ThemeProvider, useAppTheme } from './ThemeContext';
import { useFonts } from 'expo-font';

// Set default font for all Text components globally
if (Text.defaultProps == null) {
  Text.defaultProps = {};
}
Text.defaultProps.style = { fontFamily: 'AnekBangla_400Regular' };

function MainApp() {
  const { isDark } = useAppTheme();
  const finalTheme = isDark ? darkTheme : lightTheme;

  let [fontsLoaded, fontError] = useFonts({
    'AnekBangla_400Regular': require('./assets/fonts/AnekBangla-Regular.ttf'),
    'AnekBangla_500Medium': require('./assets/fonts/AnekBangla-Medium.ttf'),
    'AnekBangla_600SemiBold': require('./assets/fonts/AnekBangla-SemiBold.ttf'),
    'AnekBangla_700Bold': require('./assets/fonts/AnekBangla-Bold.ttf'),
    'AnekBangla_800ExtraBold': require('./assets/fonts/AnekBangla-ExtraBold.ttf'),
  });

  // Debug logging
  React.useEffect(() => {
    console.log('Fonts loaded:', fontsLoaded);
    if (fontError) {
      console.error('Font loading error:', fontError);
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <Text>লোড হচ্ছে...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={finalTheme}>
      <MainNavigator />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
