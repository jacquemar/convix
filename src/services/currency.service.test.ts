import { CurrencyService } from './currency.service';
import { frankfurterClient } from '../api/frankfurter';
import { currencyApi } from '../api/currency-api';
import { storage } from '../storage/storage';
import type { Rate } from '../types/currency';

jest.mock('../api/frankfurter', () => ({
  frankfurterClient: {
    getLatestRates: jest.fn(),
    getHistoricalRates: jest.fn(),
    clearCache: jest.fn(),
  },
}));

jest.mock('../api/currency-api', () => ({
  currencyApi: { latest: jest.fn(), onDate: jest.fn() },
}));

const latest = frankfurterClient.getLatestRates as jest.Mock;
const altLatest = currencyApi.latest as jest.Mock;
const altOnDate = currencyApi.onDate as jest.Mock;
const historical = frankfurterClient.getHistoricalRates as jest.Mock;

function rates(base: string, table: Record<string, number>, date = '2026-10-07'): Rate[] {
  return Object.entries(table).map(([quote, rate]) => ({ base, quote, rate, date, cachedAt: '' }));
}

describe('CurrencyService', () => {
  const service = CurrencyService.getInstance();

  beforeEach(() => {
    storage.clearAll();
    jest.resetAllMocks();
    historical.mockResolvedValue([
      { base: 'EUR', quote: 'USD', rate: 1.08, date: '2026-10-06', cachedAt: '' },
      { base: 'EUR', quote: 'USD', rate: 1.0854, date: '2026-10-07', cachedAt: '' },
    ]);
  });

  it('convertit EUR ↔ XOF par parité fixe, sans réseau', async () => {
    const info = await service.getRateInfo('EUR', 'XOF');
    expect(info.rate).toBeCloseTo(655.957, 6);
    expect(info.kind).toBe('peg');
    expect((await service.getRateInfo('XOF', 'EUR')).rate).toBeCloseTo(1 / 655.957, 9);
    expect((await service.getRateInfo('XOF', 'XAF')).rate).toBeCloseTo(1, 9);
    expect(latest).not.toHaveBeenCalled();
  });

  it('passe par l’euro pour USD → XOF', async () => {
    latest.mockResolvedValue(rates('USD', { EUR: 0.92 }));
    const info = await service.getRateInfo('USD', 'XOF');
    expect(latest).toHaveBeenCalledWith('USD');
    expect(info.rate).toBeCloseTo(0.92 * 655.957, 6);
    expect(info.pegged).toBe(true);
    expect(info.kind).toBe('live');
  });

  it('sert le cache de moins de 24 h sans rappeler l’API', async () => {
    latest.mockResolvedValue(rates('EUR', { USD: 1.0854 }));
    await service.getRateInfo('EUR', 'USD');
    await service.getRateInfo('EUR', 'USD');
    expect(latest).toHaveBeenCalledTimes(1);
  });

  it('calcule la variation depuis la publication précédente', async () => {
    latest.mockResolvedValue(rates('EUR', { USD: 1.0854 }));
    const info = await service.getRateInfo('EUR', 'USD');
    expect(info.change).toBeCloseTo((1.0854 / 1.08 - 1) * 100, 6);
  });

  it('retombe sur le dernier taux connu hors connexion', async () => {
    latest.mockResolvedValueOnce(rates('EUR', { USD: 1.0854 }));
    await service.getRateInfo('EUR', 'USD');
    latest.mockRejectedValueOnce(new Error('réseau'));
    const info = await service.getRateInfo('EUR', 'USD', { force: true });
    expect(info.kind).toBe('cached');
    expect(info.rate).toBe(1.0854);
  });

  it('échoue si aucun taux n’a jamais été récupéré', async () => {
    latest.mockRejectedValue(new Error('réseau'));
    await expect(service.getRateInfo('EUR', 'USD')).rejects.toThrow('réseau');
  });

  it('utilise la source alternative pour les devises hors BCE (NGN)', async () => {
    altLatest.mockResolvedValue({ date: '2026-10-08', rates: { NGN: 1500, USD: 1.12 } });
    altOnDate.mockResolvedValue({ date: '2026-10-07', rates: { NGN: 1485, USD: 1.12 } });
    const info = await service.getRateInfo('USD', 'NGN');
    expect(latest).not.toHaveBeenCalled();
    expect(info.source).toBe('alt');
    expect(info.rate).toBeCloseTo(1500 / 1.12, 6);
    expect(info.change).toBeCloseTo((1500 / 1485 - 1) * 100, 6);
  });

  it('combine parité fixe et source alternative (XOF → NGN)', async () => {
    altLatest.mockResolvedValue({ date: '2026-10-08', rates: { NGN: 1500 } });
    altOnDate.mockRejectedValue(new Error('réseau'));
    const info = await service.getRateInfo('XOF', 'NGN');
    expect(info.rate).toBeCloseTo(1500 / 655.957, 6);
    expect(info.pegged).toBe(true);
    expect(info.change).toBeUndefined();
  });

  it('efface les taux stockés', async () => {
    latest.mockResolvedValue(rates('EUR', { USD: 1.0854 }));
    await service.getRateInfo('EUR', 'USD');
    service.clearCache();
    expect(storage.getAllKeys().filter((k) => k.startsWith('rates_'))).toHaveLength(0);
  });
});
