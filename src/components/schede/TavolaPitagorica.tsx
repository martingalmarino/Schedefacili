import { useState } from 'preact/hooks';
import { tavolaPitagorica } from '../../lib/tabelline';

const NUMERI = tavolaPitagorica();

export default function TavolaPitagorica() {
  const [vuota, setVuota] = useState(false);
  const [sopra, setSopra] = useState<{ riga: number; colonna: number } | null>(null);

  return (
    <div>
      <div className="no-stampa mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={!vuota}
          className={`cursor-pointer rounded-full border-[1.5px] border-solid px-4 py-2 font-bold ${vuota ? 'border-pill bg-white' : 'border-salvia bg-salvia text-white'}`}
          onClick={() => setVuota(false)}
        >
          Tavola completa
        </button>
        <button
          type="button"
          aria-pressed={vuota}
          className={`cursor-pointer rounded-full border-[1.5px] border-solid px-4 py-2 font-bold ${vuota ? 'border-salvia bg-salvia text-white' : 'border-pill bg-white'}`}
          onClick={() => setVuota(true)}
        >
          Tavola vuota
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="scheda-numeri w-full min-w-[640px] border-collapse bg-white text-center text-[22px]" onMouseLeave={() => setSopra(null)}>
          <thead>
            <tr>
              <th className="bg-salvia p-2 text-[15px] text-white">×</th>
              {NUMERI[0]?.map((_, indice) => (
                <th key={indice} className="bg-salvia p-2 text-[15px] text-white">
                  {indice + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NUMERI.map((riga, indiceRiga) => (
              <tr key={indiceRiga}>
                <th className="bg-salvia p-2 text-[15px] text-white">{indiceRiga + 1}</th>
                {riga.map((valore, indiceColonna) => {
                  const attiva = sopra?.riga === indiceRiga || sopra?.colonna === indiceColonna;
                  const precisa = sopra?.riga === indiceRiga && sopra?.colonna === indiceColonna;
                  return (
                    <td
                      key={indiceColonna}
                      className={`border border-solid border-[#eee] p-2 ${precisa ? 'bg-[#FFE7A8]' : attiva ? 'bg-[#F3EFE4]' : ''}`}
                      onMouseEnter={() => setSopra({ riga: indiceRiga, colonna: indiceColonna })}
                    >
                      {vuota ? '' : valore}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 min-h-6 text-muted" aria-live="polite">
        {sopra && !vuota ? `${sopra.riga + 1} × ${sopra.colonna + 1} = ${NUMERI[sopra.riga]?.[sopra.colonna]}` : ''}
      </p>
    </div>
  );
}
