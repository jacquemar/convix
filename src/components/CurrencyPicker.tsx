import React, { useMemo, useState } from 'react';
import { Modal, Pressable, SectionList, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CurrencyItem, IconButton, SearchField, Sheet } from './ui';
import { CURRENCIES, getCurrency, matchesQuery } from '../data/currencies';
import { useMyCurrencies, type Side } from '../services/my-currencies';
import { space, Text, useTheme } from '../theme';
import type { Currency } from '../types/currency';
import { fr } from '../i18n/fr';

export interface CurrencyPickerProps {
  /** Côté à changer ; `null` = fermé. */
  side: Side | null;
  /** Devise actuelle de ce côté et de l'autre. */
  current: string;
  other: string;
  onSelect: (code: string) => void;
  onClose: () => void;
}

/**
 * Choix de la devise d'un côté du convertisseur, dans une feuille qui monte du bas :
 * « Vos devises » d'abord, puis toutes les devises ; recherche sur le code et le nom.
 */
export function CurrencyPicker({ side, current, other, onSelect, onClose }: CurrencyPickerProps) {
  const { shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const favorites = useMyCurrencies();
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    if (query.trim()) {
      return [{ title: '', data: CURRENCIES.filter((c) => matchesQuery(c, query)) }];
    }
    const mine = favorites.map((code) => getCurrency(code)).filter((c): c is Currency => !!c);
    return [
      ...(mine.length ? [{ title: fr.currencies.mine, data: mine }] : []),
      { title: fr.currencies.all, data: CURRENCIES.filter((c) => !favorites.includes(c.code)) },
    ];
  }, [favorites, query]);

  const close = () => {
    setQuery('');
    onClose();
  };

  const select = (code: string) => {
    setQuery('');
    onSelect(code);
  };

  return (
    <Modal visible={side !== null} transparent animationType="slide" statusBarTranslucent onRequestClose={close}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable accessibilityRole="button" accessibilityLabel={fr.currencies.close} onPress={close} style={{ flex: 1 }} />
        <Sheet style={{ flex: 0, height: height * 0.86, boxShadow: shadows.shadowCard }}>
          <View style={{ paddingHorizontal: space[6], paddingTop: space[4], gap: space[4] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="sheet-title" accessibilityRole="header">
                {side === 'to' ? fr.currencies.pickTo : fr.currencies.pickFrom}
              </Text>
              <IconButton icon="close" label={fr.currencies.close} variant="glass" onPress={close} />
            </View>
            <SearchField value={query} onChange={setQuery} />
          </View>
          <SectionList
            sections={sections}
            keyExtractor={(c) => c.code}
            stickySectionHeadersEnabled={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingHorizontal: space[6], paddingBottom: insets.bottom + space[8] }}
            renderSectionHeader={({ section }) =>
              section.title ? (
                <Text variant="text-caption" color="inkMuted" style={{ marginTop: space[6], marginBottom: space[1] }}>
                  {section.title}
                </Text>
              ) : null
            }
            renderItem={({ item }) => (
              <CurrencyItem
                currency={item}
                selected={item.code === current}
                meta={item.code === other ? fr.currencies.otherSide : item.code}
                onPress={() => select(item.code)}
              />
            )}
            ListEmptyComponent={
              <Text color="inkMuted" style={{ textAlign: 'center', marginTop: space[6] }}>
                {fr.currencies.empty}
              </Text>
            }
          />
        </Sheet>
      </View>
    </Modal>
  );
}
