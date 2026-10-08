import { useCallback, useEffect, useRef, useState } from 'react';
import { currencyService } from '../services/currency.service';
import type { RateInfo } from '../types/currency';

export type RateStatus = 'loading' | 'ready' | 'unavailable';

/**
 * Taux de la paire affichée. Un seul chargement par changement de paire :
 * la conversion se fait ensuite localement, jamais un appel réseau par frappe.
 */
export function useRateInfo(from: string, to: string) {
  const [info, setInfo] = useState<RateInfo | undefined>(undefined);
  const [status, setStatus] = useState<RateStatus>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const request = useRef(0);

  const load = useCallback(
    async (force: boolean) => {
      const id = ++request.current;
      try {
        const next = await currencyService.getRateInfo(from, to, { force });
        if (id !== request.current) return;
        setInfo(next);
        setStatus('ready');
      } catch (error) {
        if (id !== request.current) return;
        console.error(error);
        setInfo(undefined);
        setStatus('unavailable');
      }
    },
    [from, to],
  );

  useEffect(() => {
    setStatus((s) => (info && info.from === from && info.to === to ? s : 'loading'));
    load(false);
    // `info` volontairement absent : on ne recharge que si la paire change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  }, [load]);

  return { info: matchPair(info, from, to), status, refreshing, refresh };
}

/**
 * Taux correspondant à la paire demandée. Juste après une inversion, le taux précédent
 * sert inversé en attendant le rechargement (pas de « 0 » fugace à l'écran).
 */
function matchPair(info: RateInfo | undefined, from: string, to: string): RateInfo | undefined {
  if (!info) return undefined;
  if (info.from === from && info.to === to) return info;
  if (info.from === to && info.to === from) {
    const change = info.change === undefined ? undefined : (1 / (1 + info.change / 100) - 1) * 100;
    return { ...info, from, to, rate: 1 / info.rate, change };
  }
  return undefined;
}
