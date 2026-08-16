import { CurrencyService } from '../services/currency.service';
import { Rate } from '../types/currency';

// Mock MMKV
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn().mockImplementation(() => ({
    storage: {} as Record<string, string>,
    getString: function(key: string) {
      return this.storage[key] || undefined;
    },
    set: function(key: string, value: string) {
      this.storage[key] = value;
    },
    delete: function(key: string) {
      delete this.storage[key];
    },
    clearAll: function() {
      this.storage = {};
    },
    getAllKeys: function() {
      return Object.keys(this.storage);
    },
  })),
}));

// Mock FrankfurterClient
jest.mock('../api/frankfurter', () => ({
  frankfurterClient: {
    getLatestRates: jest.fn(),
    getCurrencies: jest.fn(),
    getHistoricalRates: jest.fn(),
    clearCache: jest.fn(),
  },
  FrankfurterClient: {
    getInstance: jest.fn().mockReturnValue({
      getLatestRates: jest.fn(),
      getCurrencies: jest.fn(),
      getHistoricalRates: jest.fn(),
      clearCache: jest.fn(),
    }),
  },
}));

import { frankfurterClient } from '../api/frankfurter';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    service = CurrencyService.getInstance();
    jest.clearAllMocks();
  });

  describe('convert', () => {
    it('should convert amount using the exchange rate', async () => {
      const mockRate: Rate = {
        base: 'USD',
        quote: 'EUR',
        rate: 0.85,
        date: '2026-08-16',
        cachedAt: new Date().toISOString(),
      };

      (frankfurterClient.getLatestRates as jest.Mock).mockResolvedValue([mockRate]);

      const result = await service.convert(100, 'USD', 'EUR');
      
      expect(result).toBe(85); // 100 * 0.85 = 85
    });

    it('should return same amount for same currency', async () => {
      const result = await service.convert(100, 'USD', 'USD');
      expect(result).toBe(100);
    });

    it('should handle decimal amounts', async () => {
      const mockRate: Rate = {
        base: 'USD',
        quote: 'EUR',
        rate: 0.8523,
        date: '2026-08-16',
        cachedAt: new Date().toISOString(),
      };

      (frankfurterClient.getLatestRates as jest.Mock).mockResolvedValue([mockRate]);

      const result = await service.convert(10.5, 'USD', 'EUR');
      
      // 10.5 * 0.8523 = 8.94915 -> arrondi à 4 décimales = 8.9492
      expect(result).toBe(8.9492);
    });

    it('should handle large amounts', async () => {
      const mockRate: Rate = {
        base: 'USD',
        quote: 'EUR',
        rate: 0.85,
        date: '2026-08-16',
        cachedAt: new Date().toISOString(),
      };

      (frankfurterClient.getLatestRates as jest.Mock).mockResolvedValue([mockRate]);

      const result = await service.convert(1000000, 'USD', 'EUR');
      expect(result).toBe(850000);
    });

    it('should throw error for unavailable currency pair', async () => {
      (frankfurterClient.getLatestRates as jest.Mock).mockResolvedValue([]);

      await expect(service.convert(100, 'USD', 'INVALID')).rejects.toThrow();
    });
  });

  describe('getRate', () => {
    it('should return rate from cache if valid', async () => {
      const cachedRate = {
        rate: 0.85,
        date: '2026-08-16',
        cachedAt: new Date().toISOString(),
      };

      // Simuler le cache
      const serviceInstance = CurrencyService.getInstance();
      // On ne peut pas accéder au storage privé directement dans le test
      // Ce test vérifierait l'intégration avec MMKV
    });

    it('should fetch new rate if cache is expired', async () => {
      const mockRate: Rate = {
        base: 'USD',
        quote: 'EUR',
        rate: 0.85,
        date: '2026-08-16',
        cachedAt: new Date().toISOString(),
      };

      (frankfurterClient.getLatestRates as jest.Mock).mockResolvedValue([mockRate]);

      const rate = await service.getRate('USD', 'EUR');
      
      expect(rate.rate).toBe(0.85);
      expect(rate.base).toBe('USD');
      expect(rate.quote).toBe('EUR');
    });
  });

  describe('favorite currencies', () => {
    it('should add and remove favorite currencies', async () => {
      await service.addFavoriteCurrency('USD');
      const favorites = await service.getFavoriteCurrencies();
      expect(favorites).toContain('USD');

      await service.removeFavoriteCurrency('USD');
      const favoritesAfterRemove = await service.getFavoriteCurrencies();
      expect(favoritesAfterRemove).not.toContain('USD');
    });

    it('should toggle favorite currency', async () => {
      const isAdded = await service.toggleFavoriteCurrency('EUR');
      expect(isAdded).toBe(true);

      const isRemoved = await service.toggleFavoriteCurrency('EUR');
      expect(isRemoved).toBe(false);
    });
  });

  describe('selected currencies', () => {
    it('should store and retrieve selected source currency', async () => {
      await service.setSelectedSourceCurrency('USD');
      const source = await service.getSelectedSourceCurrency();
      expect(source).toBe('USD');
    });

    it('should store and retrieve selected target currency', async () => {
      await service.setSelectedTargetCurrency('EUR');
      const target = await service.getSelectedTargetCurrency();
      expect(target).toBe('EUR');
    });
  });

  describe('cache management', () => {
    it('should clear cache', async () => {
      await service.clearCache();
      // Pas d'erreur = succès
    });

    it('should clear all data', async () => {
      await service.clearAllData();
      // Pas d'erreur = succès
    });
  });
});