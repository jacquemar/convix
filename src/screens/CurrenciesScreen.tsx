import React, { useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, CurrencyItem, Divider, HeroCard, SearchField, SectionTitle, Sheet } from '../components/ui';
import { FocusStatusBar } from '../components/FocusStatusBar';
import { CURRENCIES, getCurrency, matchesQuery } from '../data/currencies';
import { myCurrencies, useMyCurrencies } from '../services/my-currencies';
import { space, Text, useTheme } from '../theme';
import type { Currency } from '../types/currency';
import { fr } from '../i18n/fr';

/**
 * Gestion de « Vos devises » : les favoris proposés en premier quand on choisit une devise
 * dans le convertisseur. Cet écran ne modifie jamais la paire en cours.
 */
export function CurrenciesScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const list = useMyCurrencies();
  const [query, setQuery] = useState('');

  const mine = useMemo(() => list.map((code) => getCurrency(code)).filter((c): c is Currency => !!c), [list]);
  const results = useMemo(() => CURRENCIES.filter((c) => !list.includes(c.code) && matchesQuery(c, query)), [list, query]);

  const header = (
    <View>
      <SectionTitle first>{fr.currencies.mine}</SectionTitle>
      <Text variant="text-caption" color="inkMuted" style={{ textAlign: 'center', marginTop: -space[2], marginBottom: space[3] }}>
        {mine.length ? fr.currencies.mineHint : fr.currencies.mineEmpty}
      </Text>
      {mine.map((currency) => (
        <CurrencyItem key={currency.code} currency={currency} action="remove" onAction={() => myCurrencies.remove(currency.code)} />
      ))}
      <Divider />
      <SectionTitle first>{fr.currencies.add}</SectionTitle>
      <SearchField value={query} onChange={setQuery} />
      <View style={{ height: space[3] }} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.heroBase }}>
      <FocusStatusBar style="light" />
      <HeroCard flat style={{ paddingTop: insets.top + space[4], paddingBottom: space[4] }}>
        <AppHeader subtitle={fr.currencies.subtitle} />
      </HeroCard>
      <Sheet fade={results.length > 4}>
        <FlatList
          data={results}
          keyExtractor={(c) => c.code}
          renderItem={({ item }) => (
            <CurrencyItem
              currency={item}
              action="add"
              onPress={() => myCurrencies.add(item.code)}
              onAction={() => myCurrencies.add(item.code)}
            />
          )}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <Text color="inkMuted" style={{ textAlign: 'center', marginTop: space[4] }}>
              {fr.currencies.empty}
            </Text>
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingHorizontal: space[6], paddingBottom: space[12] }}
          style={{ flex: 1 }}
        />
      </Sheet>
    </View>
  );
}
