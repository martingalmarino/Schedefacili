import { useState } from 'preact/hooks';
import { filtraIndice, type VoceIndice } from '../lib/indice-ricerca';

export default function CercaSito() {
  const [testo, setTesto] = useState('');
  const [risultati, setRisultati] = useState<VoceIndice[] | null>(null);
  const [errore, setErrore] = useState(false);

  async function cerca(evento: Event) {
    evento.preventDefault();
    setErrore(false);
    const domanda = testo.trim();
    if (!domanda) {
      setRisultati([]);
      return;
    }
    try {
      const risposta = await fetch('/indice-ricerca.json');
      if (!risposta.ok) throw new Error('indice');
      const indice = (await risposta.json()) as VoceIndice[];
      setRisultati(filtraIndice(indice, domanda));
    } catch {
      setErrore(true);
      setRisultati(null);
    }
  }

  return (
    <div>
      <form
        className="flex max-w-[620px] overflow-hidden rounded-xl border-2 border-solid border-inchiostro bg-white"
        role="search"
        onSubmit={cerca}
      >
        <label className="sr-only" htmlFor="cerca">
          Cerca nel sito
        </label>
        <input
          id="cerca"
          name="q"
          type="search"
          value={testo}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-[14px] font-sans text-[17px] text-inchiostro outline-none placeholder:text-muted"
          placeholder="Cerca: tabellina del 7, cartina muta Lombardia…"
          onInput={(evento) => setTesto(evento.currentTarget.value)}
        />
        <button
          type="submit"
          className="shrink-0 cursor-pointer border-0 bg-terracotta px-3.5 font-sans text-[16px] font-bold text-white min-[601px]:px-[22px]"
        >
          Cerca
        </button>
      </form>
      {errore && <p className="mt-3 max-w-[620px] text-[15px]">La ricerca non è disponibile. Riprova tra un momento.</p>}
      {risultati && (
        <ul className="mt-3 max-w-[620px] overflow-hidden rounded-xl border border-solid border-bordo bg-white" aria-live="polite">
          {risultati.length === 0 ? (
            <li className="px-4 py-3 text-[15px]">Nessuna pagina per questa ricerca.</li>
          ) : (
            risultati.map((voce) => (
              <li key={voce.href} className="border-b border-solid border-bordo last:border-b-0">
                <a href={voce.href} className="block px-4 py-3 font-bold hover:text-terracotta">
                  {voce.titolo}
                </a>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
