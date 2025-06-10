// theme.js
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4caf50', // your green
    secondary: '#81c784',
    onPrimary: '#ffffff',
  },
};
