import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createTabBar } from '../components/ui';
import { ConverterScreen } from '../screens/ConverterScreen';
import { CurrenciesScreen } from '../screens/CurrenciesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { fr } from '../i18n/fr';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

/** Trois destinations (décision D1) : Devises · Convertir (FAB central) · Réglages. */
const TabBar = createTabBar({
  Currencies: { icon: 'globe' },
  Convert: { icon: 'keypad', primary: true },
  Settings: { icon: 'settings' },
});

export function RootTabs() {
  return (
    <Tab.Navigator initialRouteName="Convert" tabBar={TabBar} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Currencies" component={CurrenciesScreen} options={{ title: fr.tabs.currencies }} />
      <Tab.Screen name="Convert" component={ConverterScreen} options={{ title: fr.tabs.convert }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: fr.tabs.settings }} />
    </Tab.Navigator>
  );
}
