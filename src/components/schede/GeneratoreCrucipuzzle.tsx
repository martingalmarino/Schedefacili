import { useEffect, useMemo, useState } from 'preact/hooks';
import { generaCrucipuzzle, type Direzione } from '../../lib/crucipuzzle';

interface Tema {
  tema: string;
  etichetta: string;
  parole: string[];
}

interface Props {
  temi: Tema[];
}

const DIREZIONI: { id: Direzione; etichetta: string }[] = [
  { id: 'orizzontale', etichetta: 'Orizzontale' },
  { id: 'verticale', etichetta: 'Verticale' },
  { id: 'diagonale', etichetta: 'Diagonale' },
];

export default function GeneratoreCrucipuzzle({ temi }: Props) {
  const [testo, setTesto] = useState(temi[0]?.parole.slice(0, 8).join('\n') ?? '');
  const [lato, setLato] = useState(12);
  const [direzioni, setDirezioni] = useState<Direzione[]>(['orizzontale', 'verticale']);
  const [contrario, setContrario] = useState(false);
  const [dsa, setDsa] = useState(false);
  const [seme, setSeme] = useState(1);
  const [soluzioni, setSoluzioni] = useState(false);

  useEffect(() => {
    const parametri = new URLSearchParams(window.location.search);
    const acceso = parametri.get('dsa') === '1';
    setDsa(acceso);
    document.getElementById('scheda')?.classList.toggle('dsa', acceso);
    const tema = temi.find((voce) => voce.tema === parametri.get('tema'));
    if (tema) setTesto(tema.parole.slice(0, 12).join('\n'));
  }, [temi]);

  const risultato = useMemo(() => {
    const attive = dsa ? direzioni.filter((voce) => voce !== 'diagonale') : direzioni;
    return generaCrucipuzzle({
      parole: testo.split(/\n+/),
      lato,
      direzioni: attive.length > 0 ? attive : ['orizzontale'],
      contrario: dsa ? false : contrario,
      seme,
    });
  }, [testo, lato, direzioni, contrario, dsa, seme]);

  function cambiaDirezione(id: Direzione) {
    setDirezioni((attuali) => {
      const prossimo = attuali.includes(id) ? attuali.filter((voce) => voce !== id) : [...attuali, id];
      return prossimo.length === 0 ? attuali : prossimo;
    });
  }

  const maschera = risultato.ok
    ? risultato.griglia.map((riga) => riga.map(() => false))
    : [];
  if (risultato.ok) {
    for (const parola of risultato.parole) {
      for (let indice = 0; indice < parola.parola.length; indice += 1) {
        const riga = maschera[parola.riga + parola.dr * indice];
        if (riga) riga[parola.colonna + parola.dc * indice] = true;
      }
    }
  }

  return (
    <div>
      <form className="no-stampa mb-6 grid gap-4 rounded-xl bg-white p-4" onSubmit={(evento) => evento.preventDefault()}>
        <div className="flex flex-wrap gap-2">
          {temi.map((tema) => (
            <button key={tema.tema} type="button" className="cursor-pointer rounded-full border border-solid border-pill bg-white px-3 py-1 font-bold" onClick={() => setTesto(tema.parole.slice(0, 12).join('\n'))}>
              {tema.etichetta}
            </button>
          ))}
        </div>
        <label className="block font-bold">
          Parole, una per riga
          <textarea className="mt-1 block min-h-36 w-full rounded-lg border border-solid border-pill p-2 font-normal" value={testo} onInput={(evento) => setTesto(evento.currentTarget.value)} />
        </label>
        <div className="grid gap-3 min-[601px]:grid-cols-2">
          <label className="block font-bold">
            Caselle per lato
            <input className="mt-1 block w-full rounded-lg border border-solid border-pill p-2 font-normal" type="number" min={8} max={16} value={lato} onChange={(evento) => setLato(Number(evento.currentTarget.value) || 12)} />
          </label>
          <label className="block font-bold">
            Numero della scheda
            <input className="mt-1 block w-full rounded-lg border border-solid border-pill p-2 font-normal" type="number" min={1} value={seme} onChange={(evento) => setSeme(Number(evento.currentTarget.value) || 1)} />
          </label>
        </div>
        <fieldset>
          <legend className="mb-2 font-bold">Direzioni</legend>
          <div className="flex flex-wrap gap-3">
            {DIREZIONI.map((voce) => (
              <label key={voce.id} className="flex items-center gap-1">
                <input type="checkbox" checked={direzioni.includes(voce.id)} disabled={dsa && voce.id === 'diagonale'} onChange={() => cambiaDirezione(voce.id)} />
                {voce.etichetta}
              </label>
            ))}
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={contrario && !dsa} disabled={dsa} onChange={(evento) => setContrario(evento.currentTarget.checked)} />
              Al contrario
            </label>
          </div>
        </fieldset>
        <label className="flex items-center gap-2 font-bold">
          <input
            type="checkbox"
            checked={dsa}
            onChange={(evento) => {
              const acceso = evento.currentTarget.checked;
              setDsa(acceso);
              document.getElementById('scheda')?.classList.toggle('dsa', acceso);
              const url = new URL(window.location.href);
              if (acceso) url.searchParams.set('dsa', '1');
              else url.searchParams.delete('dsa');
              window.history.replaceState(null, '', `${url.pathname}${url.search}`);
            }}
          />
          Modalità DSA: lettere grandi, solo orizzontale e verticale
        </label>
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" checked={soluzioni} onChange={(evento) => setSoluzioni(evento.currentTarget.checked)} />
          Stampa con le soluzioni
        </label>
        <button type="button" className="w-fit cursor-pointer rounded-[10px] border-0 bg-terracotta px-4 py-2 font-bold text-white" onClick={() => window.print()}>
          Stampa (PDF A4)
        </button>
      </form>
      {risultato.ok ? (
        <div className="overflow-x-auto">
          <table className="griglia-lettere border-collapse bg-white text-center text-[18px] font-bold">
            <tbody>
              {risultato.griglia.map((riga, indiceRiga) => (
                <tr key={indiceRiga}>
                  {riga.map((lettera, indiceColonna) => (
                    <td key={indiceColonna} className="h-8 w-8 border border-solid border-inchiostro">
                      {lettera}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3">
            Parole: {risultato.parole.map((voce) => voce.parola).join(', ')}
          </p>
        </div>
      ) : (
        <p className="rounded-lg border-2 border-dashed border-ocra bg-[#FFF4D6] px-4 py-3 font-bold">{risultato.motivo}</p>
      )}
      {soluzioni && risultato.ok && (
        <section className="soluzioni mt-8">
          <h2 className="text-[28px]">Soluzioni</h2>
          <div className="overflow-x-auto">
          <table className="griglia-lettere border-collapse bg-white text-center text-[18px] font-bold">
            <tbody>
              {risultato.griglia.map((riga, indiceRiga) => (
                <tr key={indiceRiga}>
                  {riga.map((lettera, indiceColonna) => (
                    <td key={indiceColonna} className="h-8 w-8 border border-solid border-[#ccc]">
                      {maschera[indiceRiga]?.[indiceColonna] ? lettera : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>
      )}
    </div>
  );
}
