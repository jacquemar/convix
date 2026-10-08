import { useEffect, useState } from 'react';
import { AccessibilityInfo, Easing } from 'react-native';
import { motion, motionEasing } from './tokens';

/** Courbe du design system : cubic-bezier(.2, .8, .2, 1). */
export const easing = Easing.bezier(...motionEasing);

/** Durées du design system, ramenées à 0 quand « Réduire les animations » est actif. */
export function useMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => mounted && setReduced(value));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);
  return {
    reduced,
    press: reduced ? 0 : motion.press,
    select: reduced ? 0 : motion.select,
    swap: reduced ? 0 : motion.swap,
    caretBlink: motion.caretBlink,
  };
}
