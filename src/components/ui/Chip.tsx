import React from 'react';
import { View } from 'react-native';
import { radius, space, Text, type ColorName, useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';

export interface ChipProps {
  label: string;
  icon?: IconName;
  color?: ColorName;
}

/** Pastille d'état translucide (ex. « Hors connexion » dans l'en-tête). */
export function Chip({ label, icon, color = 'ink' }: ChipProps) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={label}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[1],
        minHeight: 28,
        paddingHorizontal: space[3],
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: colors.glass,
      }}
    >
      {icon && <Icon name={icon} size={14} color={color} />}
      <Text variant="text-caption" color={color}>
        {label}
      </Text>
    </View>
  );
}
