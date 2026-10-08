import { storage } from './storage';

export type ThemePreference = 'system' | 'night' | 'day';

const THEME_KEY = 'theme_preference';
const HAPTICS_KEY = 'haptics_enabled';

export function getThemePreference(): ThemePreference {
  const value = storage.getString(THEME_KEY);
  return value === 'night' || value === 'day' ? value : 'system';
}

export function setThemePreference(value: ThemePreference): void {
  storage.set(THEME_KEY, value);
}

export function getHapticsEnabled(): boolean {
  return storage.getString(HAPTICS_KEY) !== 'false';
}

export function setHapticsEnabled(value: boolean): void {
  storage.set(HAPTICS_KEY, value ? 'true' : 'false');
}
