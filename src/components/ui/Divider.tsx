import React from 'react';
import { View } from 'react-native';
import { space, useTheme } from '../../theme';

/** Filet `line` entre deux groupes. Décoratif. */
export function Divider({ spacing = space[6] }: { spacing?: number }) {
  const { colors } = useTheme();
  return <View style={{ height: 1, marginVertical: spacing, backgroundColor: colors.line }} />;
}
