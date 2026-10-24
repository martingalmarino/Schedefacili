import { useMemo, useState } from 'preact/hooks';
import { esercizi, NUMERI_TABELLINE, soluzioneDi, type TipoEsercizio } from '../../lib/tabelline';
import VersioneDsa from './VersioneDsa';

const TIPI: { id: TipoEsercizio; etichetta: string }[] = [
  { id: 'prodotto', etichetta: 'Manca il risultato' },
  { id: 'fattore', etichetta: 'Manca un fattore' },
  { id: 'misto', etichetta: 'Misto' },
];

function casella(nascosto: boolean, valore: number) {
  if (nascosto) return <span className="inline-block min-w-8 border-b-2 border-solid border-inchiostro">&nbsp;</span>;
  return valore;
}

export default function GeneratoreTabelline() {
  const [scelte, setScelte] = useState<number[]>([2, 5, 10]);
  const [tipo, setTipo] = useState<TipoEsercizio>('misto');
  const [quantita, setQuantita] = useState(10);
  const [seme, setSeme] = useState(1);
  const [soluzioni, setSoluzioni] = useState(false);
  const foglio = useMemo(() => esercizi(scelte, quantita, seme, tipo), [scelte, quantita, seme, tipo]);

  function cambia(n: number) {
    setScelte((attuali) => {
      const prossimo = attuali.includes(n) ? attuali.filter((voce) => voce !== n) : [...attuali, n].sort((a, b) => a - b);
      return prossimo.length === 0 ? attuali : prossimo;
    });
  }

  return (
    <div>
      <form className="no-stampa mb-6 grid gap-4 rounded-xl bg-white p-4" onSubmit={(evento) => evento.preventDefault()}>
        <fieldset>
          <legend className="mb-2 font-bold">Tabelline</legend>
          <div className="flex flex-wrap gap-2">
            {NUMERI_TABELLINE.map((n) => (
              <label key={n} className="flex items-center gap-1 rounded-full border border-solid border-pill px-3 py-1">
                <input type="checkbox" checked={scelte.includes(n)} onChange={() => cambia(n)} />
                {n}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block font-bold">
          Tipo di esercizio
          <select className="mt-1 block w-full rounded-lg border border-solid border-pill bg-white p-2 font-normal" value={tipo} onChange={(evento) => setTipo(evento.currentTarget.value as TipoEsercizio)}>
            {TIPI.map((voce) => (
              <option key={voce.id} value={voce.id}>
                {voce.etichetta}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 min-[601px]:grid-cols-2">
          <label className="block font-bold">
            Quante operazioni
            <input className="mt-1 block w-full rounded-lg border border-solid border-pill p-2 font-normal" type="number" min={5} max={40} value={quantita} onChange={(evento) => setQuantita(Number(evento.currentTarget.value) || 10)} />
          </label>
          <label className="block font-bold">
            Numero della scheda
            <input className="mt-1 block w-full rounded-lg border border-solid border-pill p-2 font-normal" type="number" min={1} value={seme} onChange={(evento) => setSeme(Number(evento.currentTarget.value) || 1)} />
          </label>
        </div>
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" checked={soluzioni} onChange={(evento) => setSoluzioni(evento.currentTarget.checked)} />
          Stampa con le soluzioni
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <VersioneDsa targetId="scheda" />
          <button type="button" className="cursor-pointer rounded-[10px] border-0 bg-terracotta px-4 py-2 font-bold text-white" onClick={() => window.print()}>
            Stampa (PDF A4)
          </button>
        </div>
      </form>
      <ol className="scheda-numeri m-0 grid list-decimal gap-3 pl-6 text-[22px]">
        {foglio.map((voce, indice) => (
          <li key={`${voce.fattoreA}-${voce.fattoreB}-${indice}`}>
            {casella(voce.nascosto === 'a', voce.fattoreA)} × {casella(voce.nascosto === 'b', voce.fattoreB)} = {casella(voce.nascosto === 'prodotto', voce.prodotto)}
          </li>
        ))}
      </ol>
      {soluzioni && (
        <section className="soluzioni mt-8">
          <h2 className="text-[28px]">Soluzioni</h2>
          <ol className="scheda-numeri m-0 grid list-decimal gap-2 pl-6 text-[20px]">
            {foglio.map((voce, indice) => (
              <li key={`soluzione-${indice}`}>
                {voce.fattoreA} × {voce.fattoreB} = {voce.prodotto}
                <span className="sr-only">, manca {soluzioneDi(voce)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
