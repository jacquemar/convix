/**
 * GÉNÉRÉ par design-system/tools/build_rn_theme.py depuis design-system/tokens.json.
 * Ne pas éditer à la main : modifier le design system puis lancer `npm run tokens`.
 */

export const themeNames = ['night', 'day'] as const;
export type ThemeName = (typeof themeNames)[number];

export const colors = {
  night: {
    canvas: '#0e0a1a',
    sheet: '#221a40',
    sheetGlow: '#2c2474',
    ink: '#f6f3ff',
    inkMuted: '#b9aedb',
    inkFaint: '#7f76a6',
    line: '#ffffff1f',
    lineStrong: '#7a71ad',
    glass: '#ffffff12',
    heroBase: '#17132a',
    heroGlowPlum: '#6b2590',
    heroGlowIndigo: '#3a2399',
    onHero: '#ffffff',
    onHeroMuted: '#c9bee8',
    heroLine: '#ffffff24',
    heroControlLine: '#8a82bd',
    panel: '#ffffff',
    panelInk: '#1a1428',
    panelMuted: '#6e6789',
    panelLine: '#ece8f4',
    panelPressed: '#f1ecfc',
    violet: '#7a45f0',
    orchid: '#c25ae8',
    lilac: '#c4a6ff',
    onViolet: '#ffffff',
    accent: '#c4a6ff',
    focus: '#9b5cff',
    rise: '#5ee0c8',
    fall: '#ffb36b',
    riseHero: '#5ee0c8',
    fallHero: '#ffb36b',
  },
  day: {
    canvas: '#f1ecfb',
    sheet: '#ffffff',
    sheetGlow: '#ebe4fb',
    ink: '#19122e',
    inkMuted: '#5d5381',
    inkFaint: '#9a93b4',
    line: '#19122e1a',
    lineStrong: '#8a82a8',
    glass: '#19122e0d',
    heroBase: '#17132a',
    heroGlowPlum: '#6b2590',
    heroGlowIndigo: '#3a2399',
    onHero: '#ffffff',
    onHeroMuted: '#c9bee8',
    heroLine: '#ffffff24',
    heroControlLine: '#8a82bd',
    panel: '#ffffff',
    panelInk: '#1a1428',
    panelMuted: '#6e6789',
    panelLine: '#ece8f4',
    panelPressed: '#f1ecfc',
    violet: '#7a45f0',
    orchid: '#c25ae8',
    lilac: '#c4a6ff',
    onViolet: '#ffffff',
    accent: '#7a45f0',
    focus: '#9b5cff',
    rise: '#0b7363',
    fall: '#a54a00',
    riseHero: '#5ee0c8',
    fallHero: '#ffb36b',
  },
} as const;
export type ColorName = keyof (typeof colors)['night'];

/** Fichiers de police à charger (noms exportés par @expo-google-fonts). */
export const fontFiles = ['Manrope_500Medium', 'Manrope_600SemiBold', 'Manrope_700Bold', 'Unbounded_400Regular', 'Unbounded_500Medium', 'Unbounded_600SemiBold'] as const;

export const typeStyles = {
  "amount-xl": {
    fontFamily: 'Unbounded_500Medium',
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -1.68,
    fontVariant: ['tabular-nums'],
  },
  "amount-lg": {
    fontFamily: 'Unbounded_500Medium',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
  "amount-md": {
    fontFamily: 'Unbounded_500Medium',
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.48,
    fontVariant: ['tabular-nums'],
  },
  "keypad-digit": {
    fontFamily: 'Unbounded_400Regular',
    fontSize: 24,
    lineHeight: 28,
    fontVariant: ['tabular-nums'],
  },
  lockup: {
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 15,
    lineHeight: 16,
    letterSpacing: 0.15,
    textTransform: 'uppercase',
  },
  "sheet-title": {
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.16,
    textTransform: 'uppercase',
  },
  "currency-label": {
    fontFamily: 'Unbounded_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    textTransform: 'uppercase',
  },
  "button-label": {
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.52,
    textTransform: 'uppercase',
  },
  "text-body": {
    fontFamily: 'Manrope_500Medium',
    fontSize: 15,
    lineHeight: 22,
  },
  "text-strong": {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
    lineHeight: 22,
    fontVariant: ['tabular-nums'],
  },
  "text-caption": {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontVariant: ['tabular-nums'],
  },
} as const;
export type TypeStyleName = keyof typeof typeStyles;

export const space = {
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "6": 24,
  "8": 32,
  "12": 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 28,
  xl: 40,
  full: 9999,
} as const;

export const size = {
  icon: 24,
  flag: 36,
  control: 36,
  avatar: 40,
  input: 52,
  key: 74,
  fab: 52,
  tabbar: 84,
} as const;

export const blur = {
  glass: 18,
} as const;

/** Valeurs `boxShadow` React Native, par thème. */
export const shadows = {
  night: {
    shadowPanel: '0 -12px 40px #0e0a1a66',
    shadowCard: '0 24px 60px #00000080',
    glowFab: '0 10px 28px #9b5cff8c, 0 0 0 1px #ffffff33 inset',
    focusRing: '0 0 0 3px #9b5cff',
  },
  day: {
    shadowPanel: '0 -8px 32px #3a239914',
    shadowCard: '0 18px 48px #3a23992e',
    glowFab: '0 10px 28px #9b5cff8c, 0 0 0 1px #ffffff33 inset',
    focusRing: '0 0 0 3px #9b5cff',
  },
} as const;

/** Durées (ms) et courbe du README, section « Mouvement ». */
export const motion = {
  press: 120,
  select: 200,
  swap: 320,
  caretBlink: 1100,
} as const;
export const motionEasing = [0.2, 0.8, 0.2, 1] as const;
