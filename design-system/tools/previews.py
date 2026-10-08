"""Convix component previews.

Each entry renders ONE component (a few states) with window.Convix + React 18.
`{{Flags/us.svg}}`-style placeholders become `/_blob/<id>` for the published system and local
paths for the local render check (tools/render_check.py).
"""

FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800'
         '&amp;family=Unbounded:wght@300;400;500;600;700&amp;display=swap">')

# Shared demo data (French UI copy, West-African-first currency list).
DATA = r"""
  var C = window.Convix, h = React.createElement;
  var FLAGS = __FLAGS__;
  var F = function (c) { return FLAGS[c]; };
  var pad = function () { return h.apply(null, ['div', { className: 'cvx-demo cvx-demo--col' }].concat([].slice.call(arguments))); };
"""

PREVIEWS = {
    # ------------------------------------------------------------------ Écran
    "HeroCard": ("Écran", 280, "Surface du hero, halos prune et indigo", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(pad(
    h(C.HeroCard, null,
      h(C.AppHeader, { trailing: h(C.Avatar, { initials: 'KA', alt: 'Profil' }) }),
      h('div', { style: { marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' } },
        h(C.RateChip, { base: '1 USD', quote: '604,18 XOF', change: 0.42, time: '11:30' })),
      h('div', { style: { height: 64 } }))));
"""),
    "AppHeader": ("Écran", 144, "Icône d'app, lockup deux lignes, avatar", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(pad(
    h(C.HeroCard, null, h(C.AppHeader, { trailing: h(C.Avatar, { initials: 'KA', alt: 'Profil' }) }))));
"""),
    # -------------------------------------------------------------- Conversion
    "ConversionPair": ("Conversion", 310, "Cliquer une ligne pour l'activer, inverser avec le bouton", r"""
  function Demo() {
    var s = React.useState({ a: { flag: F('eu'), code: 'EUR', name: 'Euro', amount: '632' },
                              b: { flag: F('ci'), code: 'XOF', name: 'Franc CFA', amount: '414565' } });
    var act = React.useState('from');
    return pad(h(C.HeroCard, null, h(C.ConversionPair, {
      from: s[0].a, to: s[0].b, active: act[0], onActivate: act[1],
      onSwap: function () { s[1]({ a: s[0].b, b: s[0].a }); } })));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(Demo));
"""),
    "CurrencyAmount": ("Conversion", 370, "Actif (caret), inactif, montant long réduit", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(pad(
    h(C.HeroCard, null,
      h(C.CurrencyAmount, { flag: F('us'), code: 'USD', name: 'Dollar américain', amount: '632', active: true }),
      h(C.CurrencyAmount, { flag: F('dk'), code: 'DKK', name: 'Couronne danoise', amount: '3999' }),
      h(C.CurrencyAmount, { flag: F('ng'), code: 'NGN', name: 'Naira', amount: '1043280.5' }))));
"""),
    "SwapButton": ("Conversion", 140, "Sur le hero ; demi-tour à chaque pression", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(pad(
    h(C.HeroCard, { style: { display: 'flex', gap: 'var(--space-4)', alignItems: 'center' } },
      h(C.SwapButton, null),
      h('span', { className: 'text-caption', style: { color: 'var(--ink-muted)' } }, 'Inverser les devises'))));
"""),
    "RateChip": ("Conversion", 230, "Hausse sarcelle, baisse orange, toujours avec flèche", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h(React.Fragment, null,
      h(C.HeroCard, { style: { display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', margin: 'var(--space-6) var(--space-6) 0' } },
        h(C.RateChip, { base: '1 USD', quote: '604,18 XOF', change: 0.42 }),
        h(C.RateChip, { base: '1 GBP', quote: '782,40 XOF', change: -0.18, time: '11:30' })),
      h('div', { className: 'cvx-demo' },
        h(C.RateChip, { base: '1 EUR', quote: '655,957 XOF', time: 'parité fixe' }),
        h(C.RateChip, { base: '1 GHS', quote: '39,72 XOF', change: -1.05 }))));
"""),
    "Keypad": ("Conversion", 490, "Interactif : saisir, virgule, effacer (maintenir pour tout effacer)", r"""
  function Demo() {
    var s = React.useState('632');
    return h('div', { className: 'cvx-demo cvx-demo--col', style: { maxWidth: 360 } },
      h('div', { className: 'cvx-on-hero cvx-hero', style: { padding: 'var(--space-4) var(--space-6)' } },
        h(C.CurrencyAmount, { flag: F('us'), code: 'USD', amount: s[0], active: true })),
      h(C.Keypad, { onKey: function (k) { s[1](function (v) { return C.applyKey(v, k); }); } }));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(Demo));
"""),
    # -------------------------------------------------------------- Navigation
    "TabBar": ("Navigation", 120, "FAB clavier lumineux, onglet actif = point violet", r"""
  var ITEMS = [{ id: 'home', icon: 'home', label: 'Accueil' }, { id: 'rates', icon: 'globe', label: 'Taux du monde' },
               { id: 'convert', icon: 'keypad', label: 'Convertir', primary: true },
               { id: 'alerts', icon: 'bell', label: 'Alertes' }, { id: 'settings', icon: 'settings', label: 'Réglages' }];
  function Demo() {
    var s = React.useState('convert');
    return h('div', { style: { padding: 'var(--space-4)' } },
      h('div', { style: { borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxWidth: 390, boxShadow: 'var(--shadow-panel)' } },
        h(C.TabBar, { items: ITEMS, activeId: s[0], onChange: s[1] })));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(Demo));
"""),
    # ------------------------------------------------------------------ Listes
    "Sheet": ("Listes", 260, "Poignée, titre centré, halo indigo", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { style: { padding: 'var(--space-4) var(--space-4) 0', maxWidth: 420 } },
      h(C.Sheet, { title: 'Vos devises' },
        h(C.CurrencyList, { label: 'Vos devises' },
          h(C.CurrencyItem, { flag: F('us'), name: 'Dollar américain', code: 'USD', action: 'remove' }),
          h(C.CurrencyItem, { flag: F('ci'), name: 'Franc CFA (BCEAO)', code: 'XOF', action: 'remove' })))));
"""),
    "SectionTitle": ("Listes", 100, "Titre de section en capitales", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { style: { padding: '0 var(--space-6)' } }, h(C.SectionTitle, null, 'Ajouter')));
"""),
    "CurrencyItem": ("Listes", 270, "Retirer, ajouter, sélectionnée, indisponible", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { style: { padding: 'var(--space-2) var(--space-6)', maxWidth: 420 } },
      h(C.CurrencyList, { label: 'Devises' },
        h(C.CurrencyItem, { flag: F('us'), name: 'Dollar américain', code: 'USD', meta: '1 USD = 604,18 XOF', action: 'remove' }),
        h(C.CurrencyItem, { flag: F('eu'), name: 'Euro', code: 'EUR', action: 'add' }),
        h(C.CurrencyItem, { flag: F('ci'), name: 'Franc CFA (BCEAO)', code: 'XOF', selected: true }),
        h(C.CurrencyItem, { flag: F('gh'), name: 'Cedi ghanéen', code: 'GHS', meta: 'Taux indisponible', action: 'add', disabled: true }))));
"""),
    "SearchField": ("Listes", 112, "Verre, bordure 3:1, micro", r"""
  function Demo() {
    var s = React.useState('');
    return h('div', { className: 'cvx-demo cvx-demo--col', style: { maxWidth: 420 } },
      h(C.SearchField, { value: s[0], onChange: s[1], onVoice: function () {} }));
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(Demo));
"""),
    "Divider": ("Listes", 100, "Filet entre deux groupes", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { style: { padding: '0 var(--space-6)', maxWidth: 420 } },
      h('p', { className: 'text-body', style: { margin: 'var(--space-4) 0 0', color: 'var(--ink-muted)' } }, 'Vos devises'),
      h(C.Divider),
      h('p', { className: 'text-body', style: { margin: 0, color: 'var(--ink-muted)' } }, 'Ajouter')));
"""),
    # ----------------------------------------------------------------- Actions
    "Button": ("Actions", 280, "Primaire, secondaire, ghost, désactivé", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h(React.Fragment, null,
      h('div', { className: 'cvx-demo' },
        h(C.Button, null, 'Convertir'),
        h(C.Button, { variant: 'secondary', icon: 'refresh' }, 'Actualiser'),
        h(C.Button, { variant: 'ghost' }, 'Plus tard'),
        h(C.Button, { disabled: true }, 'Hors ligne')),
      h(C.HeroCard, { style: { display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', margin: '0 var(--space-6) var(--space-6)' } },
        h(C.Button, { icon: 'star' }, 'Favori'),
        h(C.Button, { variant: 'secondary' }, 'Partager'))));
"""),
    "IconButton": ("Actions", 100, "Contour 28/36/44, verre, violet", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { className: 'cvx-demo' },
      h(C.IconButton, { icon: 'minus', label: 'Retirer', size: 'sm' }),
      h(C.IconButton, { icon: 'plus', label: 'Ajouter', size: 'sm' }),
      h(C.IconButton, { icon: 'star', label: 'Favori' }),
      h(C.IconButton, { icon: 'close', label: 'Fermer', size: 'lg' }),
      h(C.IconButton, { icon: 'refresh', label: 'Actualiser', variant: 'glass' }),
      h(C.IconButton, { icon: 'check', label: 'Valider', variant: 'violet', size: 'lg' })));
