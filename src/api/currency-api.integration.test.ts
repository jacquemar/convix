import { currencyApi } from './currency-api';
import { CURRENCIES } from '../data/currencies';

describe('currencyApi (source alternative)', () => {
  it('fournit toutes les devises hors BCE de l’app', async () => {
    const table = await currencyApi.latest();
    expect(table.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const c of CURRENCIES.filter((c) => c.alt)) {
      expect(table.rates[c.code]).toBeGreaterThan(0);
    }
  });

  it('fournit les taux d’une date passée', async () => {
    const d = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const table = await currencyApi.onDate(d);
    expect(table.rates.NGN).toBeGreaterThan(0);
  });
});
