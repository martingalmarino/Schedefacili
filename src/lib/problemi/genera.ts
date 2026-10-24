import { creaRng } from './rng';
import { TEMPLATES } from './template';
import type { Classe, Istanza, OpzioniScheda, Tag, Template } from './types';
import { OPERAZIONI_CLASSE } from './types';
import { rispettaVincoli } from './vincoli';

const TAG: readonly Tag[] = ['add', 'sub', 'mul', 'div', 'euro', 'frazioni', 'decimali', 'misure', 'percentuali', 'geometria', 'multi'];

export function opzioniBase(classe: Classe, seed: number): OpzioniScheda {
  return {
    seed,
    classe,
    n: 6,
    operazioni: [...OPERAZIONI_CLASSE[classe]],
    dueOperazioni: false,
    spazi: 'dati',
    aiutoVisivo: false,
  };
}

function tagDa(testo: string | null): Tag[] {
  if (!testo) return [];
  return testo
    .split(',')
    .map((voce) => voce.trim())
    .filter((voce): voce is Tag => TAG.includes(voce as Tag));
}

export function opzioniDaQuery(parametri: URLSearchParams, base: OpzioniScheda): OpzioniScheda {
  const seme = parametri.get('s');
  const quanti = Number(parametri.get('n'));
  const classe = Number(parametri.get('classe'));
  const operazioni = tagDa(parametri.get('op'));
  const prossima: OpzioniScheda = { ...base, operazioni: [...base.operazioni] };
  if (seme && /^\d{4,6}$/.test(seme)) prossima.seed = Number(seme);
  if (quanti >= 4 && quanti <= 8) prossima.n = quanti;
  if (classe >= 1 && classe <= 5) prossima.classe = classe as Classe;
  if (operazioni.length > 0) prossima.operazioni = operazioni.filter((tag) => OPERAZIONI_CLASSE[prossima.classe].includes(tag));
  if (parametri.get('due') === '1') prossima.dueOperazioni = prossima.classe >= 3;
  if (parametri.get('due') === '0') prossima.dueOperazioni = false;
  if (parametri.get('spazi') === 'risposta') prossima.spazi = 'risposta';
  if (parametri.get('spazi') === 'dati') prossima.spazi = 'dati';
  if (parametri.get('aiuto') === '1' && prossima.classe === 1) prossima.aiutoVisivo = true;
  if (parametri.get('aiuto') === '0') prossima.aiutoVisivo = false;
  if (prossima.operazioni.length === 0) prossima.operazioni = [...OPERAZIONI_CLASSE[prossima.classe]];
  return prossima;
}

export function queryProblemi(opzioni: OpzioniScheda, base: OpzioniScheda): string {
  const query = new URLSearchParams();
  if (opzioni.seed !== base.seed) query.set('s', String(opzioni.seed));
  if (opzioni.n !== base.n) query.set('n', String(opzioni.n));
  if (opzioni.classe !== base.classe) query.set('classe', String(opzioni.classe));
  if (opzioni.operazioni.join(',') !== base.operazioni.join(',')) query.set('op', opzioni.operazioni.join(','));
  if (opzioni.dueOperazioni !== base.dueOperazioni) query.set('due', opzioni.dueOperazioni ? '1' : '0');
  if (opzioni.spazi !== base.spazi) query.set('spazi', opzioni.spazi);
  if (Boolean(opzioni.aiutoVisivo) !== Boolean(base.aiutoVisivo)) query.set('aiuto', opzioni.aiutoVisivo ? '1' : '0');
  const testo = query.toString();
  return testo ? `?${testo}` : '';
}

export function semeNuovo(): number {
  return 1000 + Math.floor(Math.random() * 999_000);
}

export function quantiProblemi(n: number, dsa: boolean): number {
  return dsa ? Math.min(n, 5) : n;
}

function compatibile(template: Template, opzioni: OpzioniScheda): boolean {
  const ammesse = opzioni.operazioni.length > 0 ? opzioni.operazioni : OPERAZIONI_CLASSE[opzioni.classe];
  if (!template.tags.every((tag) => ammesse.includes(tag))) return false;
  if (opzioni.classe === 1 && (template.tags.includes('mul') || template.tags.includes('div'))) return false;
  return opzioni.dueOperazioni ? template.passi >= 2 : template.passi === 1;
}

function normalizza(grezza: Istanza, template: Template): Istanza {
  return {
    ...grezza,
    id: template.id,
    tags: grezza.tags.length > 0 ? grezza.tags : [...template.tags],
    passi: grezza.passi || template.passi,
  };
}

function prova(template: Template, casuale: ReturnType<typeof creaRng>, classe: Classe): Istanza | null {
  for (let tentativo = 0; tentativo < 50; tentativo += 1) {
    const grezza = template.genera(casuale);
    if (!grezza) continue;
    const istanza = normalizza(grezza, template);
    if (rispettaVincoli(istanza, classe)) return istanza;
  }
  return null;
}

export function generaScheda(opzioni: OpzioniScheda, catalogo: readonly Template[] = TEMPLATES): Istanza[] {
  const casuale = creaRng(opzioni.seed);
  let pool = catalogo.filter((template) => template.classe === opzioni.classe && compatibile(template, opzioni));
  if (pool.length === 0) pool = catalogo.filter((template) => template.classe === opzioni.classe && !(opzioni.classe === 1 && (template.tags.includes('mul') || template.tags.includes('div'))));
  const ordine = casuale.mescola(pool);
  const problemi: Istanza[] = [];
  for (const template of ordine) {
    if (problemi.length >= opzioni.n) break;
    const istanza = prova(template, casuale, opzioni.classe);
    if (istanza) problemi.push(istanza);
  }
  return problemi;
}
