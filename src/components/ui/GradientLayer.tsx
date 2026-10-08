import React, { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg from 'react-native-svg';

/**
 * Calque SVG qui couvre exactement son parent, marges intérieures comprises.
 * (Un `<Svg width="100%">` se dimensionne sur la zone de contenu du parent, sans son padding :
 * le dégradé serait trop petit et décalé en haut à gauche.)
 */
export function GradientLayer({ children }: { children: React.ReactNode }) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!size || size.width !== width || size.height !== height) setSize({ width, height });
  };
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={onLayout}>
      {size ? (
        <Svg width={size.width} height={size.height}>
          {children}
        </Svg>
      ) : null}
    </View>
  );
}
