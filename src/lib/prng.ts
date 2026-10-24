export function mulberry32(seme: number): () => number {
  let stato = seme >>> 0;
  return () => {
    stato = (stato + 0x6d2b79f5) | 0;
    let valore = Math.imul(stato ^ (stato >>> 15), 1 | stato);
    valore = (valore + Math.imul(valore ^ (valore >>> 7), 61 | valore)) ^ valore;
    return ((valore ^ (valore >>> 14)) >>> 0) / 4294967296;
  };
}

export function mescola<T>(voci: T[], casuale: () => number): T[] {
  const copia = [...voci];
  for (let indice = copia.length - 1; indice > 0; indice -= 1) {
    const altro = Math.floor(casuale() * (indice + 1));
    const attuale = copia[indice];
    copia[indice] = copia[altro] as T;
    copia[altro] = attuale as T;
  }
  return copia;
}
