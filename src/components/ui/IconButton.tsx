import React from 'react';
import { Pressable, type PressableProps } from 'react-native';
import { radius, useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';

const SIZES = { sm: 28, md: 36, lg: 44 } as const;
const MIN_TARGET = 44;

export interface IconButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  icon: IconName;
  /** Nom accessible, obligatoire. */
  label: string;
  /** `outline` : rond, filet `line-strong` ; `glass` : carré arrondi translucide ; `violet` : aplat de marque. */
  variant?: 'outline' | 'glass' | 'violet';
  /** 28 / 36 / 44 px dessinés ; zone tactile toujours ≥ 44 px. */
  size?: keyof typeof SIZES;
}

export function IconButton({ icon, label, variant = 'outline', size = 'md', disabled, ...rest }: IconButtonProps) {
  const { colors } = useTheme();
  const side = SIZES[size];
  const slop = Math.max(0, (MIN_TARGET - side) / 2);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={slop}
      disabled={disabled}
      {...rest}
      style={({ pressed }) => ({
        width: side,
        height: side,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: variant === 'glass' ? radius.md : radius.full,
        borderColor: variant === 'violet' ? colors.violet : colors.lineStrong,
        backgroundColor: variant === 'violet' ? colors.violet : variant === 'glass' ? colors.glass : 'transparent',
        opacity: disabled ? 0.4 : 1,
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : 20} color={variant === 'violet' ? 'onViolet' : 'ink'} />
    </Pressable>
  );
}
