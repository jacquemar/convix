import React from 'react';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { MARK_PATH } from '../../assets/icons';
import { colors, size as sizes } from '../../theme';

export interface AppIconProps {
  /** Côté en px. Défaut 40 (`size-avatar`). */
  size?: number;
  /** `brand` : tuile violet → orchidée, marque blanche ; `dark` : tuile hero, marque en dégradé. */
  variant?: 'brand' | 'dark';
  /** Nom accessible ; vide quand le nom est écrit à côté. */
  label?: string;
}

/** Icône d'app : le « C fendu » sur une tuile arrondie (rayon 230/1024 comme l'icône 1024). */
export function AppIcon({ size = sizes.avatar, variant = 'brand', label = '' }: AppIconProps) {
  const c = colors.night;
  const radius = (size * 230) / 1024;
  const scale = (size * 0.62) / 64;
  const offset = (size - 64 * scale) / 2;
  const id = `cvx-${variant}`;
  return (
    <Svg width={size} height={size} accessible={!!label} accessibilityLabel={label || undefined}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#9367ff" />
          <Stop offset="0.5" stopColor={c.violet} />
          <Stop offset="1" stopColor={c.orchid} />
        </LinearGradient>
      </Defs>
      <Rect width={size} height={size} rx={radius} fill={variant === 'brand' ? `url(#${id})` : c.heroBase} />
      <Path
        d={MARK_PATH}
        fill={variant === 'brand' ? c.onViolet : `url(#${id})`}
        transform={`translate(${offset} ${offset}) scale(${scale})`}
      />
    </Svg>
  );
}
