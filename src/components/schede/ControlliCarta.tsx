import { useEffect, useState } from 'preact/hooks';

interface Props {
  dettaglio: string;
}

function classe(acceso: boolean) {
  return `cursor-pointer rounded-full border-[1.5px] border-solid px-4 py-2 font-bold ${acceso ? 'border-salvia bg-salvia text-white' : 'border-pill bg-white text-inchiostro'}`;
}

export default function ControlliCarta({ dettaglio }: Props) {
  const [confini, setConfini] = useState(false);
  const [capoluoghi, setCapoluoghi] = useState(false);

  useEffect(() => {
    const carta = document.getElementById('carta');
    carta?.classList.toggle('con-dettaglio', confini);
    carta?.classList.toggle('con-capoluoghi', capoluoghi);
  }, [confini, capoluoghi]);

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" aria-pressed={!confini && !capoluoghi} className={classe(!confini && !capoluoghi)} onClick={() => { setConfini(false); setCapoluoghi(false); }}>
        Muta
      </button>
      <button type="button" aria-pressed={confini} className={classe(confini)} onClick={() => setConfini((acceso) => !acceso)}>
        {dettaglio}
      </button>
      <button type="button" aria-pressed={capoluoghi} className={classe(capoluoghi)} onClick={() => setCapoluoghi((acceso) => !acceso)}>
        Con i capoluoghi
      </button>
    </div>
  );
}
