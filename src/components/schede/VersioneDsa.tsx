import { useEffect, useState } from 'preact/hooks';

interface Props {
  targetId?: string;
}

function leggiDsa(): boolean {
  return new URLSearchParams(window.location.search).get('dsa') === '1';
}

function applicaDsa(attivo: boolean, targetId: string) {
  document.getElementById(targetId)?.classList.toggle('dsa', attivo);
  const url = new URL(window.location.href);
  if (attivo) url.searchParams.set('dsa', '1');
  else url.searchParams.delete('dsa');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export default function VersioneDsa({ targetId = 'scheda' }: Props) {
  const [attivo, setAttivo] = useState(false);

  useEffect(() => {
    const acceso = leggiDsa();
    setAttivo(acceso);
    document.getElementById(targetId)?.classList.toggle('dsa', acceso);
  }, [targetId]);

  return (
    <button
      type="button"
      aria-pressed={attivo}
      className={`cursor-pointer rounded-full border-[1.5px] border-solid px-4 py-2 text-[15px] font-bold ${attivo ? 'border-salvia bg-salvia text-white' : 'border-pill bg-white text-inchiostro'}`}
      onClick={() => {
        const prossimo = !attivo;
        setAttivo(prossimo);
        applicaDsa(prossimo, targetId);
      }}
    >
      Versione DSA (carattere ad alta leggibilità)
    </button>
  );
}
