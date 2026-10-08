import type * as React from 'react';

/** Icon names of the Convix set (24px grid, 1.75 stroke, round caps). */
export type IconName =
  | 'home' | 'globe' | 'keypad' | 'bell' | 'settings' | 'swap' | 'search' | 'mic' | 'plus' | 'minus'
  | 'backspace' | 'trend-up' | 'trend-down' | 'clock' | 'star' | 'refresh' | 'chevron-right' | 'close' | 'check';

/* ---------------------------------------------------------------- Surfaces */

export interface HeroCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Round only the bottom corners (hero touching the top of the screen). Default false. */
  flushTop?: boolean;
}
/** Dark gradient surface (`hero-base` + plum/indigo glows). Remaps theme tokens to their hero values for its children. */
export declare function HeroCard(props: HeroCardProps): React.ReactElement;

export interface AppHeaderProps {
  /** First lockup line. Default "Convix". */
  title?: string;
  /** Second lockup line. Default "Convertisseur"; "" for a single line. */
  subtitle?: string;
  /** Right-hand slot, usually an Avatar. */
  trailing?: React.ReactNode;
}
export declare function AppHeader(props: AppHeaderProps): React.ReactElement;

export interface SheetProps extends React.HTMLAttributes<HTMLElement> {
  /** Centred uppercase title under the handle. */
  title?: string;
  /** Show the drag handle. Default true. */
  handle?: boolean;
  /** Fade the bottom of the scrolling body. Default false. */
  fade?: boolean;
}
export declare function Sheet(props: SheetProps): React.ReactElement;

export interface SectionTitleProps { children: React.ReactNode; as?: 'h2' | 'h3' }
export declare function SectionTitle(props: SectionTitleProps): React.ReactElement;

export interface DividerProps { className?: string }
export declare function Divider(props: DividerProps): React.ReactElement;

/* -------------------------------------------------------------- Conversion */

export interface CurrencyValue {
  /** Flag image URL. */
  flag: string;
  /** ISO 4217 code, e.g. "XOF". */
  code: string;
  /** Currency name for screen readers. */
  name?: string;
  /** Raw amount, "." as decimal point ("3999.5"). */
  amount: string;
}

export interface CurrencyAmountProps extends CurrencyValue {
  /** The side the keypad types into: caret + accent code. */
  active?: boolean;
  /** Displayed decimal separator. Default ",". */
  decimalSeparator?: ',' | '.';
  /** Makes the row a button. */
  onActivate?: () => void;
}
/** Flag + code + big tabular amount; steps down amount-xl → amount-lg → amount-md to fit. */
export declare function CurrencyAmount(props: CurrencyAmountProps): React.ReactElement;

export interface SwapButtonProps {
  onSwap?: () => void;
  /** Accessible name. Default "Inverser les devises". */
  label?: string;
}
export declare function SwapButton(props: SwapButtonProps): React.ReactElement;

export interface ConversionPairProps {
  from: CurrencyValue;
  to: CurrencyValue;
  /** Side receiving keypad input. Default "from". */
  active?: 'from' | 'to';
  onActivate?: (side: 'from' | 'to') => void;
  onSwap?: () => void;
  decimalSeparator?: ',' | '.';
}
export declare function ConversionPair(props: ConversionPairProps): React.ReactElement;

export interface RateChipProps {
  /** "1 EUR" */
  base: string;
  /** "655,957 XOF" */
  quote: string;
  /** Signed 24h change in percent; omit to hide the trend. */
  change?: number;
  /** Time or freshness label, e.g. "11:30". */
  time?: string;
}
export declare function RateChip(props: RateChipProps): React.ReactElement;

export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'back' | 'clear';
export interface KeypadProps {
  /** Receives every key; the decimal key always emits ".". Hold backspace emits "clear". */
  onKey: (key: KeypadKey) => void;
  /** Character shown on the decimal key. Default ",". */
  decimalSeparator?: ',' | '.';
  /** Listen to the physical keyboard too. Default false. */
  bindKeyboard?: boolean;
}
export declare function Keypad(props: KeypadProps): React.ReactElement;

