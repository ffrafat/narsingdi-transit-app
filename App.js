import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as React from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import MainNavigator from './navigation/MainNavigator';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50', // green accent
    secondary: '#81C784',
    onPrimary: '#ffffff', // text/icons on primary background
    background: '#ffffff', // optional: ensure clean white bg
    surface: '#f5f5f5',    // optional: soft gray surfaces
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <MainNavigator />
    </PaperProvider>
  );
}
