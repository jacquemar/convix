/**
 * Sheets and currency lists: Sheet, SectionTitle, CurrencyItem, SearchField.
 */
import type * as R from 'react';
import { React, cx } from '../runtime';
import { Flag, Icon, IconButton } from './primitives';

/* ----------------------------------------------------------------- Sheet */

export interface SheetProps extends R.HTMLAttributes<HTMLElement> {
  /** Centred uppercase title under the handle. */
  title?: string;
  /** Show the drag handle. Default true. */
  handle?: boolean;
  /** Fade the bottom of the scrolling body (long lists). Default false. */
  fade?: boolean;
}

/**
 * Bottom sheet on `sheet` with its `sheet-glow`, rounded top corners and a fixed drag handle.
 * Its body scrolls when the sheet is given a height (flex child or explicit height).
 */
export function Sheet({ title, handle = true, fade, className, children, ...rest }: SheetProps) {
  const titleId = React.useId();
  return (
    <section {...rest} className={cx('cvx-sheet', fade && 'cvx-sheet--fade', className)} aria-labelledby={title ? titleId : undefined}>
      {handle && <span className="cvx-sheet__handle" aria-hidden="true" />}
      <div className="cvx-sheet__body">
        {title && (
          <h2 id={titleId} className="cvx-section-title sheet-title">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- SectionTitle */

/** Centred uppercase section heading (`sheet-title`), e.g. "Ajouter". */
export function SectionTitle({ children, as = 'h3' }: { children: R.ReactNode; as?: 'h2' | 'h3' }) {
  const Tag = as;
  return <Tag className="cvx-section-title sheet-title">{children}</Tag>;
}

/* ---------------------------------------------------------- CurrencyItem */

export interface CurrencyItemProps {
  flag: string;
  /** Currency name, shown uppercase: "Franc CFA (BCEAO)". */
  name: string;
  /** ISO code, read with the name and shown in `meta` when no meta is given. */
  code: string;
  /** Second line in Manrope, e.g. "1 EUR = 655,957 XOF". */
  meta?: string;
  /** Trailing action: remove (−), add (+) or none. Default none. */
  action?: 'add' | 'remove' | 'none';
  onAction?: () => void;
  /** Row is the currently selected currency (check mark, accent name). */
  selected?: boolean;
  /** Row is unavailable (no rate): `ink-faint`, action disabled. */
  disabled?: boolean;
}

/** List row: flag, uppercase name, optional meta line and a round +/− button. */
export function CurrencyItem({ flag, name, code, meta, action = 'none', onAction, selected, disabled }: CurrencyItemProps) {
  return (
    <li className="cvx-item" data-selected={selected || undefined} data-disabled={disabled || undefined}>
      <Flag src={flag} alt="" />
      <span className="cvx-item__text">
        <span className="cvx-item__name currency-label">{name}</span>
        <span className="cvx-item__meta text-caption">{meta ?? code}</span>
      </span>
      {selected && <Icon name="check" size={20} title="Sélectionnée" className="cvx-item__check" />}
      {action !== 'none' && (
        <IconButton
          icon={action === 'add' ? 'plus' : 'minus'}
          label={`${action === 'add' ? 'Ajouter' : 'Retirer'} ${name} (${code})`}
          size="sm"
          disabled={disabled}
          onClick={onAction}
        />
      )}
    </li>
  );
}

/** `<ul>` wrapper for CurrencyItem rows. */
export function CurrencyList({ children, label }: { children: R.ReactNode; label?: string }) {
  return (
    <ul className="cvx-list" aria-label={label}>
      {children}
    </ul>
  );
}

/* ----------------------------------------------------------- SearchField */

export interface SearchFieldProps extends Omit<R.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (value: string) => void;
  /** Shows the microphone button and calls this when pressed. */
  onVoice?: () => void;
  /** Accessible name. Default "Rechercher une devise". */
  label?: string;
}

/** Glass search field with a voice button, for filtering currencies by name, code or country. */
export function SearchField({ value, onChange, onVoice, label = 'Rechercher une devise', placeholder = 'Rechercher…', ...rest }: SearchFieldProps) {
  return (
    <div className="cvx-search">
      <Icon name="search" size={20} className="cvx-search__lead" />
      <input
        {...rest}
        type="search"
        className="text-body"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />
      {onVoice && (
        <button type="button" className="cvx-search__voice" aria-label="Recherche vocale" title="Recherche vocale" onClick={onVoice}>
          <Icon name="mic" size={22} />
        </button>
      )}
    </div>
  );
}
