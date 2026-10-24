export interface VoceNav {
  href: string;
  label: string;
}

export const NAV: VoceNav[] = [
  { href: '/calendario-scolastico/', label: 'Calendario scolastico' },
  { href: '/tabelline/', label: 'Tabelline' },
  { href: '/generatori/', label: 'Generatori' },
  { href: '/cartine-mute/', label: 'Cartine mute' },
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