"""),
    # ---------------------------------------------------------------- Identité
    "AppIcon": ("Identité", 140, "Tuile marque et tuile sombre, 64 / 40 / 24", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { className: 'cvx-demo' },
      h(C.AppIcon, { size: 72 }), h(C.AppIcon, { size: 72, variant: 'dark' }),
      h(C.AppIcon, { size: 40 }), h(C.AppIcon, { size: 40, variant: 'dark' }),
      h(C.AppIcon, { size: 24 })));
"""),
    "Avatar": ("Identité", 112, "Initiales sur tuile blanche", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { className: 'cvx-demo' },
      h(C.Avatar, { initials: 'KA', alt: 'Kouadio Aya' }),
      h(C.Avatar, { initials: 'MT', alt: 'Moussa Traoré', size: 56 })));
"""),
    "Flag": ("Identité", 140, "Drapeaux circulaires avec filet", r"""
  var CODES = ['ci', 'eu', 'us', 'gb', 'ng', 'gh', 'ma', 'cn', 'jp', 'ca', 'ch', 'dk'];
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { className: 'cvx-demo' }, CODES.map(function (c) { return h(C.Flag, { key: c, src: F(c), alt: c.toUpperCase() }); })));
"""),
    "Icon": ("Identité", 340, "Jeu d'icônes Convix, 24px, trait 1.75", r"""
  ReactDOM.createRoot(document.getElementById('root')).render(
    h('div', { className: 'cvx-demo', style: { gap: 'var(--space-6)' } }, C.iconNames.map(function (n) {
      return h('div', { key: n, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', width: 72 } },
        h(C.Icon, { name: n }),
        h('span', { className: 'text-caption', style: { color: 'var(--ink-muted)' } }, n));
    })));
"""),
}

# ---------------------------------------------------------------- Showcase page
SCREEN_CSS = r"""
<style>
  .stage { min-height: 100vh; box-sizing: border-box; padding: 40px 24px; display: flex; gap: 40px; justify-content: center; align-items: flex-start;
           background: radial-gradient(70% 60% at 15% 10%, var(--orchid), transparent), radial-gradient(70% 70% at 90% 90%, var(--violet), transparent), var(--lilac); }
  .phone { width: 372px; height: 806px; flex: none; padding: 9px; border-radius: 56px; box-sizing: border-box;
           background: rgba(255, 255, 255, .22); box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .45), var(--shadow-card); }
  .screen { position: relative; height: 100%; overflow: hidden; border-radius: 48px; display: flex; flex-direction: column; background: var(--panel); }
  .screen--dark { background: var(--hero-base); }
  .hero-top { padding-top: var(--space-8); padding-bottom: 104px; border-radius: 0 0 var(--radius-xl) var(--radius-xl); }
  .grab { display: block; width: 72px; height: 3px; margin: var(--space-6) auto 0; border-radius: var(--radius-full); background: var(--hero-line); }
  .keys { margin: -92px var(--space-6) 0; position: relative; z-index: 1; }
  .bar { margin-top: auto; }
  .sheet-wrap { flex: 1; min-height: 0; margin-top: var(--space-4); display: flex; }
  .sheet-wrap > .cvx-sheet { flex: 1; }
  .rate { margin-top: var(--space-4); display: flex; justify-content: flex-start; }
  @media (max-width: 860px) { .stage { flex-wrap: wrap; } }
