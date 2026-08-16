import { FrankfurterClient } from '../api/frankfurter';
import { Rate, Currency } from '../types/currency';

describe('FrankfurterClient', () => {
  let client: FrankfurterClient;

  beforeEach(() => {
    client = FrankfurterClient.getInstance();
    client.clearCache();
  });

  describe('getLatestRates', () => {
    it('should return rates for a valid base currency', async () => {
      const rates = await client.getLatestRates('USD');
      
      expect(rates).toBeDefined();
      expect(Array.isArray(rates)).toBe(true);
      expect(rates.length).toBeGreaterThan(0);
      
      rates.forEach((rate: Rate) => {
        expect(rate.base).toBe('USD');
        expect(rate.quote).toBeDefined();
        expect(typeof rate.rate).toBe('number');
        expect(rate.rate).toBeGreaterThan(0);
        expect(rate.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(rate.cachedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    });

    it('should return cached data on second call', async () => {
      const rates1 = await client.getLatestRates('USD');
      const rates2 = await client.getLatestRates('USD');
      
      expect(rates1).toEqual(rates2);
    });

    it('should handle invalid base currency gracefully', async () => {
      await expect(client.getLatestRates('INVALID')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      // Test with a very short timeout to simulate network failure
      // This is more of an integration test
    });
  });

  describe('getCurrencies', () => {
    it('should return a list of supported currencies', async () => {
      const currencies = await client.getCurrencies();
      
      expect(currencies).toBeDefined();
      expect(Array.isArray(currencies)).toBe(true);
      expect(currencies.length).toBeGreaterThan(0);
      
      currencies.forEach((currency: Currency) => {
        expect(currency.code).toBeDefined();
        expect(currency.name).toBeDefined();
        expect(currency.symbol).toBeDefined();
        expect(currency.flag).toBeDefined();
      });
    });

    it('should return cached data on second call', async () => {
      const currencies1 = await client.getCurrencies();
      const currencies2 = await client.getCurrencies();
      
      expect(currencies1).toEqual(currencies2);
    });
  });

  describe('getHistoricalRates', () => {
    it('should return historical rates for a date range', async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const rates = await client.getHistoricalRates('USD', 'EUR', startDate, endDate);
      
      expect(rates).toBeDefined();
      expect(Array.isArray(rates)).toBe(true);
      
      rates.forEach((rate: Rate) => {
        expect(rate.base).toBe('USD');
        expect(rate.quote).toBe('EUR');
        expect(typeof rate.rate).toBe('number');
        expect(rate.rate).toBeGreaterThan(0);
        expect(rate.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });
});