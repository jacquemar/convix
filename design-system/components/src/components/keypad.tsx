/**
 * Keypad — the white numeric sheet. Emits keys; the parent owns the amount string
 * (use `applyKey` from the bundle to apply them).
 */
import { React } from '../runtime';
import { Icon } from './primitives';

export type KeypadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'back' | 'clear';

export interface KeypadProps {
  /** Called for every key. "." is always emitted for the decimal key, whatever is displayed. */
  onKey: (key: KeypadKey) => void;
  /** Character shown on the decimal key. Default ",". */
  decimalSeparator?: ',' | '.';
  /** Also listen to the physical keyboard (digits, , . Backspace Escape). Default false. */
  bindKeyboard?: boolean;
}

const ROWS: KeypadKey[] = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', 'back'];
const HOLD_MS = 500;

/** 3×4 grid on `panel`: digits in `keypad-digit`, decimal key, and a violet backspace (hold to clear). */
export function Keypad({ onKey, decimalSeparator = ',', bindKeyboard = false }: KeypadProps) {
  const hold = React.useRef<number | undefined>(undefined);
  const held = React.useRef(false);

  React.useEffect(() => {
    if (!bindKeyboard) return;
    const onDown = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) onKey(e.key as KeypadKey);
      else if (e.key === ',' || e.key === '.') onKey('.');
      else if (e.key === 'Backspace') onKey('back');
      else if (e.key === 'Escape') onKey('clear');
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onDown);
    return () => window.removeEventListener('keydown', onDown);
  }, [bindKeyboard, onKey]);

  const startHold = () => {
    held.current = false;
    hold.current = window.setTimeout(() => {
      held.current = true;
      onKey('clear');
    }, HOLD_MS);
  };
  const endHold = () => window.clearTimeout(hold.current);

  return (
    <div className="cvx-keypad" role="group" aria-label="Clavier numérique">
      {ROWS.map((k) =>
        k === 'back' ? (
          <button
            key={k}
            type="button"
            className="cvx-key cvx-key--back"
            aria-label="Effacer (maintenir pour tout effacer)"
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            onClick={() => {
              if (!held.current) onKey('back');
            }}
          >
            <Icon name="backspace" size={26} />
          </button>
        ) : (
          <button
            key={k}
            type="button"
            className="cvx-key keypad-digit"
            aria-label={k === '.' ? 'Virgule' : k}
            onClick={() => onKey(k)}
          >
            {k === '.' ? decimalSeparator : k}
          </button>
        ),
      )}
    </div>
  );
}
