import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  Keyboard,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Currency, SUPPORTED_CURRENCIES } from '../types/currency';

interface CurrencySelectorProps {
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
  title: string;
  favoriteCurrencies?: string[];
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onSelect,
  title,
  favoriteCurrencies = [],
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [searchText, setSearchText] = useState<string>('');
  const [currencies, setCurrencies] = useState<Currency[]>(SUPPORTED_CURRENCIES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    filterCurrencies();
  }, [searchText]);

  const filterCurrencies = () => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered = SUPPORTED_CURRENCIES.filter(currency =>
        currency.code.toLowerCase().includes(searchText.toLowerCase()) ||
        currency.name.toLowerCase().includes(searchText.toLowerCase())
      );

      // Trier : favoris d'abord, puis sélectionnée, puis alphabétique
      filtered.sort((a, b) => {
        const aFav = favoriteCurrencies.includes(a.code);
        const bFav = favoriteCurrencies.includes(b.code);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        
        const aSel = selectedCurrency?.code === a.code;
        const bSel = selectedCurrency?.code === b.code;
        if (aSel && !bSel) return -1;
        if (!aSel && bSel) return 1;
        
        return a.code.localeCompare(b.code);
      });

      setCurrencies(filtered);
      setIsLoading(false);
    }, 100);
  };

  const renderItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity
      style={[styles.currencyItem, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
      onPress={() => {
        onSelect(item);
        Keyboard.dismiss();
      }}
    >
      <View style={styles.currencyItemLeft}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View>
          <Text style={[styles.currencyCode, { color: isDark ? '#fff' : '#000' }]}>{item.code}</Text>
          <Text style={[styles.currencyName, { color: isDark ? '#aaa' : '#666' }]}>{item.name}</Text>
        </View>
      </View>
      <View style={styles.currencyItemRight}>
        {favoriteCurrencies.includes(item.code) && (
          <Text style={styles.favoriteStar}>⭐️</Text>
        )}
        {selectedCurrency?.code === item.code && (
          <Text style={styles.selectedCheck}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}>
        <TouchableOpacity onPress={() => Keyboard.dismiss()} style={styles.backButton}>
          <Text style={[styles.backText, { color: isDark ? '#fff' : '#007AFF' }]}>Fermer</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: isDark ? '#3a3a3a' : '#fff', color: isDark ? '#fff' : '#000' }]}
          placeholder="Rechercher une devise..."
          placeholderTextColor={isDark ? '#666' : '#999'}
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#007AFF'} />
        </View>
      ) : (
        <FlatList
          data={currencies}
          renderItem={renderItem}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: isDark ? '#888' : '#888' }]}>
                Aucune devise trouvée
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    fontSize: 16,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  currencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  currencyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 24,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  currencyName: {
    fontSize: 13,
  },
  currencyItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteStar: {
    fontSize: 16,
  },
  selectedCheck: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
  },
});