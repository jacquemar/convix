import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { radius, size, space, typeStyles, useTheme } from '../../theme';
import { fr } from '../../i18n/fr';
import { Icon } from './Icon';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Placeholder et nom accessible. */
  label?: string;
}

/** Champ de recherche « verre » de 52 px, avec bouton d'effacement. */
export function SearchField({ value, onChange, label = fr.currencies.search }: SearchFieldProps) {
  const { colors, shadows } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View
      style={{
        height: size.input,
        flexDirection: 'row',
        alignItems: 'center',
        gap: space[2],
        paddingLeft: space[4],
        paddingRight: space[2],
        borderWidth: 1,
        borderColor: focused ? colors.focus : colors.lineStrong,
        borderRadius: radius.sm,
        backgroundColor: colors.glass,
        boxShadow: focused ? shadows.focusRing : undefined,
      }}
    >
      <Icon name="search" size={20} color="inkMuted" />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={label}
        placeholderTextColor={colors.inkMuted}
        accessibilityLabel={label}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxFontSizeMultiplier={1.6}
        style={[typeStyles['text-body'] as object, { flex: 1, minWidth: 0, height: '100%', padding: 0, color: colors.ink }]}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={fr.currencies.clearSearch}
          onPress={() => onChange('')}
          hitSlop={2}
          style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm }}
        >
          <Icon name="close" size={20} />
        </Pressable>
      ) : null}
    </View>
  );
}
