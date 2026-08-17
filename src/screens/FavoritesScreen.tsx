import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
  TextInput,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Currency, SUPPORTED_CURRENCIES } from '../types/currency';
import { currencyService } from '../services/currency.service';

export const FavoritesScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark' || colorScheme === 'unspecified';
  
  const [favoriteCodes, setFavoriteCodes] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const codes = await currencyService.getFavoriteCurrencies();
      setFavoriteCodes(codes);
      
      const favCurrencies = SUPPORTED_CURRENCIES.filter(c => codes.includes(c.code));
      setFavorites(favCurrencies);
    } catch (err) {
      console.error('Erreur chargement favoris:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleToggleFavorite = async (code: string) => {
    try {
      const isAdded = await currencyService.toggleFavoriteCurrency(code);
      await loadFavorites();
      
      // Haptic feedback
      if (Platform.OS === 'ios') {
        // iOS haptic
      }
    } catch (err) {
      console.error('Erreur toggle favori:', err);
    }
  };

  const renderItem = ({ item }: { item: Currency }) => (
    <TouchableOpacity
      style={[styles.favoriteItem, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
      onPress={() => handleToggleFavorite(item.code)}
    >
      <View style={styles.favoriteItemLeft}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View>
          <Text style={[styles.currencyCode, { color: isDark ? '#fff' : '#000' }]}>{item.code}</Text>
          <Text style={[styles.currencyName, { color: isDark ? '#aaa' : '#666' }]}>{item.name}</Text>
        </View>
      </View>
      <View style={styles.favoriteItemRight}>
        <Text style={styles.favoriteStar}>⭐️</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleToggleFavorite(item.code)}
        >
          <Text style={styles.removeText}>Retirer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const AddButton = () => (
    <TouchableOpacity
      style={[styles.addButton, { backgroundColor: isDark ? '#007AFF' : '#007AFF' }]}
      onPress={() => Keyboard.dismiss()}
    >
      <Text style={styles.addButtonText}>+ Ajouter une devise favorite</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#007AFF'} />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>Chargement des favoris...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>⭐️ Devises Favorites</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyTitle, { color: isDark ? '#fff' : '#000' }]}>Aucun favori pour l'instant</Text>
          <Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#666' }]}>
            Ajoutez vos devises les plus utilisées pour y accéder rapidement depuis le convertisseur.
          </Text>
          <AddButton />
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.code}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={AddButton}
        />
      )}

      {/* Modal pour ajouter un favori (simplifié) */}
      <AddFavoriteModal
        visible={favorites.length < SUPPORTED_CURRENCIES.length}
        onClose={() => {}}
        onAdd={async (code: string) => {
          await currencyService.addFavoriteCurrency(code);
          await loadFavorites();
        }}
        existingCodes={favoriteCodes}
        colorScheme={colorScheme}
      />
    </SafeAreaView>
  );
};

// Modal simplifié pour ajouter un favori
interface AddFavoriteModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (code: string) => void;
  existingCodes: string[];
  colorScheme: 'light' | 'dark' | null;
}

const AddFavoriteModal: React.FC<AddFavoriteModalProps> = ({
  visible,
  onClose,
  onAdd,
  existingCodes,
  colorScheme,
}) => {
  const isDark = colorScheme === 'dark';
  const [searchText, setSearchText] = useState<string>('');

  if (!visible) return null;

  const availableCurrencies = SUPPORTED_CURRENCIES.filter(
    c => !existingCodes.includes(c.code)
  );

  const filtered = availableCurrencies.filter(
    c => c.code.toLowerCase().includes(searchText.toLowerCase()) ||
         c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContent, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>Ajouter un favori</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.modalClose, { color: isDark ? '#fff' : '#007AFF' }]}>Fermer</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={[styles.modalSearch, { backgroundColor: isDark ? '#3a3a3a' : '#f5f5f5', color: isDark ? '#fff' : '#000' }]}
          placeholder="Rechercher une devise..."
          placeholderTextColor={isDark ? '#666' : '#999'}
          value={searchText}
          onChangeText={setSearchText}
          autoFocus
        />
        
        <FlatList
          data={filtered}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.modalItem, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
              onPress={() => {
                onAdd(item.code);
                onClose();
              }}
            >
              <View style={styles.modalItemLeft}>
                <Text style={styles.flag}>{item.flag}</Text>
                <View>
                  <Text style={[styles.currencyCode, { color: isDark ? '#fff' : '#000' }]}>{item.code}</Text>
                  <Text style={[styles.currencyName, { color: isDark ? '#aaa' : '#666' }]}>{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.code}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: '80%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 28,
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: '700',
  },
  currencyName: {
    fontSize: 13,
  },
  favoriteStar: {
    fontSize: 20,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalSearch: {
    fontSize: 16,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});