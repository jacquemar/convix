import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { colors, shadows, type ColorName, type ThemeName } from './tokens';
import {
  getHapticsEnabled,
  getThemePreference,
  setHapticsEnabled,
  setThemePreference,
  type ThemePreference,
} from '../storage/preferences';

export type Palette = Record<ColorName, string>;
export type Shadows = Record<keyof (typeof shadows)['night'], string>;

interface ThemeState {
  /** Thème effectivement affiché. */
  name: ThemeName;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (value: boolean) => void;
  shadows: Shadows;
}

const ThemeContext = createContext<ThemeState | null>(null);
const PaletteContext = createContext<Palette | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>(getThemePreference);
  const [haptics, setHapticsState] = useState<boolean>(getHapticsEnabled);

  const name: ThemeName = preference === 'system' ? (system === 'light' ? 'day' : 'night') : preference;

  const setPreference = useCallback((value: ThemePreference) => {
    setThemePreference(value);
    setPreferenceState(value);
  }, []);

  const setHaptics = useCallback((value: boolean) => {
    setHapticsEnabled(value);
    setHapticsState(value);
  }, []);

  const state = useMemo<ThemeState>(
    () => ({
      name,
      preference,
      setPreference,
      hapticsEnabled: haptics,
      setHapticsEnabled: setHaptics,
      shadows: shadows[name],
    }),
    [name, preference, setPreference, haptics, setHaptics],
  );

  return (
    <ThemeContext.Provider value={state}>
      <PaletteContext.Provider value={colors[name]}>{children}</PaletteContext.Provider>
    </ThemeContext.Provider>
  );
}

/** Thème courant + palette du contexte (remappée dans un hero ou un panneau). */
export function useTheme() {
  const theme = useContext(ThemeContext);
  const palette = useContext(PaletteContext);
  if (!theme || !palette) throw new Error('useTheme doit être utilisé sous <ThemeProvider>.');
  return { ...theme, colors: palette };
}

/**
 * Sur le hero, chaque token de thème pointe vers son équivalent hero
 * (équivalent de la classe `cvx-on-hero` du design system).
 */
export function HeroScope({ children }: { children: React.ReactNode }) {
  const parent = useContext(PaletteContext);
  const { name } = useTheme();
  const palette = useMemo<Palette>(() => {
    const base = colors[name];
    return {
      ...(parent ?? base),
      ink: base.onHero,
      inkMuted: base.onHeroMuted,
      line: base.heroLine,
      lineStrong: base.heroControlLine,
      accent: base.lilac,
      rise: base.riseHero,
      fall: base.fallHero,
    };
  }, [parent, name]);
  return <PaletteContext.Provider value={palette}>{children}</PaletteContext.Provider>;
}

/** Sur le panneau blanc (clavier, tab bar) — équivalent de `cvx-on-panel`. */
export function PanelScope({ children }: { children: React.ReactNode }) {
  const parent = useContext(PaletteContext);
  const { name } = useTheme();
  const palette = useMemo<Palette>(() => {
    const base = colors[name];
    return {
      ...(parent ?? base),
      ink: base.panelInk,
      inkMuted: base.panelMuted,
      line: base.panelLine,
      accent: base.violet,
      glass: base.panelPressed,
    };
  }, [parent, name]);
  return <PaletteContext.Provider value={palette}>{children}</PaletteContext.Provider>;
}
