// Stockage MMKV en mémoire pour les tests (le module natif n'existe pas sous Jest).
jest.mock('react-native-mmkv', () => {
  const createMMKV = () => {
    const store = new Map<string, string>();
    return {
      getString: (key: string) => store.get(key),
      set: (key: string, value: string | number | boolean) => store.set(key, String(value)),
      remove: (key: string) => store.delete(key),
      delete: (key: string) => store.delete(key),
      contains: (key: string) => store.has(key),
      getAllKeys: () => [...store.keys()],
      clearAll: () => store.clear(),
    };
  };
  return { createMMKV };
});
