import { MMKV } from 'react-native-mmkv';
import { frankfurterClient, Rate } from '../api/frankfurter';
import { Currency } from '../types/currency';

const STORAGE = new MMKV();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

interface CachedRate {
  rate: number;
  date: string;
  cachedAt: string;
}

interface CachedRateData {
  [key: string]: CachedRate;
}

export class CurrencyService {
  private static instance: CurrencyService;
  private isRefreshing = false;

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private getCacheKey(from: string, to: string): string {
    return `rate_${from}_${to}`;
  }

  private getCacheKeyAll(base: string): string {
    return `rates_${base}`;
  }

  private getFavoriteCurrenciesKey(): string {
    return 'favorite_currencies';
  }

  private getSelectedSourceCurrencyKey(): string {
    return 'selected_source_currency';
  }

  private getSelectedTargetCurrencyKey(): string {
    return 'selected_target_currency';
  }

  private isCacheValid(cachedAt: string): boolean {
    const cacheTime = new Date(cachedAt).getTime();
    return Date.now() - cacheTime < CACHE_DURATION;
  }

  async getRate(from: string, to: string): Promise<Rate> {
    const cacheKey = this.getCacheKey(from, to);
    const cachedData = STORAGE.getString(cacheKey);

    if (cachedData) {
      try {
        const cached: CachedRate = JSON.parse(cachedData);
        if (this.isCacheValid(cached.cachedAt)) {
          return {
            base: from,
            quote: to,
            rate: cached.rate,
            date: cached.date,
            cachedAt: cached.cachedAt,
          };
        }
      } catch (e) {
        // Cache corrompu, on ignore
      }
    }

    // Si pas de cache valide, on rafraîchit
    return this.refreshRate(from, to);
  }

  private async refreshRate(from: string, to: string): Promise<Rate> {
    try {
      const rates = await frankfurterClient.getLatestRates(from);
      const rateData = rates.find(r => r.quote === to);
      
      if (!rateData) {
        throw new Error(`Taux non disponible pour ${from} -> ${to}`);
      }

      // Mettre à jour le cache
      const cacheKey = this.getCacheKey(from, to);
      const cached: CachedRate = {
        rate: rateData.rate,
        date: rateData.date,
        cachedAt: new Date().toISOString(),
      };
      STORAGE.set(cacheKey, JSON.stringify(cached));

      return rateData;
    } catch (error) {
      // Si erreur réseau, on essaie de retourner le cache même expiré
      const cacheKey = this.getCacheKey(from, to);
      const cachedData = STORAGE.getString(cacheKey);
      if (cachedData) {
        try {
          const cached: CachedRate = JSON.parse(cachedData);
          return {
            base: from,
            quote: to,
            rate: cached.rate,
            date: cached.date,
            cachedAt: cached.cachedAt,
          };
        } catch (e) {
          // Cache corrompu
        }
      }
      throw error;
    }
  }

  async convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;
    
    const rate = await this.getRate(from, to);
    const result = amount * rate.rate;
    
