# Guía de estilo y glosario — italiano de Schede Facili

## 1. Lectores y tono
Lectores: insegnanti di scuola primaria e dell'infanzia (mayoría) y genitori. Tono: cálido, práctico, de colega a colega; frases cortas, sin marketing.

**Decisión: tutear ("tu").** Justificación: es lo habitual en los sitios didácticos italianos que más tráfico tienen (maestramary, lapappadolce y blogs de maestre), en apps y en la comunicación web de marcas cercanas; el "Lei" suena burocrático o comercial en este nicho. Excepción: páginas legales (privacy, cookie, termini) en registro impersonal ("l'utente", "si informa che").
Para dirigirse a ambos públicos, usar forme neutre: "Stampa la scheda e consegnala alla classe" / "per i tuoi alunni o i tuoi figli".

## 2. Glosario obligatorio
| Usar | Significado | Evitar |
|---|---|---|
| scuola dell'infanzia | jardín (3–5) | asilo (coloquial, aceptable solo en textos para padres), kindergarten |
| scuola primaria | primaria (5 años) | scuola elementare (antiguo; se puede como sinónimo SEO una vez) |
| scuola secondaria di primo grado | secundaria baja ("le medie") | |
| classe prima, seconda… quinta | grado | primo grado, primo anno |
| insegnanti, maestra/maestro | docente | docenti (ok en contexto formal), professori (secundaria) |
| alunni, bambini | alumnos | studenti (secundaria/univ.) |
| Indicazioni nazionali | diseño curricular | curricolo nazionale |
| DSA (disturbi specifici dell'apprendimento) | dislexia, discalculia… | "bambini dislessici" como etiqueta → "alunni con DSA" |
| BES (bisogni educativi speciali) | | |
| insegnante di sostegno | maestro integrador | |
| PEI / PDP | planes individualizados | |
| pregrafismo | grafomotricidad | prescrittura |
| schede operative / schede didattiche | fichas | fogli di lavoro (calco de worksheet; aceptable pero menos buscado) |
| verifica / verifiche | evaluación escrita | test, esame |
| compiti (per casa) | tarea | |
| tabelline | tablas de multiplicar | tavole di moltiplicazione |
| tavola pitagorica | tabla pitagórica | |
| crucipuzzle | sopa de letras | zuppa di lettere, cerca parole (este último es sinónimo válido) |
| cruciverba | crucigrama | |
| cartina muta | mapa mudo | mappa muta (menos usado) |
| ricorrenze / giornate | efemérides | effemeridi (significa otra cosa) |
| ponte | fin de semana largo escolar | |
| vacanze di Natale / di Pasqua | receso | |
| delibera regionale | resolución | risoluzione |
| inizio / fine delle lezioni | | |

## 3. Calcos prohibidos
Del español: "realizzare una scheda" (→ preparare/creare), "imprimere" (→ stampare), "attualmente" usado como "en la actualidad" ok, pero no como "realmente"; "la maestra jardinera"; "efemeridi"; "grado" por "classe"; "approfittare" excesivo; "in base a" repetido; "dettagli" por "particolari" ok; "di forma gratuita" (→ gratis/gratuitamente); "ottenere" en exceso; "è importante che" en cada párrafo; "ritmo" de frases con "e" + gerundio.
Del inglés: "scaricabile gratuitamente" ok, pero no "free download"; "worksheet"; "step by step" (→ passo dopo passo); "user friendly"; "andare a + inf." ("andiamo a vedere"); "supportare" por "sostenere/aiutare"; "evento" por "ricorrenza"; "implementare"; "realizzare" por "rendersi conto"; "assolutamente sì" como muletilla; Title Case en títulos (en italiano solo mayúscula inicial: "Calendario scolastico del Veneto").

## 4. Formatos
- Fechas: "14 settembre 2026", "lunedì 14 settembre"; meses y días en minúscula; abreviado 14/09/2026. Año escolar "2026/27" o "2026/2027" (nunca "2026-27" en texto; sí en URL).
- Números: separador de miles punto (1.250), decimal coma (0,5). Horas 8:30 o 8.30.
- Comillas « » o " " ; apóstrofo tipográfico ’ en texto visible (l’alunno), recto en código.
- Acentos: è/é correctos (perché, poiché, è, caffè); "po’" con apóstrofo, nunca "pò".
- Moneda: no aplica. Unidades: "foglio A4".

## 5. Cómo lograr un italiano natural con IA
1. Escribir directamente en italiano (prompt en italiano), nunca traducir de Aulita.
2. Dar al modelo este glosario y 2–3 párrafos de referencia de sitios italianos reales como modelo de registro (no copiar).
3. Pedir frases de 12–20 palabras, verbos concretos, ejemplos de aula ("in classe seconda puoi usarla come ripasso dopo l'intervallo").
4. Prohibir muletillas de IA: "In un mondo sempre più…", "scopriamo insieme", "è fondamentale", "non solo… ma anche" repetido, listas de tres adjetivos, emojis.
5. Segundo pase de revisión con otro modelo (prompt abajo) + verificación con LanguageTool (gratis, con italiano).
6. Validación humana barata: pedir a 2–3 maestras en grupos de Facebook/Telegram o Fiverr/Preply (~10–20 € por página) que lean home, calendario y una tabellina. Aceptar correcciones como regla del glosario.

## 6. Checklist QA
- [ ] Tuteo coherente (salvo legales)
- [ ] Términos del glosario, ninguno de la columna "evitar"
- [ ] Fechas y números en formato italiano
- [ ] Sin Title Case, sin emojis, sin muletillas de IA
- [ ] Fecha oficial con fuente enlazada; si no, "da confermare"
- [ ] Title ≤ 60, meta ≤ 155, H1 único, bloque "In breve" presente
- [ ] LanguageTool sin errores

### Prompt de revisión (segundo pase)
```
Sei una maestra di scuola primaria italiana con 20 anni di esperienza e scrivi per un blog didattico.
Rivedi il testo seguente. Obiettivo: che sembri scritto da un'insegnante italiana, non tradotto e non generato.
1. Segnala e correggi calchi dallo spagnolo o dall'inglese, termini scolastici errati (usa: scuola primaria, classe prima, alunni, schede operative, verifiche, DSA, BES, pregrafismo, cartina muta, crucipuzzle) e formule tipiche dei testi generati ("scopriamo insieme", "è fondamentale", "in un mondo sempre più").
2. Mantieni il "tu" rivolto all'insegnante o al genitore; frasi brevi e concrete.
3. Date nel formato "14 settembre 2026", numeri con la virgola decimale.
4. Non aggiungere informazioni né date nuove.
Restituisci: (a) il testo corretto; (b) una tabella "originale → corretto → motivo".
TESTO:
"""
...
"""
```
