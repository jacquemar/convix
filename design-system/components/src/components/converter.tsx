/**
 * The converter hero: HeroCard, AppHeader, CurrencyAmount, SwapButton, ConversionPair, RateChip.
 *
 * `HeroCard` remaps the theme tokens for its subtree (`--ink` → `--on-hero`, `--line-strong`
 * → `--hero-control-line`, `--rise` → `--rise-hero` …), so any Convix component placed inside
 * it reads correctly on the dark hero in both themes.
 */
import type * as R from 'react';
import { React, cx, formatAmount } from '../runtime';
import { AppIcon, Flag, Icon } from './primitives';

/* -------------------------------------------------------------- HeroCard */

export interface HeroCardProps extends R.HTMLAttributes<HTMLElement> {
  /** Round only the bottom corners (the hero touches the top of the screen). Default false. */
  flushTop?: boolean;
}

/** Dark gradient surface with plum and indigo glows — the brand moment of every screen. */
export function HeroCard({ flushTop, className, children, ...rest }: HeroCardProps) {
  return (
    <section {...rest} className={cx('cvx-hero', flushTop && 'cvx-hero--flush-top', className)}>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------- AppHeader */

export interface AppHeaderProps {
  /** First line of the lockup. Default "Convix". */
  title?: string;
  /** Second line of the lockup. Default "Convertisseur". Pass "" for a single line. */
  subtitle?: string;
  /** Right-hand slot, usually an `<Avatar/>`. */
  trailing?: R.ReactNode;
}

/** App icon + two-line uppercase lockup, with a trailing slot for the avatar. */
export function AppHeader({ title = 'Convix', subtitle = 'Convertisseur', trailing }: AppHeaderProps) {
  return (
    <header className="cvx-header">
      <div className="cvx-header__brand">
        <AppIcon size={40} title="" />
        <p className="cvx-lockup lockup">
          {title}
          {subtitle && <br />}
          {subtitle}
        </p>
      </div>
      {trailing}
    </header>
  );
}

/* -------------------------------------------------------- CurrencyAmount */

export interface CurrencyAmountProps {
  /** Flag image URL. */
  flag: string;
  /** ISO 4217 code shown beside the flag, e.g. "XOF". */
  code: string;
  /** Currency name for screen readers, e.g. "Franc CFA". */
  name?: string;
  /** Raw amount with "." as decimal point ("3999.5"); formatted for display. */
  amount: string;
  /** The row the keypad is typing into: shows the caret and tints the code. */
  active?: boolean;
  /** Display decimal separator. Default ",". */
  decimalSeparator?: ',' | '.';
  /** Makes the row a button that activates it. */
  onActivate?: () => void;
}

/** Type steps an amount walks down until it fits its row (`amount-xl` → `amount-lg` → `amount-md`). */
const AMOUNT_STEPS = ['amount-xl', 'amount-lg', 'amount-md'];

/**
 * Fits the amount to the row width by stepping down the amount type styles.
 * The size class is set on the DOM node directly (React never rewrites that className,
 * it is constant), and re-fitted on text change, resize and web-font load.
 */
function useFitAmount(text: string) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const fit = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // Content is right-aligned, so its overflow is on the start side and scrollWidth would not see it:
    // sum the children's layout widths (offsetWidth ignores CSS transforms, like clientWidth).
    const contentWidth = () =>
      Array.from(el.children).reduce((w, child) => {
        const cs = getComputedStyle(child);
        return w + (child as HTMLElement).offsetWidth + parseFloat(cs.marginLeft) + parseFloat(cs.marginRight);
      }, 0);
    for (const step of AMOUNT_STEPS) {
      el.classList.remove(...AMOUNT_STEPS);
      el.classList.add(step);
      if (contentWidth() <= el.clientWidth + 0.5) break;
    }
  }, []);
  React.useLayoutEffect(fit, [text, fit]);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(el);
    // Web fonts may start loading after mount (ready can resolve first): refit on every load.
    document.fonts?.ready.then(fit).catch(() => undefined);
    document.fonts?.addEventListener('loadingdone', fit);
    return () => {
      ro?.disconnect();
      document.fonts?.removeEventListener('loadingdone', fit);
    };
  }, [fit]);
  return ref;
}

