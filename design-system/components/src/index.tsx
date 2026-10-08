/**
 * Convix design system — React 18 component bundle.
 * Built to a classic IIFE that assigns `window.Convix` (see tools/build_bundle.sh).
 */
import { applyKey, formatAmount } from './runtime';
import { ICONS } from './icons';
import { Icon, Flag, AppIcon, Avatar, IconButton, Button, Divider } from './components/primitives';
import { HeroCard, AppHeader, CurrencyAmount, SwapButton, ConversionPair, RateChip } from './components/converter';
import { Keypad } from './components/keypad';
import { TabBar } from './components/navigation';
import { Sheet, SectionTitle, CurrencyItem, CurrencyList, SearchField } from './components/lists';

const Convix = {
  // surfaces & layout
  HeroCard,
  AppHeader,
  Sheet,
  SectionTitle,
  Divider,
  // conversion
  ConversionPair,
  CurrencyAmount,
  SwapButton,
  RateChip,
  Keypad,
  // lists & input
  CurrencyList,
  CurrencyItem,
  SearchField,
  // navigation & actions
  TabBar,
  Button,
  IconButton,
  // identity & media
  AppIcon,
  Avatar,
  Flag,
  Icon,
  // helpers
  formatAmount,
  applyKey,
  iconNames: Object.keys(ICONS),
};

const w = window as unknown as { Convix?: typeof Convix };
w.Convix = Object.assign(w.Convix ?? {}, Convix);
