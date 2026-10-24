import animali from '../data/parole/animali.json';
import colori from '../data/parole/colori.json';
import corpo from '../data/parole/corpo-umano.json';
import frutta from '../data/parole/frutta.json';
import mestieri from '../data/parole/mestieri.json';
import natale from '../data/parole/natale.json';
import scuola from '../data/parole/scuola.json';
import stagioni from '../data/parole/stagioni.json';
import { generaCrucipuzzle, type CrucipuzzleOk } from './crucipuzzle';

export interface TemaCrucipuzzle {
  slug: string;
  etichetta: string;
  complemento: string;
  parole: string[];
}

const ELENCHI: Record<string, string[]> = {
  animali: animali.parole,
  stagioni: stagioni.parole,
  natale: natale.parole,
  'corpo-umano': corpo.parole,
  frutta: frutta.parole,
  scuola: scuola.parole,
  colori: colori.parole,
  mestieri: mestieri.parole,
};

export const TEMI_CRUCIPUZZLE: TemaCrucipuzzle[] = [
  { slug: 'animali', etichetta: 'Animali', complemento: 'sugli animali' },
  { slug: 'stagioni', etichetta: 'Stagioni', complemento: 'sulle stagioni' },
  { slug: 'natale', etichetta: 'Natale', complemento: 'di Natale' },
  { slug: 'corpo-umano', etichetta: 'Corpo umano', complemento: 'sul corpo umano' },
  { slug: 'frutta', etichetta: 'Frutta', complemento: 'sulla frutta' },
  { slug: 'scuola', etichetta: 'Scuola', complemento: 'sulla scuola' },
  { slug: 'colori', etichetta: 'Colori', complemento: 'sui colori' },
  { slug: 'mestieri', etichetta: 'Mestieri', complemento: 'sui mestieri' },
].map((tema) => ({ ...tema, parole: ELENCHI[tema.slug] ?? [] }));

export function temaCrucipuzzle(slug: string): TemaCrucipuzzle {
  const tema = TEMI_CRUCIPUZZLE.find((voce) => voce.slug === slug);
  if (!tema) throw new Error(`Tema sconosciuto: ${slug}`);
  return tema;
}

export function h1Crucipuzzle(tema: TemaCrucipuzzle): string {
  return `Crucipuzzle ${tema.complemento}`;
}

export function titoloCrucipuzzle(tema: TemaCrucipuzzle): string {
  return `${h1Crucipuzzle(tema)} da stampare (con soluzioni)`;
}

export function descrizioneCrucipuzzle(tema: TemaCrucipuzzle): string {
  return `Crucipuzzle ${tema.complemento} da stampare in A4, con le parole e le soluzioni. Anche in versione DSA. Gratis.`;
}

export function percorsoCrucipuzzle(slug: string): string {
  return `/crucipuzzle/${slug}/`;
}

export function percorsoGeneratoreTema(slug: string): string {
  return `/generatori/crucipuzzle/?tema=${slug}`;
}

export function grigliaTema(tema: TemaCrucipuzzle): CrucipuzzleOk {
  const scelte = tema.parole.slice(0, 12);
  for (let seme = 1; seme <= 40; seme += 1) {
    const risultato = generaCrucipuzzle({
      parole: scelte,
      lato: 12,
      direzioni: ['orizzontale', 'verticale'],
      contrario: false,
      seme,
    });
    if (risultato.ok) return risultato;
  }
  throw new Error(`Le parole di ${tema.slug} non entrano nella griglia`);
}

export function mascheraSoluzione(risultato: CrucipuzzleOk): boolean[][] {
  const maschera = risultato.griglia.map((riga) => riga.map(() => false));
  for (const parola of risultato.parole) {
    for (let indice = 0; indice < parola.parola.length; indice += 1) {
      const riga = maschera[parola.riga + parola.dr * indice];
      if (riga) riga[parola.colonna + parola.dc * indice] = true;
    }
  }
  return maschera;
}
