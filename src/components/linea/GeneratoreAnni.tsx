import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import {
  generaScheda,
  opzioniAnniDaQuery,
  queryAnni,
  svgSchedaAnni,
  type LivelloAnni,
  type OpzioniSchedaAnni,
  type TipoSchedaAnni,
} from '../../lib/schede-anni';

interface Props {
  path: string;
  iniziale: OpzioniSchedaAnni;
}

const TIPI: { id: TipoSchedaAnni; etichetta: string }[] = [
  { id: 'ordine', etichetta: 'Metti in ordine' },
  { id: 'prima', etichetta: 'Prima o dopo?' },
  { id: 'quanti', etichetta: 'Quanti anni sono passati?' },
  { id: 'secolo', etichetta: 'In che secolo?' },
];

const LIVELLI: { id: LivelloAnni; etichetta: string }[] = [
  { id: 'facile', etichetta: 'Facile' },
  { id: 'medio', etichetta: 'Medio' },
  { id: 'difficile', etichetta: 'Difficile' },
];

const AIUTI: Record<LivelloAnni, string> = {
  facile: 'Da 1 a 20, nella stessa era.',
  medio: 'Fino a 500, anche da un’era all’altra.',
  difficile: 'Fino a 2000.',
};

function classe(attivo: boolean): string {
  const base =
    'inline-flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold';
  return attivo ? `${base} border-terracotta bg-terracotta text-white` : `${base} border-pill bg-white text-inchiostro`;
}

function applica(opzioni: OpzioniSchedaAnni) {
  const scheda = generaScheda(opzioni);
  const esercizio = document.getElementById('scheda-anni');
  const soluzioni = document.getElementById('soluzioni-anni');
  if (esercizio) esercizio.innerHTML = svgSchedaAnni(scheda, false);
  if (soluzioni) soluzioni.innerHTML = svgSchedaAnni(scheda, true);
}

export default function GeneratoreAnni({ path, iniziale }: Props) {
  const [stato, setStato] = useState(iniziale);

  useEffect(() => {
    const prossimo = opzioniAnniDaQuery(new URLSearchParams(window.location.search));
    if (prossimo.seed === iniziale.seed && prossimo.tipo === iniziale.tipo && prossimo.livello === iniziale.livello) {
      return;
    }
    setStato(prossimo);
    applica(prossimo);
  }, [iniziale.livello, iniziale.seed, iniziale.tipo]);

  function aggiorna(prossimo: OpzioniSchedaAnni) {
    setStato(prossimo);
    applica(prossimo);
    const query = queryAnni(prossimo);
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
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo di esercizio">
          {TIPI.map((tipo) => (
            <button
              key={tipo.id}
              type="button"
              className={classe(stato.tipo === tipo.id)}
              aria-pressed={stato.tipo === tipo.id}
              onClick={() => aggiorna({ ...stato, tipo: tipo.id })}
            >
              {tipo.etichetta}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Livello">
        {LIVELLI.map((livello) => (
          <button
            key={livello.id}
            type="button"
            className={classe(stato.livello === livello.id)}
            aria-pressed={stato.livello === livello.id}
            onClick={() => aggiorna({ ...stato, livello: livello.id })}
          >
            {livello.etichetta}
          </button>
        ))}
      </div>
      <p className="mt-2 mb-0">{AIUTI[stato.livello]}</p>
      <p className="mt-1 mb-0">
        Scheda <span className="cifre font-bold">{stato.seed}</span>. Lo stesso numero ristampa gli stessi esercizi.
      </p>
    </div>
  );
}
