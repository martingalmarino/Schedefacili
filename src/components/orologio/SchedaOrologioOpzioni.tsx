import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { markupSchedaOra } from '../../lib/orologio-svg';
import {
  generaEsercizi,
  hrefSchedaOra,
  type LivelloOra,
  type OpzioniSchedaOra,
  type TipoSchedaOra,
} from '../../lib/schede-orologio';
import type { FormatoOra } from '../../lib/ora';

interface Props {
  path: string;
  iniziale: OpzioniSchedaOra;
}

function classe(attivo: boolean): string {
  const base =
    'chip inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold';
  return attivo ? `${base} border-terracotta bg-terracotta text-white` : `${base} border-pill bg-white text-inchiostro`;
}

export default function SchedaOrologioOpzioni({ path, iniziale }: Props) {
  const [stato, setStato] = useState(iniziale);

  function applica(prossimo: OpzioniSchedaOra) {
    const esercizi = generaEsercizi(prossimo);
    const scheda = document.getElementById('scheda-orologio');
    const soluzioni = document.getElementById('soluzioni-orologio');
    if (scheda) scheda.innerHTML = markupSchedaOra(prossimo, esercizi, false);
    if (soluzioni) soluzioni.innerHTML = markupSchedaOra(prossimo, esercizi, true);
  }

  function scegli(evento: JSX.TargetedMouseEvent<HTMLAnchorElement>, prossimo: OpzioniSchedaOra) {
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey || evento.button !== 0) return;
    evento.preventDefault();
    setStato(prossimo);
    applica(prossimo);
    window.history.replaceState(null, '', hrefSchedaOra(path, prossimo));
  }

  function link(etichetta: string, prossimo: OpzioniSchedaOra, attivo: boolean) {
    return (
      <a href={hrefSchedaOra(path, prossimo)} aria-current={attivo ? 'true' : undefined} className={classe(attivo)} onClick={(evento) => scegli(evento, prossimo)}>
        {etichetta}
      </a>
    );
  }

  function livello(etichetta: string, valore: LivelloOra) {
    return link(etichetta, { ...stato, livello: valore }, stato.livello === valore);
  }

  return (
    <div className="no-stampa mt-4">
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-tipo">
          Tipo
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-tipo">
          {link('Leggi l’ora', { ...stato, tipo: 'leggi' satisfies TipoSchedaOra }, stato.tipo === 'leggi')}
          {link('Disegna le lancette', { ...stato, tipo: 'disegna' }, stato.tipo === 'disegna')}
          {link('Misto', { ...stato, tipo: 'misto' }, stato.tipo === 'misto')}
        </div>
      </div>
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-livello">
          Livello
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-livello">
          {livello('Ore intere', 'intere')}
          {livello('Mezze ore', 'mezze')}
          {livello('Quarti d’ora', 'quarti')}
          {livello('5 minuti', 'cinque')}
          {livello('Minuto esatto', 'esatto')}
        </div>
      </div>
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-formato">
          Come scrivi l’ora
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-formato">
          {link('In parole', { ...stato, formato: 'parole' satisfies FormatoOra }, stato.formato === 'parole')}
          {link('3:15', { ...stato, formato: 'digitale' }, stato.formato === 'digitale')}
          {link('Entrambi', { ...stato, formato: 'entrambi' }, stato.formato === 'entrambi')}
        </div>
      </div>
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-quanti">
          Orologi
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-quanti">
          {([6, 9, 12] as const).map((quanti) => link(String(quanti), { ...stato, quanti }, stato.quanti === quanti))}
        </div>
      </div>
      <p className="mt-3 mb-0">
        Scheda <span className="cifre font-bold">{stato.seed}</span>.{' '}
        <a className="inline-flex min-h-11 items-center font-bold text-terracotta" href={hrefSchedaOra(path, { ...stato, seed: stato.seed + 1 })} onClick={(evento) => scegli(evento, { ...stato, seed: stato.seed + 1 })}>
          Cambia gli orologi
        </a>
      </p>
    </div>
  );
}
