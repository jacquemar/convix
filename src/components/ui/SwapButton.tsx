import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { easing, radius, size, useMotion, useTheme } from '../../theme';
import { fr } from '../../i18n/fr';
import { Icon } from './Icon';

/** Carré « verre » qui inverse la paire ; les flèches font un demi-tour à chaque appui. */
export function SwapButton({ onSwap, label = fr.converter.swap }: { onSwap?: () => void; label?: string }) {
  const { colors } = useTheme();
  const { swap: duration } = useMotion();
  const turns = useRef(0);
  const rotation = useRef(new Animated.Value(0)).current;

  const press = () => {
    turns.current += 1;
    Animated.timing(rotation, { toValue: turns.current, duration, easing, useNativeDriver: true }).start();
    onSwap?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      onPress={press}
      style={({ pressed }) => ({
        width: size.control,
        height: size.control,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.lineStrong,
        borderRadius: radius.md,
        backgroundColor: colors.glass,
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      <Animated.View
        style={{ transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] }}
      >
        <Icon name="swap" size={20} />
      </Animated.View>
    </Pressable>
  );
}
