import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { Defs, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { GradientLayer } from './GradientLayer';
import { radius, space, useTheme } from '../../theme';

export interface SheetProps extends ViewProps {
  /** Affiche la poignée. Défaut true. */
  handle?: boolean;
  /** Fond dégradé en bas du contenu qui défile. */
  fade?: boolean;
}

/**
 * Feuille sur `sheet` avec son halo `sheet-glow`, coins hauts `radius-xl` et poignée.
 * Le contenu (liste qui défile) est passé en enfant et doit prendre `flex: 1`.
 */
export function Sheet({ handle = true, fade, style, children, ...rest }: SheetProps) {
  const { colors } = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          flex: 1,
          overflow: 'hidden',
          paddingTop: space[3],
          borderTopLeftRadius: radius.xl,
          borderTopRightRadius: radius.xl,
          backgroundColor: colors.sheet,
          boxShadow: `inset 0 1px 0 ${colors.line}`,
        },
        style,
      ]}
    >
      <GradientLayer>
        <>
          <Defs>
            <RadialGradient id="glow" cx="0.35" cy="0.62" rx="0.9" ry="0.55" fx="0.35" fy="0.62">
              <Stop offset="0" stopColor={colors.sheetGlow} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.sheetGlow} stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#glow)" />
        </>
      </GradientLayer>
      {handle && (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: 64, height: 4, alignSelf: 'center', borderRadius: radius.full, backgroundColor: colors.inkFaint }}
        />
      )}
      {children}
      {fade && (
        <View style={styles.fade} pointerEvents="none">
          <GradientLayer>
            <>
              <Defs>
                <LinearGradient id="sheetFade" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={colors.sheet} stopOpacity="0" />
                  <Stop offset="1" stopColor={colors.sheet} stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#sheetFade)" />
            </>
          </GradientLayer>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 },
});
