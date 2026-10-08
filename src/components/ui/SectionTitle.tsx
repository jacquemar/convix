import React from 'react';
import { space, Text } from '../../theme';

/** Titre de section centré en capitales (`sheet-title`), ex. « Ajouter ». */
export function SectionTitle({ children, first }: { children: string; first?: boolean }) {
  return (
    <Text
      variant="sheet-title"
      accessibilityRole="header"
      style={{ textAlign: 'center', marginTop: first ? space[6] : space[8], marginBottom: space[4] }}
    >
      {children}
    </Text>
  );
}
