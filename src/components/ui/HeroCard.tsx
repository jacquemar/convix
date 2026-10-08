import React from 'react';
import { View, type ViewProps } from 'react-native';
import { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { HeroScope, radius, space, useTheme } from '../../theme';
import { GradientLayer } from './GradientLayer';

export interface HeroCardProps extends ViewProps {
  /** Le hero touche le haut de l'écran : seuls les coins bas sont arrondis. */
  flushTop?: boolean;
  /** Sans ombre ni coins (hero d'en-tête posé sur `hero-base`). */
  flat?: boolean;
}

/**
 * Surface sombre de marque : `hero-base` + halo prune en haut à droite et indigo en bas.
 * Les halos sont dessinés en SVG pour un rendu identique sur iOS et Android.
 * Les enfants lisent les tokens remappés pour le hero (`HeroScope`).
 */
export function HeroCard({ flushTop, flat, style, children, ...rest }: HeroCardProps) {
  const { colors, shadows } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          overflow: 'hidden',
          padding: space[6],
          backgroundColor: colors.heroBase,
          borderRadius: flat ? 0 : radius.xl,
          borderTopLeftRadius: flushTop || flat ? 0 : radius.xl,
          borderTopRightRadius: flushTop || flat ? 0 : radius.xl,
          boxShadow: flat ? undefined : `${shadows.shadowCard}, inset 0 0 0 1px ${colors.heroLine}`,
        },
        style,
      ]}
    >
      <GradientLayer>
        <>
          <Defs>
            <RadialGradient id="plum" cx="0.94" cy="0.02" rx="0.58" ry="0.46" fx="0.94" fy="0.02">
              <Stop offset="0" stopColor={colors.heroGlowPlum} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.heroGlowPlum} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="indigo" cx="0.7" cy="1.04" rx="0.75" ry="0.52" fx="0.7" fy="1.04">
              <Stop offset="0" stopColor={colors.heroGlowIndigo} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.heroGlowIndigo} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#plum)" />
          <Rect width="100%" height="100%" fill="url(#indigo)" />
        </>
      </GradientLayer>
      <HeroScope>{children}</HeroScope>
    </View>
  );
}
