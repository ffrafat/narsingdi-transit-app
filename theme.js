// theme.js
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const lightBrandColors = {
  primary: '#4caf50',
  onPrimary: '#ffffff',
  primaryContainer: '#c8e6c9',
  onPrimaryContainer: '#002106',
  secondary: '#55634e',
  onSecondary: '#ffffff',
  secondaryContainer: '#d8e8cb',
  onSecondaryContainer: '#131f0f',
  tertiary: '#38656a',
  onTertiary: '#ffffff',
  tertiaryContainer: '#bcebf0',
  onTertiaryContainer: '#002022',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',
  background: '#f7fbf1',
  onBackground: '#191d17',
  surface: '#f7fbf1',
  onSurface: '#191d17',
  surfaceVariant: '#dee5d8',
  onSurfaceVariant: '#42493f',
  outline: '#72796f',
  outlineVariant: '#c2c9bc',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#2e322b',
  inverseOnSurface: '#f0f1e8',
  inversePrimary: '#81c784',
  elevation: {
    level0: 'transparent',
    level1: '#f0f5ea',
    level2: '#ebf1e4',
    level3: '#e5eede',
    level4: '#e3ecdb',
    level5: '#dee9d6',
  },
  surfaceDisabled: 'rgba(25, 29, 23, 0.12)',
  onSurfaceDisabled: 'rgba(25, 29, 23, 0.38)',
  backdrop: 'rgba(66, 73, 63, 0.4)',
};

const darkBrandColors = {
  primary: '#81c784',
  onPrimary: '#00390f',
  primaryContainer: '#00531a',
  onPrimaryContainer: '#9cf49f',
  secondary: '#bcccaf',
  onSecondary: '#273423',
  secondaryContainer: '#3e4a38',
  onSecondaryContainer: '#d8e8cb',
  tertiary: '#a0cfd4',
  onTertiary: '#00363b',
  tertiaryContainer: '#1e4d52',
  onTertiaryContainer: '#bcebf0',
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',
  background: '#11140e',
  onBackground: '#e1e3db',
  surface: '#11140e',
  onSurface: '#e1e3db',
  surfaceVariant: '#42493f',
  onSurfaceVariant: '#c2c9bc',
  outline: '#8c9388',
  outlineVariant: '#42493f',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#e1e3db',
  inverseOnSurface: '#191d17',
  inversePrimary: '#4caf50',
  elevation: {
    level0: 'transparent',
    level1: '#191d17',
    level2: '#1e221b',
    level3: '#23271f',
    level4: '#252920',
    level5: '#282d23',
  },
  surfaceDisabled: 'rgba(225, 227, 219, 0.12)',
  onSurfaceDisabled: 'rgba(225, 227, 219, 0.38)',
  backdrop: 'rgba(66, 73, 63, 0.4)',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightBrandColors,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: 'AnekBangla_400Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'AnekBangla_500Medium',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'AnekBangla_700Bold',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'AnekBangla_800ExtraBold',
      fontWeight: '800',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkBrandColors,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    regular: {
      fontFamily: 'AnekBangla_400Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'AnekBangla_500Medium',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'AnekBangla_700Bold',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'AnekBangla_800ExtraBold',
      fontWeight: '800',
    },
  },
};

