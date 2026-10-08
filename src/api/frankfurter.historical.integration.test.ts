import { FrankfurterClient } from '../api/frankfurter';
import { Rate } from '../types/currency';

describe('FrankfurterClient - Historical Rates', () => {
  let client: FrankfurterClient;

  beforeEach(() => {
    client = FrankfurterClient.getInstance();
    client.clearCache();
  });

  describe('getHistoricalRates', () => {
    it('should return historical rates for a valid date range', async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const rates = await client.getHistoricalRates('USD', 'EUR', startDate, endDate);
      
      expect(rates).toBeDefined();
      expect(Array.isArray(rates)).toBe(true);
      expect(rates.length).toBeGreaterThan(0);
      
      rates.forEach((rate: Rate) => {
        expect(rate.base).toBe('USD');
        expect(rate.quote).toBe('EUR');
        expect(typeof rate.rate).toBe('number');
        expect(rate.rate).toBeGreaterThan(0);
        expect(rate.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('should throw error for invalid date format', async () => {
      await expect(client.getHistoricalRates('USD', 'EUR', '01/01/2026', '2026-01-31')).rejects.toThrow('Format de date invalide');
    });

    it('should throw error if start date is after end date', async () => {
      await expect(client.getHistoricalRates('USD', 'EUR', '2026-01-31', '2026-01-01')).rejects.toThrow('La date de début doit être antérieure à la date de fin');
    });

    it('should throw error if period exceeds 1 year', async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 370 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      await expect(client.getHistoricalRates('USD', 'EUR', startDate, endDate)).rejects.toThrow('La période ne peut pas dépasser 1 an');
    });

    it('should return cached data on second call', async () => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const rates1 = await client.getHistoricalRates('USD', 'EUR', startDate, endDate);
      const rates2 = await client.getHistoricalRates('USD', 'EUR', startDate, endDate);
      
      expect(rates1).toEqual(rates2);
    });
  });
});