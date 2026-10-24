import { mescola as mescolaLista, mulberry32 } from '../prng';

export interface Rng {
  successivo(): number;
  intero(min: number, max: number): number;
  scegli<T>(voci: readonly T[]): T;
  mescola<T>(voci: readonly T[]): T[];
}

export function creaRng(seme: number): Rng {
  const casuale = mulberry32(seme >>> 0);
  return {
    successivo: casuale,
    intero(min, max) {
      const basso = Math.ceil(min);
      const alto = Math.floor(max);
      return basso + Math.floor(casuale() * (alto - basso + 1));
    },
    scegli(voci) {
      return voci[Math.floor(casuale() * voci.length)] as T;
    },
    mescola(voci) {
      return mescolaLista([...voci], casuale);
    },
  };
}
