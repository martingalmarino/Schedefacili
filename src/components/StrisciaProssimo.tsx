import { useState } from 'preact/hooks';
import festivita from '../data/festivita.json';
import { prossimaRicorrenza, testoQuando, type Festivita } from '../lib/ricorrenze';

export default function StrisciaProssimo() {
  const [voce] = useState(() => prossimaRicorrenza(festivita as Festivita[], new Date()));
  if (!voce) return null;

  return (
    <div className="striscia bg-salvia px-6 py-2 text-center text-[15px] leading-snug text-white">
      Prossima ricorrenza: <b className="text-[#FFE7A8]">{voce.etichetta}</b>, {voce.nome} · {testoQuando(voce.giorni)}
      {voce.schede ? <a href={voce.schede}> → schede pronte</a> : null}
    </div>
  );
}
