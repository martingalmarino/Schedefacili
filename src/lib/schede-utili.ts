import { TEMPLATES } from './problemi/template';
import { HUB_PROBLEMI, PAGINE_PROBLEMI } from './testi-problemi';
import { PAGINE_LINEA } from './testi-linea';
import { PAGINE_FOGLI } from './testi-fogli';
import { PAGINE_ROMANI } from './testi-romani';
import urlNuove from '../data/url-nuove.json';

export const PAGINE_OROLOGIO = [
  { href: '/orologio-da-stampare/', nome: 'Orologio da costruire' },
  { href: '/generatori/schede-orologio/', nome: 'Schede sull’orologio' },
] as const;

export const URL_NUOVE: readonly string[] = urlNuove;

export const CARD_SCHEDE_UTILI = [
  {
    href: '/fogli-da-stampare/',
    nome: 'Fogli da stampare',
    testo: 'Quadretti e carta millimetrata, in misura reale.',
    conteggio: PAGINE_FOGLI.length,
  },
  {
    href: '/orologio-da-stampare/',
    nome: 'Orologio',
    testo: 'Da costruire, più le schede con le soluzioni.',
    conteggio: PAGINE_OROLOGIO.length,
  },
  {
    href: '/numeri-romani/',
    nome: 'Numeri romani',
    testo: 'Tabelle, convertitore e schede da stampare.',
    conteggio: PAGINE_ROMANI.length,
  },
  {
    href: '/linea-del-tempo/',
    nome: 'Linea del tempo',
    testo: 'Preistoria e anni avanti e dopo Cristo.',
    conteggio: PAGINE_LINEA.length,
  },
  {
    href: '/problemi-matematica/',
    nome: 'Problemi di matematica',
    testo: 'Schede con soluzioni, dalla prima alla quinta.',
    conteggio: TEMPLATES.length,
    unita: 'problemi tipo',
  },
] as const;

export const URL_LINEA = ['/linea-del-tempo/', ...PAGINE_LINEA.map((pagina) => pagina.href)] as const;

export const URL_PROBLEMI = [HUB_PROBLEMI, ...PAGINE_PROBLEMI.map((pagina) => pagina.href)] as const;
