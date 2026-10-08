import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { FLAGS } from '../../assets/flags';
import { size as sizes, useTheme } from '../../theme';

export interface FlagProps {
  /** Code pays circle-flags ("ci", "eu"…). */
  country: string;
  /** Diamètre. Défaut 36 (`size-flag`). */
  size?: number;
  /** Atténué (ligne désactivée). */
  dimmed?: boolean;
}

/** Drapeau rond avec un filet `line`, pour que les drapeaux clairs ne se fondent pas dans le fond. */
export function Flag({ country, size = sizes.flag, dimmed }: FlagProps) {
  const { colors } = useTheme();
  const xml = FLAGS[country];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        opacity: dimmed ? 0.45 : 1,
        backgroundColor: colors.line,
        boxShadow: `0 0 0 1px ${colors.line}`,
      }}
    >
      {xml ? <SvgXml xml={xml} width={size} height={size} /> : null}
    </View>
  );
}
