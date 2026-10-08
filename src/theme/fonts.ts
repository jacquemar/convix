import { useFonts } from 'expo-font';
// Imports par graisse : l'index des paquets embarquerait toutes les graisses (~3 Mo).
import { Unbounded_400Regular } from '@expo-google-fonts/unbounded/400Regular';
import { Unbounded_500Medium } from '@expo-google-fonts/unbounded/500Medium';
import { Unbounded_600SemiBold } from '@expo-google-fonts/unbounded/600SemiBold';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';

/** Charge uniquement les graisses utilisées par les styles typographiques (voir `fontFiles`). */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts({
    Unbounded_400Regular,
    Unbounded_500Medium,
    Unbounded_600SemiBold,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  // En cas d'échec, on affiche quand même l'app avec les polices système.
  return loaded || error != null;
}
