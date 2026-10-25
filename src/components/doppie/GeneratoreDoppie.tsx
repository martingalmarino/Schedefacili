import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { generaScheda, opzioniDaQuery, queryDoppie, semeNuovo } from '../../lib/doppie/genera';
import { etichettaEsercizio, htmlScheda } from '../../lib/doppie/render';
import type { OpzioniDoppie, TipoEsercizio } from '../../lib/doppie/types';
import { TIPI_ESERCIZIO } from '../../lib/doppie/types';

interface Props {
  path: string;
  iniziale: OpzioniDoppie;
}

function classeBottone(attivo: boolean): string {
  const base = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold';
  return attivo ? `${base} border-salvia bg-salvia text-white` : `${base} border-pill bg-white text-inchiostro`;
}

function applica(opzioni: OpzioniDoppie) {
  const scheda = generaScheda(opzioni.classe, opzioni, opzioni.seed);
  const foglio = document.getElementById('scheda-doppie');
  const soluzioni = document.getElementById('soluzioni-doppie');
  if (foglio) foglio.innerHTML = htmlScheda(scheda, false);
  if (soluzioni) soluzioni.innerHTML = htmlScheda(scheda, true);
}

function uguali(a: OpzioniDoppie, b: OpzioniDoppie): boolean {
  return a.seed === b.seed && a.esercizi.join(',') === b.esercizi.join(',') && Boolean(a.dsa) === Boolean(b.dsa);
}

export default function GeneratoreDoppie({ path, iniziale }: Props) {
  const [stato, setStato] = useState(iniziale);
  const [annuncio, setAnnuncio] = useState('');

  useEffect(() => {
    const prossimo = opzioniDaQuery(new URLSearchParams(window.location.search), iniziale);
    if (!uguali(prossimo, iniziale)) {
      setStato(prossimo);
      applica(prossimo);
    }
    const su = (evento: Event) => {
      const attivo = Boolean((evento as CustomEvent<boolean>).detail);
      setStato((attuale) => {
        const prossimoStato = { ...attuale, dsa: attivo || undefined };
        applica(prossimoStato);
        const query = queryDoppie(prossimoStato, iniziale);
        window.history.replaceState(null, '', query ? `${path}${query}` : path);
        return prossimoStato;
      });
    };
    window.addEventListener('schedefacili-dsa', su);
    return () => window.removeEventListener('schedefacili-dsa', su);
  }, [iniziale, path]);

  function aggiorna(prossimo: OpzioniDoppie, messaggio = '') {
    setStato(prossimo);
    setAnnuncio(messaggio);
    applica(prossimo);
    const query = queryDoppie(prossimo, iniziale);
    window.history.replaceState(null, '', query ? `${path}${query}` : path);
  }

  function nuova(evento: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    evento.preventDefault();
    const seed = semeNuovo();
    aggiorna({ ...stato, seed }, `Nuova scheda ${seed} pronta`);
  }

  function stampa(evento: JSX.TargetedMouseEvent<HTMLButtonElement>, conSoluzioni: boolean) {
    evento.preventDefault();
    document.documentElement.classList.toggle('stampa-solo', !conSoluzioni);
    window.print();
  }

  function cambia(tipo: TipoEsercizio) {
    const presente = stato.esercizi.includes(tipo);
    const esercizi = presente ? stato.esercizi.filter((voce) => voce !== tipo) : [...stato.esercizi, tipo];
    aggiorna({ ...stato, esercizi: esercizi.length > 0 ? TIPI_ESERCIZIO.filter((voce) => esercizi.includes(voce)) : [tipo] });
  }

  return (
    <div className="no-stampa">
      <p className="sr-only" aria-live="polite">
        {annuncio}
      </p>
      <p className="mb-2 text-[14px] font-bold text-salvia">Esercizi</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Esercizi">
        {TIPI_ESERCIZIO.map((tipo) => (
          <button key={tipo} type="button" className={classeBottone(stato.esercizi.includes(tipo))} aria-pressed={stato.esercizi.includes(tipo)} onClick={() => cambia(tipo)}>
            {etichettaEsercizio(tipo)}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border-0 bg-terracotta px-4 font-bold text-white" onClick={nuova}>
          Nuova scheda
        </button>
        <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border-[1.5px] border-solid border-inchiostro bg-white px-4 font-bold text-inchiostro" onClick={(evento) => stampa(evento, false)}>
          Stampa scheda
        </button>
        <button type="button" className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border-0 bg-inchiostro px-4 font-bold text-white" onClick={(evento) => stampa(evento, true)}>
          Stampa scheda + soluzioni
        </button>
      </div>
      <p className="mt-3 mb-0">
        Scheda <span className="n font-bold">{stato.seed}</span> · 1 foglio + soluzioni · stampa al 100%
      </p>
    </div>
  );
}
