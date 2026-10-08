import React from 'react';
import { StatusBar, type StatusBarStyle } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';

/** Barre d'état de l'écran visible uniquement (les onglets restent montés en arrière-plan). */
export function FocusStatusBar({ style }: { style: StatusBarStyle }) {
  return useIsFocused() ? <StatusBar style={style} /> : null;
}
