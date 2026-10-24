import type { JSX } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { generaScheda, opzioniDaQuery, quantiProblemi, queryProblemi, semeNuovo } from '../../lib/problemi/genera';
import { htmlScheda } from '../../lib/problemi/render';
import type { OpzioniScheda, Tag } from '../../lib/problemi/types';
import { OPERAZIONI_CLASSE } from '../../lib/problemi/types';

interface Props {
  path: string;
  iniziale: OpzioniScheda;
  cambiaClasse?: boolean;
}

const ETICHETTE: Record<Tag, string> = {
  add: 'Addizione',
  sub: 'Sottrazione',
  mul: 'Moltiplicazione',
  div: 'Divisione',
  euro: 'Euro',
  frazioni: 'Frazioni',
  decimali: 'Decimali',
  misure: 'Misure',
  percentuali: 'Percentuali',
  geometria: 'Geometria',
  multi: 'Più operazioni',
};

function classeBottone(attivo: boolean): string {
  const base = 'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold';
  return attivo ? `${base} border-salvia bg-salvia text-white` : `${base} border-pill bg-white text-inchiostro`;
}

function dsaAttivo(): boolean {
  return new URLSearchParams(window.location.search).get('dsa') === '1';
}

function applica(opzioni: OpzioniScheda, dsa = dsaAttivo()) {
  const usate = { ...opzioni, n: quantiProblemi(opzioni.n, dsa) };
  const problemi = generaScheda(usate);
  const scheda = document.getElementById('scheda-problemi');
  const soluzioni = document.getElementById('soluzioni-problemi');
  if (scheda) scheda.innerHTML = htmlScheda(problemi, usate, false);
  if (soluzioni) soluzioni.innerHTML = htmlScheda(problemi, usate, true);
}

function indirizzo(path: string, prossimo: OpzioniScheda, iniziale: OpzioniScheda): string {
  const parametri = new URLSearchParams(queryProblemi(prossimo, iniziale).slice(1));
  if (dsaAttivo()) parametri.set('dsa', '1');
  const testo = parametri.toString();
  return testo ? `${path}?${testo}` : path;
}

function uguali(a: OpzioniScheda, b: OpzioniScheda): boolean {
  return queryProblemi(a, b) === '' && a.seed === b.seed;
}

