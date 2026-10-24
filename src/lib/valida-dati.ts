import type { CalendarioVoce, CartinaDato, RegioneDato } from '../data/schemi';

const INIZIO_ANNO = '2026-09-01';
const FINE_ANNO = '2027-06-30';

function fuoriAnno(iso: string): boolean {
  return iso < INIZIO_ANNO || iso > FINE_ANNO;
}

export function erroriCalendario(regioni: RegioneDato[], voci: CalendarioVoce[]): string[] {
  const errori: string[] = [];
  const attese = new Set(regioni.map((regione) => regione.slug));
  const presenti = new Set(voci.map((voce) => voce.slug));

  for (const slug of attese) {
    if (!presenti.has(slug)) errori.push(`Manca il calendario di ${slug}`);
  }
  for (const slug of presenti) {
    if (!attese.has(slug)) errori.push(`Calendario sconosciuto: ${slug}`);
  }

  for (const voce of voci) {
    if (voce.stato === 'ufficiale' && !voce.fonte?.url) {
      errori.push(`${voce.slug}: stato ufficiale senza fonte.url`);
    }

    const date = [
      voce.inizio,
      voce.fine,
      voce.natale?.dal,
      voce.natale?.al,
      voce.pasqua.dal,
      voce.pasqua.al,
      ...voce.ponti.map((ponte) => ponte.data),
      voce.patrono?.data ?? null,
    ].filter((data): data is string => Boolean(data));

    for (const data of date) {
      if (fuoriAnno(data)) {
        errori.push(`${voce.slug}: ${data} è fuori dal 01/09/2026–30/06/2027`);
      }
    }

    if (voce.inizio && voce.fine && voce.fine < voce.inizio) {
      errori.push(`${voce.slug}: la fine ${voce.fine} precede l’inizio ${voce.inizio}`);
    }
  }

  return errori;
}

export function erroriConfinanti(regioni: RegioneDato[]): string[] {
  const perSlug = new Map(regioni.map((regione) => [regione.slug, regione]));
  const errori: string[] = [];
  for (const regione of regioni) {
    for (const vicino of regione.confinanti) {
      const altro = perSlug.get(vicino);
      if (!altro) {
        errori.push(`${regione.slug}: confinante sconosciuto ${vicino}`);
        continue;
      }
      if (!altro.confinanti.includes(regione.slug)) {
        errori.push(`${regione.slug} confina con ${vicino}, ma non il contrario`);
      }
    }
  }
  return errori;
}

export function erroriCartine(cartine: CartinaDato[]): string[] {
  return cartine.filter((cartina) => cartina.credit.trim().length === 0).map((cartina) => `${cartina.slug}: manca il credit`);
}
