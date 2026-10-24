import { z } from 'zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const dataIso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const dataONull = dataIso.nullable();

export const schemaRegione = z.object({
  nome: z.string().min(1),
  slug,
  capoluogo: z.string().min(1),
  confinanti: z.array(slug),
  cartina: slug,
  ordinePopolazione: z.number().int().positive().optional(),
});

export const schemaRegioni = z.object({
  fontePopolazione: z.string().regex(/^https:\/\//),
  riferimentoPopolazione: z.string().min(1),
  voci: z.array(schemaRegione).length(21),
});

export const schemaFonte = z.object({
  titolo: z.string().min(1),
  url: z.string().regex(/^https:\/\//),
  pagina: z.string().min(1).optional(),
  consultato: dataIso,
});

const schemaIntervallo = z.object({ dal: dataONull, al: dataONull });

export const schemaCalendarioVoce = z.object({
  slug,
  stato: z.enum(['ufficiale', 'in-attesa']),
  inizio: dataONull,
  fine: dataONull,
  natale: schemaIntervallo.nullable(),
  pasqua: schemaIntervallo,
  ponti: z.array(z.object({ data: dataIso, motivo: z.string().min(1) })),
  patrono: z.object({ data: dataIso, nome: z.string().min(1) }).optional(),
  fonte: schemaFonte.nullable(),
  nota: z.string().min(1).optional(),
});

const schemaFestivitaNazionale = z.object({
  stato: z.enum(['ufficiale', 'in-attesa']),
  nome: z.string().min(1),
  fonte: schemaFonte,
});

export const schemaCalendario = z
  .object({
    anno: z.string().min(1),
    festivitaNazionali: z.record(z.string().min(1), schemaFestivitaNazionale),
    regioni: z.record(slug, schemaCalendarioVoce.omit({ slug: true })),
  })
  .superRefine((dato, contesto) => {
    const quante = Object.keys(dato.regioni).length;
    if (quante !== 21) {
      contesto.addIssue({
        code: 'custom',
        message: `Attese 21 regioni, trovate ${quante}`,
      });
    }
  })
  .transform((dato) => ({
    anno: dato.anno,
    festivitaNazionali: dato.festivitaNazionali,
    voci: Object.entries(dato.regioni).map(([slugRegione, voce]) => ({
      ...voce,
      slug: slugRegione,
    })),
  }));

export const schemaFestivita = z.object({
  data: dataIso,
  nome: z.string().min(1),
  fonte: z.string().regex(/^https:\/\//),
  tipo: z.enum(['festa', 'giornata']),
  stato: z.enum(['da-verificare']).optional(),
  calcolo: z.enum(['computus-gregoriano']).optional(),
  schede: z.string().optional(),
});

export const schemaParole = z.object({
  tema: slug,
  parole: z.array(z.string().regex(/^[A-Z]+$/)).min(20).max(30),
});

export const schemaCartina = z.object({
  slug,
  nome: z.string().min(1),
  svg: z.string().min(1),
  licenza: z.literal('CC BY 4.0'),
  credit: z.string().min(1),
  fonteUrl: z.string().regex(/^https:\/\//),
});

export type RegioneDato = z.infer<typeof schemaRegione>;
export type CalendarioVoce = z.infer<typeof schemaCalendarioVoce>;
export type FestivitaDato = z.infer<typeof schemaFestivita>;
export type CartinaDato = z.infer<typeof schemaCartina>;
