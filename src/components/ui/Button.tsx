import React from 'react';
import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import { radius, size, space, Text, useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  /** Un verbe à l'infinitif : « Actualiser », « Ajouter ». */
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: IconName;
  block?: boolean;
  loading?: boolean;
}

export function Button({ label, variant = 'primary', icon, block, loading, disabled, ...rest }: ButtonProps) {
  const { colors } = useTheme();
  const tint = variant === 'primary' ? 'onViolet' : variant === 'ghost' ? 'accent' : 'ink';
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      {...rest}
      style={({ pressed }) => ({
        height: size.input,
        alignSelf: block ? 'stretch' : 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[2],
        paddingHorizontal: space[6],
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: variant === 'secondary' ? colors.lineStrong : 'transparent',
        backgroundColor: variant === 'primary' ? colors.violet : variant === 'secondary' ? colors.glass : 'transparent',
        boxShadow: variant === 'primary' ? `inset 0 1px 0 ${colors.heroLine}` : undefined,
        opacity: disabled ? 0.45 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors[tint]} />
      ) : icon ? (
        <Icon name={icon} size={20} color={tint} />
      ) : null}
      <View>
        <Text variant="button-label" color={tint}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
