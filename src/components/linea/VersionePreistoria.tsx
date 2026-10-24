import { useEffect, useRef, useState } from 'preact/hooks';

type Modo = 'completa' | 'vuota' | 'dsa';

const MODI: { id: Modo; etichetta: string }[] = [
  { id: 'completa', etichetta: 'Completa' },
  { id: 'vuota', etichetta: 'Da completare' },
  { id: 'dsa', etichetta: 'DSA' },
];

function applica(modo: Modo) {
  const scheda = document.getElementById('scheda');
  scheda?.classList.toggle('dsa', modo === 'dsa');
  scheda?.classList.toggle('versione-vuota', modo === 'vuota');
  const url = new URL(window.location.href);
  if (modo === 'dsa') url.searchParams.set('dsa', '1');
  else url.searchParams.delete('dsa');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export default function VersionePreistoria() {
  const [modo, setModo] = useState<Modo>('completa');
  const ignora = useRef(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('dsa') === '1') {
      setModo('dsa');
      applica('dsa');
    }
    const su = (evento: Event) => {
      if (ignora.current) {
        ignora.current = false;
        return;
      }
      const acceso = Boolean((evento as CustomEvent<boolean>).detail);
      setModo((corrente) => {
        const prossimo: Modo = acceso ? 'dsa' : corrente === 'dsa' ? 'completa' : corrente;
        applica(prossimo);
        return prossimo;
      });
    };
    window.addEventListener('schedefacili-dsa', su);
    return () => window.removeEventListener('schedefacili-dsa', su);
  }, []);

  return (
    <div className="no-stampa mb-3 flex flex-wrap gap-2" role="tablist" aria-label="Versione della scheda">
      {MODI.map((voce) => {
        const scelto = modo === voce.id;
        return (
          <button
            key={voce.id}
            type="button"
            role="tab"
            aria-selected={scelto}
            className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-solid px-4 text-[15px] font-bold ${scelto ? 'border-salvia bg-salvia text-white' : 'border-pill bg-white text-inchiostro'}`}
            onClick={() => {
              setModo(voce.id);
              applica(voce.id);
              if (voce.id === 'dsa' || modo === 'dsa') {
                ignora.current = true;
                window.dispatchEvent(new CustomEvent('schedefacili-dsa', { detail: voce.id === 'dsa' }));
              }
            }}
          >
            {voce.etichetta}
          </button>
        );
      })}
    </div>
  );
}
