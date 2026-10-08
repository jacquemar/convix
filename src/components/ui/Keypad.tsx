import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PanelScope, radius, Text, useTheme } from '../../theme';
import type { KeypadKey } from '../../utils/amount';
import { fr } from '../../i18n/fr';
import { Icon } from './Icon';

const ROWS: KeypadKey[][] = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['0', '.', 'back'],
];
const HOLD_MS = 500;

export interface KeypadProps {
  /** Reçoit chaque touche ; la touche décimale émet toujours « . ». Appui long sur effacer : « clear ». */
  onKey: (key: KeypadKey) => void;
  /** Hauteur d'une touche (74 par défaut, moins en mode compact). */
  keyHeight: number;
  /** La devise active n'a pas de décimales : la virgule est inactive. */
  decimalDisabled?: boolean;
}

/** Grille 3×4 sur `panel` : chiffres en `keypad-digit`, virgule, effacer violet (maintenir pour tout effacer). */
export function Keypad(props: KeypadProps) {
  return (
    <PanelScope>
      <KeypadGrid {...props} />
    </PanelScope>
  );
}

function KeypadGrid({ onKey, keyHeight, decimalDisabled }: KeypadProps) {
  const { colors, shadows, hapticsEnabled } = useTheme();

  const press = useCallback(
    (key: KeypadKey) => {
      if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      onKey(key);
    },
    [hapticsEnabled, onKey],
  );

  return (
    <View
      accessibilityLabel={fr.converter.keypad}
      style={{ borderRadius: radius.lg, backgroundColor: colors.panel, boxShadow: shadows.shadowPanel }}
    >
      <View style={{ borderRadius: radius.lg, overflow: 'hidden' }}>
        {ROWS.map((row, r) => (
          <View key={r} style={{ flexDirection: 'row' }}>
            {row.map((key, c) => {
              const disabled = key === '.' && decimalDisabled;
              return (
                <Pressable
                  key={key}
                  accessibilityRole="keyboardkey"
                  accessibilityLabel={key === 'back' ? fr.converter.backspace : key === '.' ? fr.converter.decimal : key}
                  accessibilityState={{ disabled: !!disabled }}
                  disabled={disabled}
                  onPress={() => press(key)}
                  onLongPress={key === 'back' ? () => press('clear') : undefined}
                  delayLongPress={HOLD_MS}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: keyHeight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: pressed ? colors.panelPressed : colors.panel,
                    borderRightWidth: c < 2 ? 1 : 0,
                    borderBottomWidth: r < ROWS.length - 1 ? 1 : 0,
                    borderColor: colors.panelLine,
                  })}
                >
                  {key === 'back' ? (
                    <Icon name="backspace" size={26} color="violet" />
                  ) : (
                    <Text variant="keypad-digit" color={disabled ? 'inkFaint' : 'ink'}>
                      {key === '.' ? ',' : key}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
