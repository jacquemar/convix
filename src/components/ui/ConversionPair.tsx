import React from 'react';
import { View } from 'react-native';
import { space, useTheme } from '../../theme';
import { fr } from '../../i18n/fr';
import { CurrencyAmount } from './CurrencyAmount';
import { SwapButton } from './SwapButton';

export interface CurrencyValue {
  code: string;
  name: string;
  country: string;
  /** Montant brut avec « . ». */
  amount: string;
}

export interface ConversionPairProps {
  from: CurrencyValue;
  to: CurrencyValue;
  /** Côté qui reçoit la saisie. */
  active: 'from' | 'to';
  onActivate: (side: 'from' | 'to') => void;
  onChooseCurrency: (side: 'from' | 'to') => void;
  onSwap: () => void;
}

/** Les deux montants empilés, séparés par le bouton d'inversion et un filet. */
export function ConversionPair({ from, to, active, onActivate, onChooseCurrency, onSwap }: ConversionPairProps) {
  const { colors } = useTheme();
  return (
    <View>
      <CurrencyAmount
        {...from}
        active={active === 'from'}
        onActivate={() => onActivate('from')}
        onChooseCurrency={() => onChooseCurrency('from')}
        chooseLabel={fr.converter.chooseFrom(from.name)}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[4], marginVertical: space[2] }}>
        <SwapButton onSwap={onSwap} />
        <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
      </View>
      <CurrencyAmount
        {...to}
        active={active === 'to'}
        onActivate={() => onActivate('to')}
        onChooseCurrency={() => onChooseCurrency('to')}
        chooseLabel={fr.converter.chooseTo(to.name)}
      />
    </View>
  );
}
