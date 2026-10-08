import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppFonts, useTheme } from './src/theme';
import { RootTabs } from './src/navigation/RootTabs';

// Le splash reste affiché jusqu'au chargement des polices (pas de saut de typographie).
SplashScreen.preventAutoHideAsync().catch(() => undefined);

function Root() {
  const { colors } = useTheme();
  const navigationTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.heroBase, card: colors.panel, text: colors.ink, primary: colors.violet },
  };
  return (
    <NavigationContainer theme={navigationTheme}>
      <RootTabs />
    </NavigationContainer>
  );
}

export default function App() {
  const fontsReady = useAppFonts();

  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsReady]);

  if (!fontsReady) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
