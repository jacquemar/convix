import React from 'react';
import { SvgXml } from 'react-native-svg';
import { ICONS, type IconName } from '../../assets/icons';
import { useTheme, type ColorName } from '../../theme';

export type { IconName };

export interface IconProps {
  name: IconName;
  /** 26 dans la tab bar, 20 dans les contrôles, 14 dans les chips. Défaut 24. */
  size?: number;
  color?: ColorName;
  /** Nom accessible ; absent = icône décorative. */
  label?: string;
}

/** Jeu d'icônes Convix : grille 24px, trait 1.75, extrémités rondes. */
export function Icon({ name, size = 24, color = 'ink', label }: IconProps) {
  const { colors } = useTheme();
  const tint = colors[color];
  const xml =
    `<svg viewBox="0 0 24 24" fill="none" stroke="${tint}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">` +
    ICONS[name].replace(/currentColor/g, tint) +
    '</svg>';
  return (
    <SvgXml
      xml={xml}
      width={size}
      height={size}
      accessible={!!label}
      accessibilityLabel={label}
      accessibilityElementsHidden={!label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    />
  );
}
