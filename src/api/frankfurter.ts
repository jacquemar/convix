import { Rate } from '../types/currency';

const API_BASE_URL = 'https://api.frankfurter.dev/v1';

export interface FrankfurterLatestResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface FrankfurterHistoricalResponse {
  amount: number;
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, Record<string, number>>;
}

export interface FrankfurterCurrenciesResponse {
  [key: string]: string;
}

export interface FrankfurterErrorResponse {
  error: string;
}

export class FrankfurterClient {
  private static instance: FrankfurterClient;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): FrankfurterClient {
    if (!FrankfurterClient.instance) {
      FrankfurterClient.instance = new FrankfurterClient();
    }
    return FrankfurterClient.instance;
  }

  private getCacheKey(endpoint: string, params: Record<string, string>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(k => `${k}=${params[k]}`)
      .join('&');
    return `${endpoint}?${sortedParams}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private async fetchWithErrorHandling<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Erreur API (${response.status}): `;
        switch (response.status) {
          case 400:
            errorMessage += 'Requête invalide. Vérifiez les paramètres.';
            break;
          case 404:
            errorMessage += 'Ressource non trouvée.';
            break;
          case 429:
            errorMessage += 'Trop de requêtes. Réessayez plus tard.';
            break;
          case 500:
            errorMessage += 'Erreur serveur. Réessayez plus tard.';
            break;
          case 503:
            errorMessage += 'Service indisponible. Réessayez plus tard.';
            break;
          default:
            errorMessage += 'Une erreur est survenue.';
        }
        throw new Error(errorMessage);
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Délai d\'attente dépassé. Vérifiez votre connexion.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion Internet.');
        }
        throw error;
      }
      throw new Error('Une erreur inattendue est survenue.');
    }
  }

  async getLatestRates(base: string = 'USD'): Promise<Rate[]> {
    const cacheKey = this.getCacheKey('latest', { from: base });
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as Rate[];
    }

    const url = `${API_BASE_URL}/latest?from=${encodeURIComponent(base)}`;
    const response = await this.fetchWithErrorHandling<FrankfurterLatestResponse>(url);

    const rates: Rate[] = Object.entries(response.rates).map(([quote, rate]) => ({
      base: response.base,
      quote,
      rate,
      date: response.date,
      cachedAt: new Date().toISOString(),
    }));

    this.cache.set(cacheKey, { data: rates, timestamp: Date.now() });
    return rates;
  }

  /** Devises publiées par la BCE : code ISO → nom anglais. */
  async getCurrencies(): Promise<FrankfurterCurrenciesResponse> {
    const cacheKey = this.getCacheKey('currencies', {});
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as FrankfurterCurrenciesResponse;
    }

    const url = `${API_BASE_URL}/currencies`;
    const response = await this.fetchWithErrorHandling<FrankfurterCurrenciesResponse>(url);
    this.cache.set(cacheKey, { data: response, timestamp: Date.now() });
    return response;
  }

  async getHistoricalRates(
    base: string,
    quote: string,
    startDate: string,
    endDate: string
  ): Promise<Rate[]> {
    // Validation des dates
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      throw new Error('Format de date invalide. Utilisez YYYY-MM-DD.');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start > end) {
      throw new Error('La date de début doit être antérieure à la date de fin.');
    }

    if (start > now) {
      throw new Error('La date de début ne peut pas être dans le futur.');
    }

    // Limiter la période à 1 an (366 jours pour inclure les années bissextiles)
    const maxPeriod = 366 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > maxPeriod) {
      throw new Error('La période ne peut pas dépasser 1 an.');
    }

    const cacheKey = this.getCacheKey(`${startDate}..${endDate}`, { from: base, to: quote });
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data as Rate[];
    }

    const url = `${API_BASE_URL}/${startDate}..${endDate}?from=${encodeURIComponent(base)}&to=${encodeURIComponent(quote)}`;
    const response = await this.fetchWithErrorHandling<FrankfurterHistoricalResponse>(url);

    const rates: Rate[] = Object.entries(response.rates).map(([date, rateData]) => ({
      base: response.base,
      quote,
      rate: rateData[quote],
      date,
      cachedAt: new Date().toISOString(),
    }));

    this.cache.set(cacheKey, { data: rates, timestamp: Date.now() });
    return rates;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const frankfurterClient = FrankfurterClient.getInstance();