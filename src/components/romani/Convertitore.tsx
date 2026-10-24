import type { JSX } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { convertiTesto } from '../../lib/romani';

function leggi(testo: string): { risultato: string; scomposizione: string; errore: string } {
  try {
    const esito = convertiTesto(testo);
    return { ...esito, errore: '' };
  } catch (errore) {
    const messaggio = errore instanceof Error ? errore.message : 'Questo numero non si converte.';
    return { risultato: '', scomposizione: '', errore: messaggio };
  }
}

export default function Convertitore() {
  const [testo, setTesto] = useState('');
  const [esito, setEsito] = useState({ risultato: '', scomposizione: '', errore: '' });

  useEffect(() => {
    const valore = new URLSearchParams(window.location.search).get('n') ?? '';
    if (!valore) return;
    setTesto(valore);
    setEsito(leggi(valore));
  }, []);

  function applica(valore: string) {
    setTesto(valore);
    setEsito(leggi(valore));
  }

  function invia(evento: JSX.TargetedSubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEsito(leggi(testo));
  }

  return (
    <form method="get" action="/numeri-romani/convertitore/" className="mt-4 max-w-xl" onSubmit={invia}>
      <label className="no-stampa mb-1 block text-[14px] font-bold" htmlFor="numero-romano">
        Numero arabo o romano
      </label>
      <div className="no-stampa flex flex-wrap gap-3">
        <input
          id="numero-romano"
          name="n"
          value={testo}
          inputMode="text"
          autoComplete="off"
          className="min-h-11 min-w-0 flex-1 rounded-[10px] border-[1.5px] border-solid border-pill bg-white px-3 text-[18px]"
          onInput={(evento) => applica(evento.currentTarget.value)}
        />
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-[10px] border-0 bg-terracotta px-4 font-bold text-white"
        >
          Converti
        </button>
      </div>
      <div aria-live="polite" className="mt-4 min-h-16">
        {esito.risultato ? <p className="numeri-ora m-0 font-display text-[56px] leading-none font-semibold">{esito.risultato}</p> : null}
        {esito.scomposizione ? <p className="numeri-ora mt-2 mb-0 text-[20px]">{esito.scomposizione}</p> : null}
        {esito.errore ? <p className="mt-2 mb-0">{esito.errore}</p> : null}
      </div>
    </form>
  );
}
