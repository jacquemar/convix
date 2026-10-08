import React from 'react';
import { Pressable, View } from 'react-native';
import { space, Text } from '../../theme';
import type { Currency } from '../../types/currency';
import { fr } from '../../i18n/fr';
import { Flag } from './Flag';
import { Icon } from './Icon';
import { IconButton } from './IconButton';

export interface CurrencyItemProps {
  currency: Currency;
  /** Seconde ligne (Manrope) ; défaut : le code. */
  meta?: string;
  /** Bouton rond en fin de ligne. */
  action?: 'add' | 'remove' | 'none';
  onAction?: () => void;
  /** Toucher la ligne. */
  onPress?: () => void;
  pressHint?: string;
  selected?: boolean;
  /** Action indisponible (raison donnée dans `meta`). */
  actionDisabled?: boolean;
}

/** Ligne de liste : drapeau, nom en capitales, ligne meta et bouton rond +/−. */
export function CurrencyItem({
  currency,
  meta,
  action = 'none',
  onAction,
  onPress,
  pressHint,
  selected,
  actionDisabled,
}: CurrencyItemProps) {
  const { code, name, country } = currency;
  const content = (
    <>
      <Flag country={country} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="currency-label" color={selected ? 'accent' : 'ink'} numberOfLines={1}>
          {name}
        </Text>
        <Text variant="text-caption" color="inkMuted">
          {meta ?? code}
        </Text>
      </View>
      {selected && <Icon name="check" size={20} color="accent" label={fr.currencies.selected} />}
    </>
  );
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 60 }}>
      {onPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${name}, ${meta ?? code}`}
          accessibilityHint={pressHint}
          accessibilityState={{ selected: !!selected }}
          onPress={onPress}
          style={({ pressed }) => ({ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 60, opacity: pressed ? 0.7 : 1 })}
        >
          {content}
        </Pressable>
      ) : (
        <View
          accessible
          accessibilityLabel={`${name}, ${meta ?? code}`}
          style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: space[3] }}
        >
          {content}
        </View>
      )}
      {action !== 'none' && (
        <IconButton
          icon={action === 'add' ? 'plus' : 'minus'}
          label={action === 'add' ? fr.currencies.addItem(name, code) : fr.currencies.removeItem(name, code)}
          size="sm"
          disabled={actionDisabled}
          onPress={onAction}
        />
      )}
    </View>
  );
}