</style>
"""

PREVIEWS["ConverterScreen"] = ("Écrans", 900, "Démo interactive : clavier, inversion, ajout/retrait de devises (taux de démonstration)", r"""
  /* Demo rates per 1 EUR — illustrative only; XOF is the fixed BCEAO parity. */
  var CUR = {
    XOF: { flag: F('ci'), name: 'Franc CFA (BCEAO)', rate: 655.957, dec: 0 },
    EUR: { flag: F('eu'), name: 'Euro', rate: 1, dec: 2 },
    USD: { flag: F('us'), name: 'Dollar américain', rate: 1.0857, dec: 2 },
    GBP: { flag: F('gb'), name: 'Livre sterling', rate: 0.8384, dec: 2 },
    NGN: { flag: F('ng'), name: 'Naira nigérian', rate: 1791.4, dec: 2 },
    GHS: { flag: F('gh'), name: 'Cedi ghanéen', rate: 16.52, dec: 2 },
    MAD: { flag: F('ma'), name: 'Dirham marocain', rate: 10.82, dec: 2 },
    CNY: { flag: F('cn'), name: 'Yuan chinois', rate: 7.73, dec: 2 },
    JPY: { flag: F('jp'), name: 'Yen japonais', rate: 162.3, dec: 0 },
    CAD: { flag: F('ca'), name: 'Dollar canadien', rate: 1.487, dec: 2 },
    CHF: { flag: F('ch'), name: 'Franc suisse', rate: 0.9409, dec: 2 },
    DKK: { flag: F('dk'), name: 'Couronne danoise', rate: 7.4605, dec: 2 }
  };
  var TABS = [{ id: 'home', icon: 'home', label: 'Accueil' }, { id: 'rates', icon: 'globe', label: 'Devises' },
              { id: 'convert', icon: 'keypad', label: 'Convertir', primary: true },
              { id: 'alerts', icon: 'bell', label: 'Alertes' }, { id: 'settings', icon: 'settings', label: 'Réglages' }];

  function convert(raw, from, to) {
    var n = parseFloat(raw || '0') * CUR[to].rate / CUR[from].rate;
    var s = n.toFixed(CUR[to].dec);
    return CUR[to].dec ? s.replace(/\.?0+$/, '') : s;
  }
  function rateLine(a, b) {
    var r = CUR[b].rate / CUR[a].rate;
    return { base: '1 ' + a, quote: r.toLocaleString('fr-FR', { maximumFractionDigits: r < 10 ? 4 : 2 }) + ' ' + b };
  }

  function App() {
    var favs = React.useState(['EUR', 'XOF', 'USD']), list = favs[0], setList = favs[1];
    var typed = React.useState('632'), raw = typed[0], setRaw = typed[1];
    var side = React.useState('from'), active = side[0], setActive = side[1];
    var tab = React.useState('convert');
    var q = React.useState('');
    var from = list[0], to = list[1];
    var other = active === 'from' ? convert(raw, from, to) : convert(raw, to, from);
    var val = function (code, s) {
      return { flag: CUR[code].flag, code: code, name: CUR[code].name, amount: active === s ? raw : other };
    };
    var onKey = React.useCallback(function (k) { setRaw(function (v) { return C.applyKey(v, k); }); }, []);
    var swap = function () { setList([list[1], list[0]].concat(list.slice(2))); setActive(active === 'from' ? 'to' : 'from'); };
    var activate = function (s) { if (s !== active) { setRaw(other); setActive(s); } };
    var remove = function (code) { if (list.length > 2) setList(list.filter(function (c) { return c !== code; })); };
    var add = function (code) { setList([list[0], code].concat(list.slice(1))); };
    var needle = q[0].trim().toLowerCase();
    var rest = Object.keys(CUR).filter(function (c) {
      return list.indexOf(c) < 0 && (!needle || c.toLowerCase().indexOf(needle) >= 0 || CUR[c].name.toLowerCase().indexOf(needle) >= 0);
    });
    var rl = rateLine(from, to);
    var header = h(C.AppHeader, { trailing: h(C.Avatar, { initials: 'KA', alt: 'Profil' }) });

    var converter = h('div', { className: 'phone' }, h('div', { className: 'screen' },
      h(C.HeroCard, { flushTop: true, className: 'hero-top' },
        header,
        h('div', { style: { marginTop: 'var(--space-8)' } },
          h(C.ConversionPair, { from: val(from, 'from'), to: val(to, 'to'), active: active, onActivate: activate, onSwap: swap })),
        h('div', { className: 'rate' }, h(C.RateChip, { base: rl.base, quote: rl.quote, time: 'démo' })),
        h('span', { className: 'grab', 'aria-hidden': 'true' })),
      h('div', { className: 'keys' }, h(C.Keypad, { onKey: onKey })),
      h('div', { className: 'bar' }, h(C.TabBar, { items: TABS, activeId: tab[0], onChange: tab[1] }))));

    var currencies = h('div', { className: 'phone' }, h('div', { className: 'screen screen--dark' },
      h(C.HeroCard, { flushTop: true, style: { paddingTop: 'var(--space-8)', borderRadius: 0, boxShadow: 'none' } }, header),
      h('div', { className: 'sheet-wrap' },
        h(C.Sheet, { title: 'Vos devises', fade: rest.length > 4 },
          h(C.CurrencyList, { label: 'Vos devises' }, list.map(function (c, i) {
            return h(C.CurrencyItem, { key: c, flag: CUR[c].flag, name: CUR[c].name, code: c,
              meta: i < 2 ? (i === 0 ? 'Devise source' : 'Devise cible') : c,
              selected: i < 2, action: 'remove', disabled: list.length <= 2, onAction: function () { remove(c); } });
          })),
          h(C.Divider),
          h(C.SectionTitle, null, 'Ajouter'),
          h(C.SearchField, { value: q[0], onChange: q[1], onVoice: function () {} }),
          h('div', { style: { height: 'var(--space-3)' } }),
          h(C.CurrencyList, { label: 'Ajouter une devise' }, rest.map(function (c) {
            return h(C.CurrencyItem, { key: c, flag: CUR[c].flag, name: CUR[c].name, code: c, action: 'add', onAction: function () { add(c); } });
          }))))));

    return h('div', { className: 'stage' }, converter, currencies);
  }
  ReactDOM.createRoot(document.getElementById('root')).render(h(App));
""")
