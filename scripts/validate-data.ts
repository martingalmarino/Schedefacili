import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARTINE } from '../src/data/cartine.ts';
import { schemaCalendario, schemaFestivita, schemaParole, schemaRegioni } from '../src/data/schemi.ts';
import { erroriCalendario, erroriCartine, erroriConfinanti } from '../src/lib/valida-dati.ts';

const radice = join(dirname(fileURLToPath(import.meta.url)), '..');

function leggi(relativo: string): unknown {
  return JSON.parse(readFileSync(join(radice, relativo), 'utf8'));
}

const errori: string[] = [];

const regioni = schemaRegioni.parse(leggi('src/data/regioni.json'));
const calendario = schemaCalendario.parse(leggi('src/data/calendario/2026-2027.json'));
if (regioni.voci.length !== 21) errori.push(`Servono 21 territori, trovati ${regioni.voci.length}`);
errori.push(...erroriCalendario(regioni.voci, calendario.voci));
errori.push(...erroriConfinanti(regioni.voci));

const festivita = schemaFestivita.array().parse(leggi('src/data/festivita.json'));

const temi = readdirSync(join(radice, 'src/data/parole')).filter((nome) => nome.endsWith('.json'));
const attesi = ['animali', 'stagioni', 'natale', 'corpo-umano', 'frutta', 'scuola', 'colori', 'mestieri'];
for (const tema of attesi) {
  if (!temi.includes(`${tema}.json`)) errori.push(`Manca il tema ${tema}`);
}
for (const file of temi) {
  const dato = schemaParole.parse(leggi(`src/data/parole/${file}`));
  if (dato.tema !== file.replace(/\.json$/, '')) {
    errori.push(`${file}: il tema non coincide con il nome del file`);
  }
}

errori.push(...erroriCartine(CARTINE));
if (CARTINE.length !== 21) errori.push(`Servono 21 cartine, trovate ${CARTINE.length}`);

if (errori.length > 0) {
  for (const errore of errori) console.error(errore);
  process.exit(1);
}

console.log(`Dati ok: ${regioni.voci.length} territori, ${festivita.length} festività, ${temi.length} temi, ${CARTINE.length} cartine.`);