export default function GeneratoreProblemi({ path, iniziale, cambiaClasse = false }: Props) {
  const [stato, setStato] = useState(iniziale);
  const [annuncio, setAnnuncio] = useState('');
  const [conSoluzioni, setConSoluzioni] = useState(true);
  const [dsa, setDsa] = useState(false);
  const statoRef = useRef(stato);
  statoRef.current = stato;

  useEffect(() => {
    const acceso = dsaAttivo();
    setDsa(acceso);
    const prossimo = opzioniDaQuery(new URLSearchParams(window.location.search), iniziale);
    if (acceso || !uguali(prossimo, iniziale)) {
      setStato(prossimo);
      applica(prossimo, acceso);
    }
    const su = (evento: Event) => {
      const prossimoDsa = Boolean((evento as CustomEvent<boolean>).detail);
      setDsa(prossimoDsa);
      applica(statoRef.current, prossimoDsa);
    };
    window.addEventListener('schedefacili-dsa', su);
    return () => window.removeEventListener('schedefacili-dsa', su);
  }, [iniziale]);

  function aggiorna(prossimo: OpzioniScheda, messaggio = '') {
    setStato(prossimo);
    setAnnuncio(messaggio);
    applica(prossimo);
    window.history.replaceState(null, '', indirizzo(path, prossimo, iniziale));
  }

  function nuova(evento: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    evento.preventDefault();
    const seed = semeNuovo();
    aggiorna({ ...stato, seed }, `Nuova scheda ${seed} pronta`);
  }

  function stampa(evento: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    evento.preventDefault();
    document.documentElement.classList.toggle('stampa-solo', !conSoluzioni);
    window.print();
  }

  function cambiaOperazione(tag: Tag) {
    const presente = stato.operazioni.includes(tag);
    const operazioni = presente ? stato.operazioni.filter((voce) => voce !== tag) : [...stato.operazioni, tag];
    aggiorna({ ...stato, operazioni: operazioni.length > 0 ? operazioni : [tag] });
  }

  const operazioni = OPERAZIONI_CLASSE[stato.classe];

  return (
    <div className="no-stampa">
      <p className="sr-only" aria-live="polite">
        {annuncio}
      </p>
      {cambiaClasse && (
        <div className="mb-3">
          <p className="mb-2 text-[14px] font-bold text-salvia">Classe</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Classe">
            {([1, 2, 3, 4, 5] as const).map((classe) => (
              <button
                key={classe}
                type="button"
                className={classeBottone(stato.classe === classe)}
                aria-pressed={stato.classe === classe}
                onClick={() => aggiorna({ ...stato, classe, operazioni: [...OPERAZIONI_CLASSE[classe]], dueOperazioni: classe >= 3 ? stato.dueOperazioni : false })}
              >
                <span className="n">{classe}</span>ª
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="mb-2 text-[14px] font-bold text-salvia">Operazioni</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Operazioni">
        {operazioni.map((tag) => (
          <button key={tag} type="button" className={classeBottone(stato.operazioni.includes(tag))} aria-pressed={stato.operazioni.includes(tag)} onClick={() => cambiaOperazione(tag)}>
            {ETICHETTE[tag]}
          </button>
        ))}
      </div>
      {stato.classe >= 3 && (
        <div className="mt-3">
          <button type="button" className={classeBottone(stato.dueOperazioni)} aria-pressed={stato.dueOperazioni} onClick={() => aggiorna({ ...stato, dueOperazioni: !stato.dueOperazioni })}>
            Due operazioni
          </button>
        </div>
      )}
      <p className="mt-3 mb-2 text-[14px] font-bold text-salvia">Numero di problemi</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Numero di problemi">
        {(dsa ? [4, 5] : [4, 5, 6, 7, 8]).map((n) => (
          <button key={n} type="button" className={classeBottone(quantiProblemi(stato.n, dsa) === n)} aria-pressed={quantiProblemi(stato.n, dsa) === n} onClick={() => aggiorna({ ...stato, n })}>
            <span className="n">{n}</span>
          </button>
        ))}
      </div>
      {dsa && <p className="mt-2 mb-0">In versione DSA la scheda ha al massimo 5 problemi.</p>}
      <p className="mt-3 mb-2 text-[14px] font-bold text-salvia">Spazi</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Spazi">
        <button type="button" className={classeBottone(stato.spazi === 'dati')} aria-pressed={stato.spazi === 'dati'} onClick={() => aggiorna({ ...stato, spazi: 'dati' })}>
          {stato.classe === 1 ? 'Disegna · Operazione · Risposta' : 'Dati · Operazione · Risposta'}
        </button>
        <button type="button" className={classeBottone(stato.spazi === 'risposta')} aria-pressed={stato.spazi === 'risposta'} onClick={() => aggiorna({ ...stato, spazi: 'risposta' })}>
          Solo risposta
        </button>
      </div>
      <button type="button" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[10px] border-[1.5px] border-solid border-terracotta bg-white px-4 font-bold text-terracotta" onClick={nuova}>
        ↻ Nuova scheda
      </button>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Che cosa stampare">
        <button type="button" className={classeBottone(!conSoluzioni)} aria-pressed={!conSoluzioni} onClick={() => setConSoluzioni(false)}>
          Solo scheda
        </button>
        <button type="button" className={classeBottone(conSoluzioni)} aria-pressed={conSoluzioni} onClick={() => setConSoluzioni(true)}>
          Scheda + soluzioni
        </button>
      </div>
      <button type="button" className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-[10px] border-0 bg-terracotta px-4 font-bold text-white" onClick={stampa}>
        Stampa (PDF A4)
      </button>
      <p className="mt-3 mb-0">
        Scheda <span className="n font-bold">{stato.seed}</span> · 1 foglio + soluzioni · stampa al 100%
      </p>
    </div>
  );
}
