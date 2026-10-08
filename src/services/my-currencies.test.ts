import { myCurrencies, pair } from './my-currencies';
import { storage } from '../storage/storage';

describe('my-currencies', () => {
  beforeEach(() => {
    storage.clearAll();
  });

  it('démarre sur XOF → EUR, avec XOF, EUR, USD en favoris', () => {
    myCurrencies.reload();
    expect(pair.get()).toEqual(['XOF', 'EUR']);
    expect(myCurrencies.get()).toEqual(['XOF', 'EUR', 'USD']);
  });

  it('migre la paire et les favoris du tout premier modèle', () => {
    storage.set('selected_source_currency', 'USD');
    storage.set('selected_target_currency', 'EUR');
    storage.set('favorite_currencies', JSON.stringify(['GBP', 'EUR', 'XXX']));
    myCurrencies.reload();
    expect(pair.get()).toEqual(['USD', 'EUR']);
    expect(myCurrencies.get()).toEqual(['USD', 'EUR', 'GBP', 'XOF']);
    expect(storage.getString('favorite_currencies')).toBeUndefined();
  });

  it('reprend la paire de la liste ordonnée (version précédente)', () => {
    storage.set('my_currencies', JSON.stringify(['GBP', 'JPY', 'EUR']));
    myCurrencies.reload();
    expect(pair.get()).toEqual(['GBP', 'JPY']);
    expect(myCurrencies.get()).toEqual(['GBP', 'JPY', 'EUR']);
  });

  it('ajoute et retire des favoris sans toucher à la paire', () => {
    myCurrencies.reload();
    myCurrencies.add('NGN');
    myCurrencies.remove('XOF');
    myCurrencies.remove('EUR');
    expect(myCurrencies.get()).toEqual(['USD', 'NGN']);
    expect(pair.get()).toEqual(['XOF', 'EUR']);
  });

  it('choisit une devise par côté, et inverse si elle est déjà de l’autre côté', () => {
    myCurrencies.reload();
    pair.set('to', 'NGN');
    expect(pair.get()).toEqual(['XOF', 'NGN']);
    pair.set('from', 'NGN');
    expect(pair.get()).toEqual(['NGN', 'XOF']);
    pair.swap();
    expect(pair.get()).toEqual(['XOF', 'NGN']);
  });
});
