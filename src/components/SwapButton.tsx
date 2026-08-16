import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useColorScheme } from 'react-native';

interface SwapButtonProps {
  onPress: () => void;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark' | null;
}

export const SwapButton: React.FC<SwapButtonProps> = ({
  onPress,
  disabled = false,
  colorScheme = 'light',
}) => {
  const isDark = colorScheme === 'dark';
  const [rotateAnim] = React.useState(new Animated.Value(0));
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const spin = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!disabled) {
      spin();
      // Haptic feedback si disponible
      if (Platform.OS === 'ios') {
        // iOS haptic
      }
      onPress();
    }
  };

  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ rotate: rotateInterpolation }],
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: disabled 
                ? (isDark ? '#444' : '#ddd') 
                : '#007AFF',
            },
          ]}
        >
          <Text style={styles.icon}>⇅</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    alignItems: 'center',
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});