/** One side of the conversion: flag, code and the big tabular amount (auto-fitted to the row). */
export function CurrencyAmount({ flag, code, name, amount, active, decimalSeparator = ',', onActivate }: CurrencyAmountProps) {
  const text = formatAmount(amount, decimalSeparator);
  const valueRef = useFitAmount(text);
  const content = (
    <>
      <Flag src={flag} alt="" />
      <span className="cvx-amount__code currency-label">{code}</span>
      <span className="cvx-amount__value" ref={valueRef}>
        <span>{text}</span>
        {active && <span className="cvx-caret" aria-hidden="true" />}
      </span>
    </>
  );
  const label = `${name ?? code} : ${text}`;
  return onActivate ? (
    <button type="button" className="cvx-amount" data-active={active ? 'true' : 'false'} aria-pressed={!!active} aria-label={label} onClick={onActivate}>
      {content}
    </button>
  ) : (
    <div className="cvx-amount" data-active={active ? 'true' : 'false'} aria-label={label} role="group">
      {content}
    </div>
  );
}

/* ------------------------------------------------------------ SwapButton */

export interface SwapButtonProps {
  onSwap?: () => void;
  /** Accessible name. Default "Inverser les devises". */
  label?: string;
}

/** Glass square that inverts the pair; the arrows turn half a turn on each press. */
export function SwapButton({ onSwap, label = 'Inverser les devises' }: SwapButtonProps) {
  const [turns, setTurns] = React.useState(0);
  return (
    <button
      type="button"
      className="cvx-swap"
      aria-label={label}
      title={label}
      onClick={() => {
        setTurns((t) => t + 1);
        onSwap?.();
      }}
    >
      <span className="cvx-swap__icon" style={{ transform: `rotate(${turns * 180}deg)` }}>
        <Icon name="swap" size={20} />
      </span>
    </button>
  );
}

/* -------------------------------------------------------- ConversionPair */

export interface CurrencyValue {
  flag: string;
  code: string;
  name?: string;
  amount: string;
}

export interface ConversionPairProps {
  from: CurrencyValue;
  to: CurrencyValue;
  /** Which side the keypad types into. Default "from". */
  active?: 'from' | 'to';
  onActivate?: (side: 'from' | 'to') => void;
  onSwap?: () => void;
  decimalSeparator?: ',' | '.';
}

/** The two amounts stacked, separated by the swap button and a hairline. */
export function ConversionPair({ from, to, active = 'from', onActivate, onSwap, decimalSeparator = ',' }: ConversionPairProps) {
  return (
    <div className="cvx-pair">
      <CurrencyAmount {...from} active={active === 'from'} decimalSeparator={decimalSeparator} onActivate={onActivate && (() => onActivate('from'))} />
      <div className="cvx-pair__mid">
        <SwapButton onSwap={onSwap} />
        <span className="cvx-pair__line" />
      </div>
      <CurrencyAmount {...to} active={active === 'to'} decimalSeparator={decimalSeparator} onActivate={onActivate && (() => onActivate('to'))} />
    </div>
  );
}

/* -------------------------------------------------------------- RateChip */

export interface RateChipProps {
  /** Left side of the rate, e.g. "1 EUR". */
  base: string;
  /** Right side of the rate, e.g. "655,957 XOF". */
  quote: string;
  /** 24h change in percent (signed). Omit to hide the trend. */
  change?: number;
  /** Optional time label, e.g. "11:30". */
  time?: string;
}

/** Live rate pill: pair, then a trend arrow + percentage (teal up, orange down — never colour alone). */
export function RateChip({ base, quote, change, time }: RateChipProps) {
  const trend = change === undefined ? null : change >= 0 ? 'up' : 'down';
  const pct = change === undefined ? '' : `${change >= 0 ? '+' : '−'}${Math.abs(change).toFixed(2).replace('.', ',')} %`;
  return (
    <span className="cvx-rate text-caption">
      <span className="cvx-rate__pair">
        {base} = {quote}
      </span>
      {trend && (
        <span className="cvx-rate__delta" data-trend={trend}>
          <Icon name={trend === 'up' ? 'trend-up' : 'trend-down'} size={14} title={trend === 'up' ? 'En hausse' : 'En baisse'} />
          {pct}
        </span>
      )}
      {time && (
        <span className="cvx-rate__time">
          <Icon name="clock" size={14} />
          {time}
        </span>
      )}
    </span>
  );
}
