import React from 'react';
import { View } from 'react-native';
import { radius, space, Text, useTheme } from '../../theme';
import { formatChange } from '../../utils/amount';
import { fr } from '../../i18n/fr';
import { Icon, type IconName } from './Icon';

export interface RateChipProps {
  /** Côté gauche du taux, ex. « 1 EUR ». */
  base?: string;
  /** Côté droit, ex. « 655,957 XOF ». */
  quote?: string;
  /** Variation signée en %, omise pour masquer la tendance. */
  change?: number;
  /** Fraîcheur ou état : « 11:30 », « Parité fixe », « Hors connexion »… */
  status?: string;
  statusIcon?: IconName;
}

/** Pastille du taux : paire, puis flèche + pourcentage (sarcelle / orange, jamais la couleur seule). */
export function RateChip({ base, quote, change, status, statusIcon = 'clock' }: RateChipProps) {
  const { colors } = useTheme();
  const trend = change === undefined ? null : change >= 0 ? 'up' : 'down';
  const trendColor = trend === 'up' ? 'rise' : 'fall';
  const parts = [
    base && quote ? `${base} = ${quote}` : null,
    trend ? `${trend === 'up' ? fr.converter.trendUp : fr.converter.trendDown} ${formatChange(change!)}` : null,
    status,
  ].filter(Boolean);

  return (
    <View
      accessible
      accessibilityLabel={parts.join(', ')}
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        rowGap: space[1],
        columnGap: space[3],
        minHeight: 28,
        paddingVertical: space[1],
        paddingHorizontal: space[3],
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.line,
        backgroundColor: colors.glass,
      }}
    >
      {base && quote ? (
        <Text variant="text-caption">
          {base} = {quote}
        </Text>
      ) : null}
      {trend && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Icon name={trend === 'up' ? 'trend-up' : 'trend-down'} size={14} color={trendColor} />
          <Text variant="text-caption" color={trendColor} style={{ fontFamily: 'Manrope_700Bold' }}>
            {formatChange(change!)}
          </Text>
        </View>
      )}
      {status ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          <Icon name={statusIcon} size={14} color="inkMuted" />
          <Text variant="text-caption" color="inkMuted">
            {status}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
