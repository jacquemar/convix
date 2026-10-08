import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, View, type LayoutChangeEvent } from 'react-native';
import { radius, space, Text, typeStyles, type TypeStyleName, useMotion, useTheme } from '../../theme';
import { formatAmount } from '../../utils/amount';
import { fr } from '../../i18n/fr';
import { Flag } from './Flag';
import { Icon } from './Icon';

export interface CurrencyAmountProps {
  country: string;
  /** Code ISO 4217 affiché à côté du drapeau. */
  code: string;
  /** Nom de la devise, lu par le lecteur d'écran. */
  name: string;
  /** Montant brut avec « . » ("3999.5"). */
  amount: string;
  /** Côté qui reçoit la saisie du clavier : caret + code en `accent`. */
  active?: boolean;
  onActivate?: () => void;
  /** Toucher le drapeau / code : changer de devise. */
  onChooseCurrency?: () => void;
  /** Libellé accessible de la zone devise (« Devise source : Euro. Changer »). */
  chooseLabel?: string;
}

/** Paliers typographiques descendus jusqu'à ce que le montant tienne dans sa ligne. */
const STEPS: TypeStyleName[] = ['amount-xl', 'amount-lg', 'amount-md'];
const CARET_SPACE = 3 + space[1];

/**
 * Deux zones : drapeau + code + chevron (changer de devise) et grand montant tabulaire
 * ajusté à la largeur de la ligne (saisir de ce côté).
 */
export function CurrencyAmount({ country, code, name, amount, active, onActivate, onChooseCurrency, chooseLabel }: CurrencyAmountProps) {
  const text = formatAmount(amount);
  const [available, setAvailable] = useState(0);
  const [naturalXl, setNaturalXl] = useState(0);

  // La largeur d'un texte est proportionnelle à sa taille : on mesure une fois en amount-xl.
  const step =
    available && naturalXl
      ? STEPS.find((s) => (naturalXl * typeStyles[s].fontSize) / typeStyles['amount-xl'].fontSize + CARET_SPACE <= available) ?? 'amount-md'
      : 'amount-xl';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: 72, paddingVertical: space[2] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={chooseLabel ?? name}
        onPress={onChooseCurrency}
        hitSlop={{ top: space[2], bottom: space[2] }}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[2],
          paddingVertical: space[1],
          paddingRight: space[1],
          borderRadius: radius.md,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Flag country={country} />
        <Text variant="currency-label" color={active ? 'accent' : 'ink'}>
          {code}
        </Text>
        <View style={{ transform: [{ rotate: '90deg' }] }}>
          <Icon name="chevron-right" size={16} color="inkMuted" />
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name} : ${text}`}
        accessibilityState={{ selected: !!active }}
        accessibilityHint={fr.converter.activateHint}
        onPress={onActivate}
        style={{ flex: 1, minWidth: 0, alignSelf: 'stretch', justifyContent: 'center' }}
      >
        <View
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' }}
          onLayout={(e: LayoutChangeEvent) => setAvailable(e.nativeEvent.layout.width)}
        >
          <Text variant={step} numberOfLines={1}>
            {text}
          </Text>
          {active && <Caret fontSize={typeStyles[step].fontSize} />}
          {/* Mesure hors écran de la largeur naturelle en amount-xl. */}
          <View style={{ position: 'absolute', left: 0, top: 0, width: 4000, flexDirection: 'row', opacity: 0 }} pointerEvents="none">
            <Text
              variant="amount-xl"
              accessibilityElementsHidden
              importantForAccessibility="no"
              onLayout={(e: LayoutChangeEvent) => setNaturalXl(e.nativeEvent.layout.width)}
            >
              {text}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

/** Caret clignotant (1,1 s, en paliers) ; fixe si « Réduire les animations » est actif. */
function Caret({ fontSize }: { fontSize: number }) {
  const { colors } = useTheme();
  const { reduced, caretBlink } = useMotion();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduced) {
      opacity.setValue(1);
      return;
    }
    const half = caretBlink / 2;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.delay(half),
        Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.delay(half),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, caretBlink, opacity]);

  return (
    <Animated.View
      style={{
        width: 3,
        height: fontSize * 0.78,
        marginLeft: space[1],
        borderRadius: radius.full,
        backgroundColor: colors.accent,
        opacity,
      }}
    />
  );
}
