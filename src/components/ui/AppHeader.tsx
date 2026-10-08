import React from 'react';
import { View } from 'react-native';
import { space, Text } from '../../theme';
import { fr } from '../../i18n/fr';
import { AppIcon } from './AppIcon';

export interface AppHeaderProps {
  /** Seconde ligne du lockup. Défaut « Convertisseur ». */
  subtitle?: string;
  /** Emplacement à droite (état hors connexion…). */
  trailing?: React.ReactNode;
}

/** Icône d'app + lockup en capitales sur deux lignes. */
export function AppHeader({ subtitle = fr.converter.subtitle, trailing }: AppHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space[3] }}>
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel={`${fr.app.name}, ${subtitle}`}
        style={{ flexDirection: 'row', alignItems: 'center', gap: space[3], flexShrink: 1 }}
      >
        <AppIcon size={40} />
        <Text variant="lockup" numberOfLines={2}>
          {fr.app.name}
          {subtitle ? `\n${subtitle}` : ''}
        </Text>
      </View>
      {trailing}
    </View>
  );
}
