import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  generaSchede,
  markupSchedaRomana,
  opzioniRomaniDaQuery,
  queryRomani,
  type OpzioniSchedeRomane,
} from '../../lib/schede-romani';

interface Props {
  path: string;
  iniziale: OpzioniSchedeRomane;
}

function classe(attivo: boolean): string {
  const base =
    'chip inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold';
  return attivo ? `${base} border-terracotta bg-terracotta text-white` : `${base} border-pill bg-white text-inchiostro`;
}

export default function NuovaScheda({ path, iniziale }: Props) {
  const [stato, setStato] = useState(iniziale);

  function applica(prossimo: OpzioniSchedeRomane) {
    for (const scheda of generaSchede(prossimo)) {
      const esercizio = document.getElementById(`${scheda.id}-scheda`);
      const soluzioni = document.getElementById(`${scheda.id}-soluzioni`);
      if (esercizio) esercizio.innerHTML = markupSchedaRomana(scheda, false);
      if (soluzioni) soluzioni.innerHTML = markupSchedaRomana(scheda, true);
    }
  }

  useEffect(() => {
    const prossimo = opzioniRomaniDaQuery(new URLSearchParams(window.location.search));
    if (prossimo.seed === iniziale.seed && prossimo.fino === iniziale.fino) return;
    setStato(prossimo);
    applica(prossimo);
  }, [iniziale.fino, iniziale.seed]);

  function aggiorna(prossimo: OpzioniSchedeRomane) {
    setStato(prossimo);
    applica(prossimo);
    const query = queryRomani(prossimo);
    window.history.replaceState(null, '', query ? `${path}${query}` : path);
  }

  function nuova(evento: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    evento.preventDefault();
    aggiorna({ ...stato, seed: stato.seed + 1 });
  }

  return (
    <div className="no-stampa mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center rounded-[10px] border-0 bg-terracotta px-4 font-bold text-white"
          onClick={nuova}
        >
          Nuova scheda
        </button>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Intervallo">
          <button type="button" className={classe(stato.fino === 20)} aria-pressed={stato.fino === 20} onClick={() => aggiorna({ ...stato, fino: 20 })}>
            Da 1 a 20
          </button>
          <button type="button" className={classe(stato.fino === 100)} aria-pressed={stato.fino === 100} onClick={() => aggiorna({ ...stato, fino: 100 })}>
            Da 1 a 100
          </button>
        </div>
      </div>
      <p className="mt-2 mb-0">
        Scheda <span className="cifre font-bold">{stato.seed}</span>. Lo stesso numero ristampa gli stessi esercizi.
      </p>
    </div>
  );
}
