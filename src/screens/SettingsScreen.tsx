import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  Switch,
  ScrollView,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Appearance, AppearancePreferences } from 'react-native';
import { Currency, SUPPORTED_CURRENCIES } from '../types/currency';
import { currencyService } from '../services/currency.service';

export const SettingsScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [defaultCurrency, setDefaultCurrency] = useState<string>('USD');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isClearingCache, setIsClearingCache] = useState<boolean>(false);

  const loadSettings = async () => {
    try {
      const savedCurrency = await currencyService.getSelectedSourceCurrency();
      if (savedCurrency) {
        setDefaultCurrency(savedCurrency);
      }

      // Récupérer le thème depuis AsyncStorage ou MMKV
      // Pour simplifier, on utilise 'system' par défaut
      setTheme('system');
    } catch (err) {
      console.error('Erreur chargement paramètres:', err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleCurrencyChange = async (code: string) => {
    setDefaultCurrency(code);
    await currencyService.setSelectedSourceCurrency(code);
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    try {
      await AppearancePreferences.setColorScheme(newTheme);
    } catch (err) {
      console.error('Erreur changement thème:', err);
    }
  };

  const handleClearCache = async () => {
    try {
      setIsClearingCache(true);
      currencyService.clearCache();
      Alert.alert('Cache effacé', 'Le cache des taux de change a été vidé.');
    } catch (err) {
      console.error('Erreur vidage cache:', err);
      Alert.alert('Erreur', 'Impossible de vider le cache.');
    } finally {
      setIsClearingCache(false);
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={[styles.section, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#aaa' : '#666' }]}>{title}</Text>
      {children}
    </View>
  );

  const renderSettingItem = (
    label: string,
    value: string,
    onPress: () => void,
    subtitle?: string
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
    >
      <View style={styles.settingItemLeft}>
        <Text style={[styles.settingLabel, { color: isDark ? '#fff' : '#000' }]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: isDark ? '#888' : '#888' }]}>{subtitle}</Text>
        )}
      </View>
      <Text style={[styles.settingValue, { color: isDark ? '#007AFF' : '#007AFF' }]}>{value}</Text>
    </TouchableOpacity>
  );

  const renderThemeOption = (label: string, value: 'light' | 'dark' | 'system') => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        theme === value && styles.themeOptionSelected,
        { backgroundColor: isDark ? '#2a2a2a' : '#fff' }
      ]}
      onPress={() => handleThemeChange(value)}
    >
      <Text style={[
        styles.themeOptionLabel,
        theme === value ? { color: '#007AFF', fontWeight: '700' } : { color: isDark ? '#fff' : '#000' }
      ]}>
        {label}
        {theme === value && ' ✓'}
      </Text>
    </TouchableOpacity>
  );

  const renderCurrencyOption = (currency: Currency) => (
    <TouchableOpacity
      style={[
        styles.currencyOption,
        defaultCurrency === currency.code && styles.currencyOptionSelected,
        { backgroundColor: isDark ? '#2a2a2a' : '#fff' }
      ]}
      onPress={() => handleCurrencyChange(currency.code)}
    >
      <View style={styles.currencyOptionLeft}>
        <Text style={styles.flag}>{currency.flag}</Text>
        <View>
          <Text style={[
            styles.currencyOptionCode,
            defaultCurrency === currency.code ? { color: '#007AFF', fontWeight: '700' } : { color: isDark ? '#fff' : '#000' }
          ]}>
            {currency.code}
          </Text>
          <Text style={[
            styles.currencyOptionName,
            { color: isDark ? '#aaa' : '#666' }
          ]}>
            {currency.name}
          </Text>
        </View>
      </View>
      {defaultCurrency === currency.code && (
        <Text style={styles.checkMark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5' }]}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>⚙️ Paramètres</Text>
        </View>

        {/* Devise par défaut */}
        <renderSection title="DEVISE">
          {SUPPORTED_CURRENCIES.map(currency => (
            <renderCurrencyOption key={currency.code} currency={currency} />
          ))}
        </renderSection>

        {/* Thème */}
        <renderSection title="APPARENCE">
          <View style={styles.themeOptions}>
            {[
              { label: '☀️ Clair', value: 'light' as const },
              { label: '🌙 Sombre', value: 'dark' as const },
              { label: '📱 Système', value: 'system' as const },
            ].map(opt => (
              <renderThemeOption key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </View>
        </renderSection>

        {/* Données */}
        <renderSection title="DONNÉES">
          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
            onPress={handleClearCache}
            disabled={isClearingCache}
          >
            <View style={styles.settingItemLeft}>
              <Text style={[styles.settingLabel, { color: isDark ? '#fff' : '#000' }]}>Effacer le cache</Text>
              <Text style={[styles.settingSubtitle, { color: isDark ? '#888' : '#888' }]}>
                Supprime les taux de change stockés localement
              </Text>
            </View>
            {isClearingCache ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text style={[styles.settingValue, { color: '#FF3B30' }]}>Vider</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { backgroundColor: isDark ? '#2a2a2a' : '#fff' }]}
            onPress={async () => {
              try {
                await currencyService.getAllRates(defaultCurrency);
                Alert.alert('Succès', 'Les taux ont été actualisés.');
              } catch (err) {
                Alert.alert('Erreur', 'Impossible d\'actualiser les taux.');
              }
            }}
          >
            <View style={styles.settingItemLeft}>
              <Text style={[styles.settingLabel, { color: isDark ? '#fff' : '#000' }]}>Actualiser les taux</Text>
              <Text style={[styles.settingSubtitle, { color: isDark ? '#888' : '#888' }]}>
                Récupère les derniers taux depuis l'API
              </Text>
            </View>
            <Text style={[styles.settingValue, { color: isDark ? '#007AFF' : '#007AFF' }]}>🔄</Text>
          </TouchableOpacity>
        </renderSection>

        {/* À propos */}
        <renderSection title="À PROPOS">
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: isDark ? '#fff' : '#000' }]}>Version</Text>
            <Text style={[styles.aboutValue, { color: isDark ? '#aaa' : '#666' }]}>1.0.0</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: isDark ? '#fff' : '#000' }]}>API de taux</Text>
            <Text style={[styles.aboutValue, { color: isDark ? '#aaa' : '#666' }]}>Frankfurter API</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={[styles.aboutLabel, { color: isDark ? '#fff' : '#000' }]}>Confidentialité</Text>
            <Text style={[styles.aboutValue, { color: isDark ? '#007AFF' : '#007AFF' }]}>Aucune donnée personnelle collectée</Text>
          </View>
        </renderSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  settingItemLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
  },
  themeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#eee',
  },
  themeOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  themeOptionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  currencyOptionSelected: {
    backgroundColor: 'rgba(0,122,255,0.05)',
  },
  currencyOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyOptionCode: {
    fontSize: 16,
    fontWeight: '700',
  },
  currencyOptionName: {
    fontSize: 13,
  },
  flag: {
    fontSize: 24,
  },
  checkMark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  aboutValue: {
    fontSize: 14,
  },
});