    // Arrondir à 4 décimales pour la précision interne
    return Math.round(result * 10000) / 10000;
  }

  async getAllRates(base: string = 'USD'): Promise<Rate[]> {
    const cacheKey = this.getCacheKeyAll(base);
    const cachedData = STORAGE.getString(cacheKey);

    if (cachedData) {
      try {
        const cached: CachedRateData = JSON.parse(cachedData);
        const now = Date.now();
        let hasValidData = false;
        
        for (const key in cached) {
          if (this.isCacheValid(cached[key].cachedAt)) {
            hasValidData = true;
            break;
          }
        }
        
        if (hasValidData) {
          return Object.entries(cached).map(([pair, data]) => {
            const [from, to] = pair.split('_');
            return {
              base: from,
              quote: to,
              rate: data.rate,
              date: data.date,
              cachedAt: data.cachedAt,
            };
          });
        }
      } catch (e) {
        // Cache corrompu
      }
    }

    // Rafraîchir
    return this.refreshAllRates(base);
  }

  private async refreshAllRates(base: string): Promise<Rate[]> {
    try {
      const rates = await frankfurterClient.getLatestRates(base);
      
      const cached: CachedRateData = {};
      rates.forEach(rate => {
        const key = `${rate.base}_${rate.quote}`;
        cached[key] = {
          rate: rate.rate,
          date: rate.date,
          cachedAt: new Date().toISOString(),
        };
      });
      
      const cacheKey = this.getCacheKeyAll(base);
      STORAGE.set(cacheKey, JSON.stringify(cached));
      
      return rates;
    } catch (error) {
      // Retourner le cache même expiré
      const cacheKey = this.getCacheKeyAll(base);
      const cachedData = STORAGE.getString(cacheKey);
      if (cachedData) {
        try {
          const cached: CachedRateData = JSON.parse(cachedData);
          return Object.entries(cached).map(([pair, data]) => {
            const [from, to] = pair.split('_');
            return {
              base: from,
              quote: to,
              rate: data.rate,
              date: data.date,
              cachedAt: data.cachedAt,
            };
          });
        } catch (e) {
          // Cache corrompu
        }
      }
      throw error;
    }
  }

  // Méthode pour rafraîchir en arrière-plan (Cache First → Network Refresh)
  async refreshInBackground(from: string, to: string): Promise<void> {
    if (this.isRefreshing) return;
    this.isRefreshing = true;
    
    try {
      await this.refreshRate(from, to);
    } catch (error) {
      // Erreur silencieuse pour le rafraîchissement en arrière-plan
      console.warn('Background refresh failed:', error);
    } finally {
      this.isRefreshing = false;
    }
  }

  // Favoris
  async getFavoriteCurrencies(): Promise<string[]> {
    const data = STORAGE.getString(this.getFavoriteCurrenciesKey());
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  async addFavoriteCurrency(code: string): Promise<void> {
    const favorites = await this.getFavoriteCurrencies();
    if (!favorites.includes(code)) {
      favorites.push(code);
      STORAGE.set(this.getFavoriteCurrenciesKey(), JSON.stringify(favorites));
    }
  }

  async removeFavoriteCurrency(code: string): Promise<void> {
    const favorites = await this.getFavoriteCurrencies();
    const filtered = favorites.filter(c => c !== code);
    STORAGE.set(this.getFavoriteCurrenciesKey(), JSON.stringify(filtered));
  }

  async toggleFavoriteCurrency(code: string): Promise<boolean> {
    const favorites = await this.getFavoriteCurrencies();
    const isFavorite = favorites.includes(code);
    
    if (isFavorite) {
      await this.removeFavoriteCurrency(code);
      return false;
    } else {
      await this.addFavoriteCurrency(code);
      return true;
    }
  }

  // Devises sélectionnées
  async getSelectedSourceCurrency(): Promise<string | null> {
    return STORAGE.getString(this.getSelectedSourceCurrencyKey()) || null;
  }

  async setSelectedSourceCurrency(code: string): Promise<void> {
    STORAGE.set(this.getSelectedSourceCurrencyKey(), code);
  }

  async getSelectedTargetCurrency(): Promise<string | null> {
    return STORAGE.getString(this.getSelectedTargetCurrencyKey()) || null;
  }

  async setSelectedTargetCurrency(code: string): Promise<void> {
    STORAGE.set(this.getSelectedTargetCurrencyKey(), code);
  }

  // Nettoyage du cache
  clearCache(): void {
    const allKeys = STORAGE.getAllKeys();
    allKeys.forEach(key => {
      if (key.startsWith('rate_') || key.startsWith('rates_')) {
        STORAGE.delete(key);
      }
    });
  }

  clearAllData(): void {
    STORAGE.clearAll();
  }
}

export const currencyService = CurrencyService.getInstance();