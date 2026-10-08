import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { typeStyles, type ColorName, type TypeStyleName } from './tokens';
import { useTheme } from './ThemeProvider';

export interface TextProps extends RNTextProps {
  /** Style typographique du design system. Défaut : `text-body`. */
  variant?: TypeStyleName;
  /** Couleur de la palette courante. Défaut : `ink`. */
  color?: ColorName;
}

/** Montants, clavier et labels courts : agrandissement limité pour garder la mise en page. */
const FONT_SCALE_LIMIT: Partial<Record<TypeStyleName, number>> = {
  'amount-xl': 1.1,
  'amount-lg': 1.1,
  'amount-md': 1.3,
  'keypad-digit': 1.2,
  lockup: 1.2,
  'button-label': 1.4,
  'currency-label': 1.4,
  'text-caption': 1.5,
};

/** Seul point d'entrée typographique de l'app. */
export function Text({ variant = 'text-body', color = 'ink', style, ...rest }: TextProps) {
  const { colors } = useTheme();
  return (
    <RNText
      maxFontSizeMultiplier={FONT_SCALE_LIMIT[variant] ?? 2}
      {...rest}
      style={[typeStyles[variant] as object, { color: colors[color] }, style]}
    />
  );
}