/* ---------------------------------------------------------- Lists & input */

export interface CurrencyListProps { children: React.ReactNode; label?: string }
/** `<ul>` wrapper for CurrencyItem rows. */
export declare function CurrencyList(props: CurrencyListProps): React.ReactElement;

export interface CurrencyItemProps {
  flag: string;
  /** Shown uppercase. */
  name: string;
  code: string;
  /** Second line (Manrope); defaults to the code. */
  meta?: string;
  /** Trailing round button. Default "none". */
  action?: 'add' | 'remove' | 'none';
  onAction?: () => void;
  selected?: boolean;
  disabled?: boolean;
}
export declare function CurrencyItem(props: CurrencyItemProps): React.ReactElement;

export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
  /** Shows the microphone button. */
  onVoice?: () => void;
  /** Accessible name. Default "Rechercher une devise". */
  label?: string;
}
export declare function SearchField(props: SearchFieldProps): React.ReactElement;

/* ---------------------------------------------------- Navigation & actions */

export interface TabItem {
  id: string;
  icon: IconName;
  /** Accessible name (icons only on screen). */
  label: string;
  /** The glowing centre FAB. One per bar. */
  primary?: boolean;
}
export interface TabBarProps {
  items: TabItem[];
  activeId: string;
  onChange?: (id: string) => void;
}
export declare function TabBar(props: TabBarProps): React.ReactElement;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: IconName;
  block?: boolean;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Required accessible name. */
  label: string;
  variant?: 'outline' | 'glass' | 'violet';
  /** 28 / 36 / 44 px drawn; hit area always ≥ 44px. */
  size?: 'sm' | 'md' | 'lg';
}
export declare function IconButton(props: IconButtonProps): React.ReactElement;

/* ------------------------------------------------------- Identity & media */

export interface AppIconProps {
  /** Default 40. */
  size?: number;
  variant?: 'brand' | 'dark';
  /** Accessible name. Default "Convix"; "" when the name is written beside it. */
  title?: string;
}
export declare function AppIcon(props: AppIconProps): React.ReactElement;

export interface AvatarProps { src?: string; initials?: string; alt?: string; size?: number }
export declare function Avatar(props: AvatarProps): React.ReactElement;

export interface FlagProps { src: string; alt?: string; size?: number; className?: string }
export declare function Flag(props: FlagProps): React.ReactElement;

export interface IconProps { name: IconName; size?: number; title?: string; className?: string }
export declare function Icon(props: IconProps): React.ReactElement;

/* ----------------------------------------------------------------- Helpers */

/** "3999.5" → "3 999,5" (narrow no-break space grouping for ","). */
export declare function formatAmount(raw: string, decimalSeparator?: ',' | '.'): string;
/** Applies a keypad key to a raw amount string (max 12 digits, 2 decimals). */
export declare function applyKey(raw: string, key: string, maxLength?: number): string;

declare global {
  interface Window {
    Convix: {
      HeroCard: typeof HeroCard; AppHeader: typeof AppHeader; Sheet: typeof Sheet; SectionTitle: typeof SectionTitle;
      Divider: typeof Divider; ConversionPair: typeof ConversionPair; CurrencyAmount: typeof CurrencyAmount;
      SwapButton: typeof SwapButton; RateChip: typeof RateChip; Keypad: typeof Keypad; CurrencyList: typeof CurrencyList;
      CurrencyItem: typeof CurrencyItem; SearchField: typeof SearchField; TabBar: typeof TabBar; Button: typeof Button;
      IconButton: typeof IconButton; AppIcon: typeof AppIcon; Avatar: typeof Avatar; Flag: typeof Flag; Icon: typeof Icon;
      formatAmount: typeof formatAmount; applyKey: typeof applyKey; iconNames: IconName[];
    };
  }
}
