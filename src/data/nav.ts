export interface VoceNav {
  href: string;
  label: string;
  figli?: VoceNav[];
}

export const NAV: VoceNav[] = [
  { href: '/calendario-scolastico/', label: 'Calendario scolastico' },
  { href: '/tabelline/', label: 'Tabelline' },
  { href: '/generatori/', label: 'Generatori' },
  { href: '/cartine-mute/', label: 'Cartine mute' },
  {
    href: '/fogli-da-stampare/',
    label: 'Schede utili',
    figli: [
      { href: '/fogli-da-stampare/', label: 'Fogli da stampare' },
      { href: '/orologio-da-stampare/', label: 'Orologio' },
      { href: '/numeri-romani/', label: 'Numeri romani' },
      { href: '/linea-del-tempo/', label: 'Linea del tempo' },
      { href: '/problemi-matematica/', label: 'Problemi di matematica' },
    ],
  },
];

export const STRUMENTI: VoceNav[] = [
  { href: '/tabelline/', label: 'Tabelline' },
  { href: '/generatori/crucipuzzle/', label: 'Crucipuzzle' },
  { href: '/cartine-mute/', label: 'Cartine mute' },
];

export const INFO: VoceNav[] = [
  { href: '/chi-siamo/', label: 'Chi siamo' },
  { href: '/contatti/', label: 'Contatti' },
  { href: '/privacy/', label: 'Privacy' },
  { href: '/cookie/', label: 'Cookie' },
  { href: '/termini/', label: 'Termini' },
  { href: '/fonti-e-licenze/', label: 'Fonti e licenze' },
];
