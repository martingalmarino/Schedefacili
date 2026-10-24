import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { hrefOrologio, markupOrologio, type OpzioniOrologio } from '../../lib/orologio-svg';

interface Props {
  path: string;
  iniziale: OpzioniOrologio;
}

function classe(attivo: boolean): string {
  const base =
    'chip inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold';
  return attivo ? `${base} border-terracotta bg-terracotta text-white` : `${base} border-pill bg-white text-inchiostro`;
}

export default function OrologioOpzioni({ path, iniziale }: Props) {
  const [stato, setStato] = useState(iniziale);

  function scegli(evento: JSX.TargetedMouseEvent<HTMLAnchorElement>, prossimo: OpzioniOrologio) {
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey || evento.button !== 0) return;
    evento.preventDefault();
    setStato(prossimo);
    const svg = document.getElementById('foglio-a4');
    if (svg) svg.innerHTML = markupOrologio(prossimo);
    window.history.replaceState(null, '', hrefOrologio(path, prossimo));
  }

  function link(etichetta: string, prossimo: OpzioniOrologio, attivo: boolean) {
    return (
      <a href={hrefOrologio(path, prossimo)} aria-current={attivo ? 'true' : undefined} className={classe(attivo)} onClick={(evento) => scegli(evento, prossimo)}>
        {etichetta}
      </a>
    );
  }

  return (
    <div className="no-stampa mt-4">
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-colori">
          Versione
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-colori">
          {link('A colori', { ...stato, colori: true }, stato.colori)}
          {link('Da colorare', { ...stato, colori: false }, !stato.colori)}
        </div>
      </div>
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-minuti">
          Minuti
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-minuti">
          {link('Con minuti', { ...stato, minuti: true }, stato.minuti)}
          {link('Senza minuti', { ...stato, minuti: false }, !stato.minuti)}
        </div>
      </div>
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-ore24">
          Numeri 13-24
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-ore24">
          {link('Solo 1-12', { ...stato, ore24: false }, !stato.ore24)}
          {link('Anche 13-24', { ...stato, ore24: true }, stato.ore24)}
        </div>
      </div>
    </div>
  );
}
