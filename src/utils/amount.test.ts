import { applyKey, formatAmount, formatChange, formatRate, NNBSP, toRaw } from './amount';

describe('formatAmount', () => {
  it('groupe les milliers avec une espace fine et utilise la virgule', () => {
    expect(formatAmount('3999.5')).toBe(`3${NNBSP}999,5`);
    expect(formatAmount('414565')).toBe(`414${NNBSP}565`);
  });
  it('affiche 0 pour une saisie vide et garde la virgule finale pendant la saisie', () => {
    expect(formatAmount('')).toBe('0');
    expect(formatAmount('12.')).toBe('12,');
  });
});

describe('applyKey', () => {
  it('ajoute des chiffres et remplace le zéro initial', () => {
    expect(applyKey('', '7')).toBe('7');
    expect(applyKey('0', '5')).toBe('5');
    expect(applyKey('12', '3')).toBe('123');
  });
  it('gère la virgule une seule fois et limite à 2 décimales', () => {
    expect(applyKey('', '.')).toBe('0.');
    expect(applyKey('1.5', '.')).toBe('1.5');
    expect(applyKey('1.25', '9')).toBe('1.25');
  });
  it('accepte 3 décimales pour le dinar tunisien', () => {
    expect(applyKey('1.25', '5', 3)).toBe('1.255');
    expect(applyKey('1.255', '5', 3)).toBe('1.255');
  });
  it('ignore la virgule pour une devise sans décimales', () => {
    expect(applyKey('100', '.', 0)).toBe('100');
  });
  it('efface un caractère ou tout', () => {
    expect(applyKey('123', 'back')).toBe('12');
    expect(applyKey('123', 'clear')).toBe('');
  });
  it('limite la longueur à 12 chiffres', () => {
    expect(applyKey('123456789012', '3')).toBe('123456789012');
  });
});

describe('toRaw', () => {
  it('arrondit aux décimales de la devise sans zéros inutiles', () => {
    expect(toRaw(600.5, 2)).toBe('600.5');
    expect(toRaw(600, 2)).toBe('600');
    expect(toRaw(414565.33, 0)).toBe('414565');
    expect(toRaw(0, 2)).toBe('0');
  });
});

describe('formatRate / formatChange', () => {
  it('formate les taux en fr-FR', () => {
    expect(formatRate(655.957)).toBe('655,96');
    expect(formatRate(0.85234)).toBe('0,8523');
  });
  it('signe les variations avec le moins typographique', () => {
    expect(formatChange(0.42)).toBe(`+0,42${NNBSP}%`);
    expect(formatChange(-1.05)).toBe(`−1,05${NNBSP}%`);
  });
});
