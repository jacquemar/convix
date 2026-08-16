import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Keyboard,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { currencyService } from '../services/currency.service';
import { Currency, SUPPORTED_CURRENCIES } from '../types/currency';
import { CurrencySelector } from '../components/CurrencySelector';
import { SwapButton } from '../components/SwapButton';

interface ConverterScreenProps {
  navigation?: any;
}

export const ConverterScreen: React.FC<ConverterScreenProps> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [amount, setAmount] = useState<string>('');
  const [sourceCurrency, setSourceCurrency] = useState<Currency | null>(null);
  const [targetCurrency, setTargetCurrency] = useState<Currency | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser les devises par défaut
  useEffect(() => {
    initializeCurrencies();
  }, []);

  const initializeCurrencies = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Récupérer les devises sélectionnées sauvegardées
      const savedSource = await currencyService.getSelectedSourceCurrency();
      const savedTarget = await currencyService.getSelectedTargetCurrency();

      const source = savedSource 
        ? SUPPORTED_CURRENCIES.find(c => c.code === savedSource) || SUPPORTED_CURRENCIES[0]
        : SUPPORTED_CURRENCIES[0]; // USD par défaut

      const target = savedTarget
        ? SUPPORTED_CURRENCIES.find(c => c.code === savedTarget) || SUPPORTED_CURRENCIES[1]
        : SUPPORTED_CURRENCIES[1]; // EUR par défaut

      setSourceCurrency(source);
      setTargetCurrency(target);

      // Précharger les taux
      await currencyService.getAllRates(source.code);
      setRateDate(new Date().toLocaleDateString('fr-FR'));
      
    } catch (err) {
      console.error('Erreur initialisation:', err);
      setError('Impossible de charger les taux de change');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculer la conversion à chaque changement
  const calculateConversion = useCallback(async () => {
    if (!amount || !sourceCurrency || !targetCurrency) {
      setResult(null);
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      setResult(null);
      return;
    }

    try {
      const converted = await currencyService.convert(numAmount, sourceCurrency.code, targetCurrency.code);
      setResult(converted);
      
      // Récupérer la date du taux
      const rate = await currencyService.getRate(sourceCurrency.code, targetCurrency.code);
      setRateDate(new Date(rate.date).toLocaleDateString('fr-FR'));
      setIsOffline(false);
      setError(null);
    } catch (err) {
      console.error('Erreur conversion:', err);
      setIsOffline(true);
      setError('Utilisation du dernier taux connu (hors connexion)');
    }
  }, [amount, sourceCurrency, targetCurrency]);

  useEffect(() => {
    calculateConversion();
  }, [calculateConversion]);

  const handleAmountChange = (text: string) => {
    // Valider que c'est un nombre valide
    if (text === '' || /^\d*\.?\d*$/.test(text)) {
      setAmount(text);
    }
  };

  const handleSourceCurrencySelect = (currency: Currency) => {
    setSourceCurrency(currency);
    currencyService.setSelectedSourceCurrency(currency.code);
  };

  const handleTargetCurrencySelect = (currency: Currency) => {
    setTargetCurrency(currency);
    currencyService.setSelectedTargetCurrency(currency.code);
  };

  const handleSwap = () => {
    if (sourceCurrency && targetCurrency) {
      setSourceCurrency(targetCurrency);
      setTargetCurrency(sourceCurrency);
      currencyService.setSelectedSourceCurrency(targetCurrency.code);
      currencyService.setSelectedTargetCurrency(sourceCurrency.code);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      if (sourceCurrency) {
        await currencyService.getAllRates(sourceCurrency.code);
        await calculateConversion();
      }
    } catch (err) {
      setError('Impossible de rafraîchir les taux');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={isDark ? '#fff' : '#007AFF'} />
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Indicateur hors connexion */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>⚠️ Hors connexion — utilisation du dernier taux disponible</Text>
          </View>
        )}

        {/* Erreur */}
        {error && !isOffline && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Devise source */}
        <View style={styles.currencyCard}>
          <View style={styles.currencyHeader}>
            <Text style={[styles.currencyLabel, { color: isDark ? '#aaa' : '#666' }]}>DEVISE SOURCE</Text>
          </View>
          <TouchableOpacity 
            style={styles.currencySelector}
            onPress={() => navigation?.navigate('CurrencySelector', {
              selectedCurrency: sourceCurrency,
              onSelect: handleSourceCurrencySelect,
              title: 'Choisir la devise source',
            })}
          >
            <View style={styles.currencyInfo}>
              <Text style={[styles.flag, { fontSize: 28 }]}>{sourceCurrency?.flag}</Text>
              <View>
                <Text style={[styles.currencyCode, { color: isDark ? '#fff' : '#000' }]}>{sourceCurrency?.code}</Text>
                <Text style={[styles.currencyName, { color: isDark ? '#aaa' : '#666' }]}>{sourceCurrency?.name}</Text>
              </View>
            </View>
            <Text style={[styles.currencySymbol, { color: isDark ? '#fff' : '#000' }]}>{sourceCurrency?.symbol}</Text>
          </TouchableOpacity>
        </View>

        {/* Montant */}
        <View style={styles.amountCard}>
          <TextInput
            style={[styles.amountInput, { color: isDark ? '#fff' : '#000' }]}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            placeholderTextColor={isDark ? '#666' : '#999'}
            keyboardType="decimal-pad"
            autoFocus
            maxLength={15}
            textAlign="center"
          />
        </View>

        {/* Bouton Swap */}
        <SwapButton
          onPress={handleSwap}
          disabled={!sourceCurrency || !targetCurrency}
          colorScheme={colorScheme}
        />

        {/* Devise cible */}
        <View style={styles.currencyCard}>
          <View style={styles.currencyHeader}>
            <Text style={[styles.currencyLabel, { color: isDark ? '#aaa' : '#666' }]}>DEVISE CIBLE</Text>
          </View>
          <TouchableOpacity 
            style={styles.currencySelector}
            onPress={() => navigation?.navigate('CurrencySelector', {
              selectedCurrency: targetCurrency,
              onSelect: handleTargetCurrencySelect,
              title: 'Choisir la devise cible',
            })}
          >
            <View style={styles.currencyInfo}>
              <Text style={[styles.flag, { fontSize: 28 }]}>{targetCurrency?.flag}</Text>
              <View>
                <Text style={[styles.currencyCode, { color: isDark ? '#fff' : '#000' }]}>{targetCurrency?.code}</Text>
                <Text style={[styles.currencyName, { color: isDark ? '#aaa' : '#666' }]}>{targetCurrency?.name}</Text>
              </View>
            </View>
            <Text style={[styles.currencySymbol, { color: isDark ? '#fff' : '#000' }]}>{targetCurrency?.symbol}</Text>
          </TouchableOpacity>
        </View>

        {/* Résultat */}
        <View style={styles.resultCard}>
          <Text style={[styles.resultLabel, { color: isDark ? '#aaa' : '#666' }]}>RÉSULTAT</Text>
          <Text style={[styles.resultValue, { color: isDark ? '#fff' : '#000' }]}>
            {result !== null ? result.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </Text>
          <Text style={[styles.resultCurrency, { color: isDark ? '#aaa' : '#666' }]}>
            {targetCurrency?.code} ({targetCurrency?.symbol})
          </Text>
        </View>

        {/* Taux de change */}
        {sourceCurrency && targetCurrency && (
          <View style={styles.rateInfo}>
            <Text style={[styles.rateText, { color: isDark ? '#888' : '#888' }]}>
              1 {sourceCurrency.code} = {(1 / (await currencyService.convert(1, targetCurrency.code, sourceCurrency.code))).toFixed(4)} {targetCurrency.code}
            </Text>
            <Text style={[styles.rateDate, { color: isDark ? '#888' : '#888' }]}>
              Taux du {rateDate} • {isOffline ? 'Hors connexion' : 'En ligne'}
            </Text>
          </View>
        )}

        {/* Bouton rafraîchir */}
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} disabled={isLoading}>
          <Text style={[styles.refreshText, { color: isDark ? '#fff' : '#007AFF' }]}>
            {isLoading ? 'Actualisation...' : '🔄 Actualiser les taux'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
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
  offlineBanner: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  offlineText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#F8D7DA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
  },
  errorText: {
    color: '#721C24',
    fontSize: 14,
    textAlign: 'center',
  },
  currencyCard: {
    marginBottom: 16,
  },
  currencyHeader: {
    marginBottom: 8,
  },
  currencyLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currencyInfo: {
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
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
  },
  amountCard: {
    marginBottom: 16,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '300',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultCard: {
    marginTop: 8,
    marginBottom: 24,
    padding: 24,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#fff',
  },
  resultCurrency: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  rateInfo: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 4,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rateDate: {
    fontSize: 12,
  },
  refreshButton: {
    padding: 16,
    alignItems: 'center',
  },
  refreshText: {
    fontSize: 16,
    fontWeight: '600',
  },
});