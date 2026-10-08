import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Button, Chip, ConversionPair, HeroCard, Keypad, RateChip } from '../components/ui';
import { FocusStatusBar } from '../components/FocusStatusBar';
import { CurrencyPicker } from '../components/CurrencyPicker';
import { getCurrency } from '../data/currencies';
import { useRateInfo } from '../hooks/useRateInfo';
import { pair, usePair, type Side } from '../services/my-currencies';
import { radius, size, space, useTheme } from '../theme';
import { applyKey, formatRate, formatTime, parseRaw, toRaw, type KeypadKey } from '../utils/amount';
import type { RateInfo } from '../types/currency';
import { fr } from '../i18n/fr';

/** Le clavier chevauche le bas du hero (README : « environ 92px »). */
const KEYPAD_OVERLAP = 92;
const MIN_KEY = 52;

export function ConverterScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [fromCode, toCode] = usePair();
  const from = getCurrency(fromCode)!;
  const to = getCurrency(toCode)!;
  const [picking, setPicking] = useState<Side | null>(null);

  const [raw, setRaw] = useState('1');
  const [active, setActive] = useState<Side>('from');
  const { info, status, refreshing, refresh } = useRateInfo(from.code, to.code);

  const activeCurrency = active === 'from' ? from : to;
  const otherCurrency = active === 'from' ? to : from;

  // Une devise sans décimales ne garde pas de partie décimale saisie pour une autre.
  useEffect(() => {
    if (activeCurrency.decimals === 0 && raw.includes('.')) setRaw(raw.split('.')[0]);
  }, [activeCurrency.decimals, raw]);

  const otherRaw = useMemo(() => {
    if (!info) return '';
    const value = parseRaw(raw);
    return toRaw(active === 'from' ? value * info.rate : value / info.rate, otherCurrency.decimals);
  }, [info, raw, active, otherCurrency.decimals]);

  const onKey = useCallback(
    (key: KeypadKey) => setRaw((value) => applyKey(value, key, activeCurrency.decimals)),
    [activeCurrency.decimals],
  );

  /** Saisir de l'autre côté : la valeur convertie devient la nouvelle saisie. */
  const activate = (side: Side) => {
    if (side === active) return;
    setRaw(otherRaw);
    setActive(side);
  };

  /** Le montant saisi reste attaché à sa devise, qui change de ligne. */
  const swap = () => {
    pair.swap();
    setActive((side) => (side === 'from' ? 'to' : 'from'));
  };

  /** Choisir la devise d'un côté ; si elle est de l'autre côté, la paire s'inverse avec le montant. */
  const chooseCurrency = (code: string) => {
    if (!picking) return;
    if (code === (picking === 'from' ? to.code : from.code)) setActive((side) => (side === 'from' ? 'to' : 'from'));
    pair.set(picking, code);
    setPicking(null);
  };

  // Hauteur des touches ajustée à l'écran (74 px, jusqu'à 52 px sur les petits écrans).
  const [containerHeight, setContainerHeight] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const keyHeight =
    containerHeight && heroHeight
      ? Math.max(MIN_KEY, Math.min(size.key, Math.floor((containerHeight - heroHeight + KEYPAD_OVERLAP - space[4]) / 4)))
      : size.key;
  const compact = containerHeight > 0 && containerHeight < 640;

  const offline = info?.kind === 'cached' || status === 'unavailable';

  return (
    <View style={{ flex: 1, backgroundColor: colors.panel }} onLayout={(e: LayoutChangeEvent) => setContainerHeight(e.nativeEvent.layout.height)}>
      <FocusStatusBar style="light" />
      <ScrollView bounces={false} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <HeroCard
          flushTop
          onLayout={(e: LayoutChangeEvent) => setHeroHeight(e.nativeEvent.layout.height)}
          style={{ paddingTop: insets.top + space[4], paddingBottom: KEYPAD_OVERLAP + space[3] }}
        >
          <AppHeader trailing={offline ? <Chip label={fr.converter.offline} /> : null} />
          <View style={{ marginTop: compact ? space[4] : space[8] }}>
            <ConversionPair
              from={{ ...from, amount: active === 'from' ? raw : otherRaw }}
              to={{ ...to, amount: active === 'to' ? raw : otherRaw }}
              active={active}
              onActivate={activate}
              onChooseCurrency={setPicking}
              onSwap={swap}
            />
          </View>
          <View style={{ marginTop: space[4], flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: space[3] }}>
            <RateChip {...rateChipProps(info, status, from.code, to.code)} />
            {status === 'unavailable' && (
              <Button label={fr.converter.retry} variant="ghost" icon="refresh" loading={refreshing} onPress={refresh} />
            )}
          </View>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={{ width: 72, height: 3, marginTop: space[6], alignSelf: 'center', borderRadius: radius.full, backgroundColor: colors.heroLine }}
          />
        </HeroCard>
        <View style={{ marginTop: -KEYPAD_OVERLAP, marginHorizontal: space[6], marginBottom: space[4] }}>
          <Keypad onKey={onKey} keyHeight={keyHeight} decimalDisabled={activeCurrency.decimals === 0} />
        </View>
      </ScrollView>
      <CurrencyPicker
        side={picking}
        current={picking === 'to' ? to.code : from.code}
        other={picking === 'to' ? from.code : to.code}
        onSelect={chooseCurrency}
        onClose={() => setPicking(null)}
      />
    </View>
  );
}

function rateChipProps(info: RateInfo | undefined, status: string, from: string, to: string) {
  if (!info) {
    return status === 'unavailable'
      ? { status: fr.converter.unavailable, statusIcon: 'close' as const }
      : { status: fr.converter.loading };
  }
  const rates = { base: `1 ${from}`, quote: `${formatRate(info.rate)} ${to}` };
  if (info.kind === 'peg') return { ...rates, status: fr.converter.peg, statusIcon: 'check' as const };
  const freshness = info.kind === 'cached' ? fr.converter.offline : info.fetchedAt ? formatTime(info.fetchedAt) : undefined;
  return {
    ...rates,
    change: info.change,
    status: info.source === 'alt' ? [fr.converter.indicative, freshness].filter(Boolean).join(' · ') : freshness,
  };
}
