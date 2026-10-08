/**
 * TabBar — bottom navigation on `panel`, with one glowing primary item (the FAB).
 */
import { cx } from '../runtime';
import { Icon } from './primitives';
import type { IconName } from '../icons';

export interface TabItem {
  id: string;
  icon: IconName;
  /** Accessible name (the bar shows icons only). */
  label: string;
  /** Renders as the centre FAB: violet→orchid gradient + `glow-fab`. One per bar. */
  primary?: boolean;
}

export interface TabBarProps {
  items: TabItem[];
  /** Id of the current destination. */
  activeId: string;
  onChange?: (id: string) => void;
}

/** Icon-only tab bar; the active tab is `panel-ink` with a violet dot, others `panel-muted`. */
export function TabBar({ items, activeId, onChange }: TabBarProps) {
  return (
    <nav className="cvx-tabbar" aria-label="Navigation principale">
      {items.map((it) => {
        const current = it.id === activeId;
        return (
          <button
            key={it.id}
            type="button"
            className={cx('cvx-tab', it.primary && 'cvx-tab--fab')}
            aria-label={it.label}
            title={it.label}
            aria-current={current ? 'page' : undefined}
            onClick={() => onChange?.(it.id)}
          >
            <Icon name={it.icon} size={it.primary ? 22 : 26} />
          </button>
        );
      })}
    </nav>
  );
}
