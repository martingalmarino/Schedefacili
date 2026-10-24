import type { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { hrefFoglio, markupInterno, type OpzioniFoglio } from '../../lib/fogli';

interface Props {
  path: string;
  iniziale: OpzioniFoglio;
  mostraSpessore?: boolean;
}

function classe(attivo: boolean): string {
  const base =
    'chip inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold';
  return attivo ? `${base} border-terracotta bg-terracotta text-white` : `${base} border-pill bg-white text-inchiostro`;
}

export default function FoglioOpzioni({ path, iniziale, mostraSpessore = true }: Props) {
  const [stato, setStato] = useState(iniziale);

  function scegli(evento: JSX.TargetedMouseEvent<HTMLAnchorElement>, prossimo: OpzioniFoglio) {
    if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey || evento.button !== 0) return;
    evento.preventDefault();
    setStato(prossimo);
    const svg = document.getElementById('foglio-a4');
    if (svg) svg.innerHTML = markupInterno(prossimo);
    window.history.replaceState(null, '', hrefFoglio(path, prossimo));
  }

  function link(etichetta: string, prossimo: OpzioniFoglio, attivo: boolean) {
    return (
      <a href={hrefFoglio(path, prossimo)} aria-current={attivo ? 'true' : undefined} className={classe(attivo)} onClick={(evento) => scegli(evento, prossimo)}>
        {etichetta}
      </a>
    );
  }

  return (
    <div className="no-stampa mt-4">
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-margine">
          Margine
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-margine">
          {link('Con margine', { ...stato, margine: true }, stato.margine)}
          {link('Senza margine', { ...stato, margine: false }, !stato.margine)}
        </div>
      </div>
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-colore">
          Colore delle linee
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-colore">
          {link('Grigio chiaro', { ...stato, colore: 'grigio' }, stato.colore === 'grigio')}
          {link('Azzurro', { ...stato, colore: 'azzurro' }, stato.colore === 'azzurro')}
        </div>
      </div>
      {mostraSpessore && (
        <div className="mt-3">
          <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-spessore">
            Spessore
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-spessore">
            {link('0,2 mm', { ...stato, spessore: 0.2 }, stato.spessore === 0.2)}
            {link('0,3 mm', { ...stato, spessore: 0.3 }, stato.spessore === 0.3)}
          </div>
        </div>
      )}
      <div className="mt-3">
        <p className="m-0 mb-1 text-[14px] font-bold" id="etichetta-intestazione">
          Intestazione
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-labelledby="etichetta-intestazione">
          {link('Nome e data', { ...stato, intestazione: true }, stato.intestazione)}
          {link('Senza intestazione', { ...stato, intestazione: false }, !stato.intestazione)}
        </div>
      </div>
    </div>
  );
}
