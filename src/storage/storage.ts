import { createMMKV } from 'react-native-mmkv';

/** Instance MMKV unique de l'app (préférences, devises, cache des taux). */
export const storage = createMMKV();

export function readJson<T>(key: string): T | undefined {
  const raw = storage.getString(key);
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function writeJson(key: string, value: unknown): void {
  storage.set(key, JSON.stringify(value));
}
