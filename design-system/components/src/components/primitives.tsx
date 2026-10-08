/**
 * Convix primitives: Icon, Flag, AppIcon, Avatar, IconButton, Button, Divider.
 * Every colour comes from tokens.css custom properties; nothing is hard-coded here.
 */
import type * as R from 'react';
import { React, cx } from '../runtime';
import { ICONS, type IconName } from '../icons';
import { MARK_PATH } from '../brand';

/* ------------------------------------------------------------------ Icon */

export interface IconProps {
  /** Icon from the Convix set (24px grid, 1.75 stroke). */
  name: IconName;
  /** Rendered size in px. Default 24. */
  size?: number;
  /** Accessible name. Omit for decorative icons (aria-hidden). */
  title?: string;
  className?: string;
}

/** Inline SVG icon drawn with `currentColor` — set `color` on a parent to tint it. */
export function Icon({ name, size = 24, title, className }: IconProps) {
  return (
    <svg
      className={cx('cvx-icon', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

/* ------------------------------------------------------------------ Flag */

export interface FlagProps {
  /** URL of a square or circular flag image (SVG preferred). */
  src: string;
  /** Country or currency, e.g. "Côte d'Ivoire". Empty string when a visible label sits beside it. */
  alt?: string;
  /** Diameter in px. Default 36 (`size-flag`). */
  size?: number;
  className?: string;
}

/** A circular flag with a hairline ring so light flags never melt into light grounds. */
export function Flag({ src, alt = '', size, className }: FlagProps) {
  const style = size ? { width: size, height: size } : undefined;
  return <img className={cx('cvx-flag', className)} src={src} alt={alt} style={style} draggable={false} />;
}

/* --------------------------------------------------------------- AppIcon */

export interface AppIconProps {
  /** Edge length in px. Default 40 (`size-avatar`). */
  size?: number;
  /** `brand` = violet→orchid tile with a white mark; `dark` = hero tile with a gradient mark. */
  variant?: 'brand' | 'dark';
  /** Accessible name; defaults to "Convix". Pass "" when the name is written beside it. */
  title?: string;
}

/** The Convix app icon: the split-C mark on its tile, drawn inline (no asset request). */
export function AppIcon({ size = 40, variant = 'brand', title = 'Convix' }: AppIconProps) {
  const id = React.useId().replace(/:/g, '');
  const tile = `cvx-tile-${id}`;
  const mark = `cvx-mark-${id}`;
  const glow = `cvx-glow-${id}`;
  return (
    <svg
      className="cvx-appicon"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={tile} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--violet)" }} />
          <stop offset="1" style={{ stopColor: "var(--orchid)" }} />
        </linearGradient>
        <linearGradient id={mark} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--lilac)" }} />
          <stop offset=".5" style={{ stopColor: "var(--violet)" }} />
          <stop offset="1" style={{ stopColor: "var(--orchid)" }} />
        </linearGradient>
        <radialGradient id={glow} cx=".2" cy=".1" r=".9">
          <stop offset="0" style={{ stopColor: "var(--on-violet)", stopOpacity: variant === 'brand' ? 0.35 : 0 }} />
          <stop offset=".6" style={{ stopColor: "var(--on-violet)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14.4" style={{ fill: variant === 'brand' ? `url(#${tile})` : 'var(--hero-base)' }} />
      <rect width="64" height="64" rx="14.4" fill={`url(#${glow})`} />
      {variant === 'dark' && <rect x=".5" y=".5" width="63" height="63" rx="14" fill="none" style={{ stroke: 'var(--hero-control-line)' }} strokeOpacity={0.5} />}
      <path
        d={MARK_PATH}
        transform="translate(12.16 12.16) scale(.62)"
        style={{ fill: variant === 'brand' ? 'var(--on-violet)' : `url(#${mark})` }}
      />
    </svg>
  );
}

/* ---------------------------------------------------------------- Avatar */

export interface AvatarProps {
  /** Photo URL. Without it the initials are shown. */
  src?: string;
  /** One or two letters shown when there is no photo. */
  initials?: string;
  /** Accessible name, e.g. the person's name. */
  alt?: string;
  /** Edge length in px. Default 40 (`size-avatar`). */
  size?: number;
}

/** The profile tile from the header: a white rounded square holding a photo or initials. */
export function Avatar({ src, initials = '', alt = '', size }: AvatarProps) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <span className="cvx-avatar" style={style} role={alt ? 'img' : undefined} aria-label={alt || undefined}>
      {src ? <img src={src} alt="" /> : <span aria-hidden="true">{initials.slice(0, 2).toUpperCase()}</span>}
    </span>
  );
}

/* ------------------------------------------------------------ IconButton */

export interface IconButtonProps extends R.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  /** Accessible name — required, the button has no visible text. */
  label: string;
  /** `outline` (lists), `glass` (on hero / sheets), `violet` (primary). Default `outline`. */
  variant?: 'outline' | 'glass' | 'violet';
  /** 28 / 36 / 44 px. The hit area is always at least 44px. Default `md`. */
  size?: 'sm' | 'md' | 'lg';
}

/** Round icon-only button; its touch target is padded to 44px whatever its drawn size. */
export function IconButton({ icon, label, variant = 'outline', size = 'md', className, type = 'button', ...rest }: IconButtonProps) {
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 22;
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={cx('cvx-iconbtn', `cvx-iconbtn--${variant}`, `cvx-iconbtn--${size}`, className)}
    >
      <Icon name={icon} size={iconSize} />
    </button>
  );
}

/* ---------------------------------------------------------------- Button */

export interface ButtonProps extends R.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` = violet fill; `secondary` = glass with a border; `ghost` = accent text only. */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Optional leading icon. */
  icon?: IconName;
  /** Stretch to the container width. */
  block?: boolean;
}

/** Pill button with an uppercase Unbounded label (`button-label`). */
export function Button({ variant = 'primary', icon, block, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button {...rest} type={type} className={cx('cvx-btn', 'button-label', `cvx-btn--${variant}`, block && 'cvx-btn--block', className)}>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  );
}

/* --------------------------------------------------------------- Divider */

/** Hairline separator in `line` (inherits the hero/panel remap of its container). */
export function Divider({ className }: { className?: string }) {
  return <hr className={cx('cvx-divider', className)} />;
}
