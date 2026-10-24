# Schede Facili — Arquitectura del sitio (borrador v1)

Dominio de trabajo: **schedefacili.com** (tentativo). Stack: el mismo de Aulita (Astro + Tailwind + Preact islands, Vercel, AdSense). Idioma único: italiano (`<html lang="it">`, `og:locale it_IT`). Sin hreflang: es un dominio independiente, no una versión de Aulita.

## 1. Mapa del sitio

| Sección | URL | Páginas | Fase |
|---|---|---|---|
| Home | `/` | 1 | MVP |
| Calendario hub | `/calendario-scolastico/` | 1 | MVP |
| Calendario anual nacional | `/calendario-scolastico/2026-2027/` | 1 | MVP |
| Calendario por región (19 regiones + Trento + Bolzano) | `/calendario-scolastico/2026-2027/veneto/` … | 21 | MVP |
| Ponti e festività 2026/27 | `/calendario-scolastico/2026-2027/ponti-e-festivita/` | 1 | MVP |
| Tabelline hub | `/tabelline/` | 1 | MVP |
| Tabellina singola 1–10 | `/tabelline/tabellina-del-7/` | 10 | MVP |
| Tavola pitagorica | `/tabelline/tavola-pitagorica/` | 1 | MVP |
| Generatori hub | `/generatori/` | 1 | MVP |
| Generatore tabelline (con modalità DSA) | `/generatori/tabelline/` | 1 | MVP |
| Generatore crucipuzzle | `/generatori/crucipuzzle/` | 1 | MVP |
| Crucipuzzle a tema (animali, stagioni, Natale, corpo umano, frutta, scuola, colori, mestieri) | `/crucipuzzle/animali/` … | 8 | MVP |
| Generatore cruciverba | `/generatori/cruciverba/` | 1 | Fase 2 |
| Generatore pregrafismo | `/generatori/pregrafismo/` | 1 | Fase 2 |
| Cartine mute hub | `/cartine-mute/` | 1 | MVP |
| Italia (muta, regioni, capoluoghi) | `/cartine-mute/italia/` | 1 | MVP |
| Regioni (20) | `/cartine-mute/regioni/lombardia/` … | 20 | MVP |
| Europa | `/cartine-mute/europa/` | 1 | Fase 2 |
| Ricorrenze hub | `/ricorrenze/` | 1 | Fase 2 |
| Ricorrenze (27-gennaio, carnevale, 8-marzo, festa-del-papa, 25-aprile, 1-maggio, festa-della-mamma, 2-giugno, festa-dei-nonni, 4-ottobre, natale) | `/ricorrenze/25-aprile/` … | 11 | Fase 2 |
| Schede DSA hub | `/schede-dsa/` | 1 | Fase 2 |
| Schede DSA (tabelline-dsa, crucipuzzle-dsa, font-leggibile) | `/schede-dsa/tabelline-dsa/` … | 3 | Fase 2 |
| Pregrafismo (linee, cerchi, onde, zig-zag) | `/pregrafismo/` + 4 | 5 | Fase 2 |
| Legales/institucional | `/chi-siamo/`, `/contatti/`, `/privacy/`, `/cookie/`, `/termini/`, `/fonti-e-licenze/` | 6 | MVP |

**MVP: 76 páginas** (1 home + 25 calendario + 12 tabelline + 3 generatori + 8 crucipuzzle a tema + 22 cartine + 6 legales/institucionales). **Fase 2: +25** (cruciverba 1, generador pregrafismo 1, Europa 1, ricorrenze 12, DSA 4, pregrafismo 6 con hub) → ~101 en total.

Prioridad interna del MVP: calendario primero (temporada: búsquedas suben agosto–septiembre y antes de cada puente; el año 2026/27 ya está en curso, así que también arrancar con 2027/28 apenas salgan las delibere regionales, normalmente entre marzo y junio).

## 2. Navegación
- Header: Logo · Calendario · Tabelline · Generatori · Cartine mute · (Fase 2: Ricorrenze, DSA). En móvil: menú hamburguesa + buscador.
- Breadcrumbs en todas las páginas internas (`Home › Calendario scolastico › 2026/27 › Veneto`).
- Footer "super footer" igual al de Aulita: Strumenti, Calendario per regione (las 6 más buscadas + "tutte"), Cartine, Prossime ricorrenze (automático), Chi siamo/legales, línea de fuentes (MIM, ISTAT CC BY 4.0).

## 3. Home (orden)
1. Franja: "Prossima ricorrenza: 2 novembre… / Prossimo ponte: 8 dicembre" (calculada en el navegador).
2. Hero: H1 "Schede didattiche da stampare, pronte in un minuto" + subtítulo + buscador + CTA principal "Trova il calendario della tua regione".
3. Tres números reales: 21 calendari regionali · 22 cartine mute · 10 tabelline.
4. Selector de región (pills de las 21) → calendario.
5. Grupos de pills: Schede da stampare / Generatori / Cartine mute / Ricorrenze.
6. Bloque AEO "In breve" (respuesta directa a qué es el sitio).
7. FAQ (3–4 preguntas) + footer.

## 4. Templates
1. `HomeLayout` 2. `HubSezione` (lista + intro + FAQ) 3. `CalendarioRegione` 4. `CalendarioNazionale` (tabla comparativa) 5. `TabellinaSingola` 6. `GeneratorePage` (island + texto SEO debajo) 7. `CrucipuzzleTema` 8. `CartinaMuta` 9. `Ricorrenza` 10. `PaginaLegale`.

## 5. Archivos de datos y fuentes
| Archivo | Contenido | Fuente |
|---|---|---|
| `src/data/calendario/2026-2027.json` | por región: `stato` (`ufficiale`/`da-confermare`), inizio, fine, vacanze natale/pasqua, ponti, festa patrono, `fonte` (URL delibera) | Resumen MIM (PDF) + delibera de cada región |
| `src/data/festivita.json` | feriados nacionales (incl. 4 de octubre, nuevo feriado nacional desde 2026) + Pascua calculada | Ley / Gazzetta Ufficiale |
| `src/data/regioni.json` | 20 regiones + 2 prov. autónomas, slug, capoluogo, province | ISTAT |
| `src/data/cartine/*.svg` | límites simplificados | ISTAT confini amministrativi, CC BY 4.0 (atribución obligatoria en página y en el PDF) |
| `src/data/parole/*.json` | listas de palabras por tema (crucipuzzle/cruciverba) | redacción propia |
| `src/data/ricorrenze.json` | fecha, tipo, texto, slug | redacción propia + fuentes oficiales |
| `src/data/sito.json` | nombre, email, dominio, redes | — |

Regla: ninguna fecha regional sin `fonte`; si falta → `da-confermare` y aviso automático (mismo mecanismo que Aulita).

## 6. Enlazado interno (hub & spoke)
- Cada hub enlaza a todos sus hijos; cada hijo enlaza al hub, a 3–4 hermanos (regiones limítrofes, tabellina anterior/siguiente) y a 1–2 secciones cruzadas: región del calendario → su cartina muta; tabellina → generatore tabelline y versión DSA; ricorrenza → crucipuzzle a tema.
- Footer y home solo enlazan hubs y páginas top, nunca páginas finas.

## 7. SEO por template (títulos ≤ 60, meta ≤ 155)
| Template | Title | Meta description | H1 | Schema |
|---|---|---|---|---|
| Calendario regione | `Calendario scolastico 2026/27 Veneto: date e ponti` | `Quando inizia e finisce la scuola in Veneto nel 2026/27: vacanze di Natale e Pasqua, ponti e festività. Calendario da stampare in A4.` | `Calendario scolastico 2026/2027 del Veneto` | BreadcrumbList, FAQPage, WebPage(dateModified) |
| Calendario nazionale | `Calendario scolastico 2026/27: tutte le regioni` | `Inizio e fine della scuola regione per regione, vacanze e ponti 2026/27 in una tabella. Con calendario stampabile.` | `Calendario scolastico 2026/2027 regione per regione` | BreadcrumbList, FAQPage, Dataset (opcional) |
| Tabellina | `Tabellina del 7 da stampare (PDF A4) e esercizi` | `La tabellina del 7 da stampare in PDF, con esercizi a completamento e versione DSA ad alta leggibilità. Gratis.` | `Tabellina del 7 da stampare` | BreadcrumbList, LearningResource, FAQPage |
| Generatore | `Generatore di crucipuzzle gratis da stampare` | `Crea un crucipuzzle personalizzato in pochi secondi: scegli le parole, la griglia e stampa in A4 con le soluzioni.` | `Generatore di crucipuzzle` | WebApplication (applicationCategory EducationalApplication, price 0), BreadcrumbList |
| Crucipuzzle tema | `Crucipuzzle sugli animali da stampare (con soluzioni)` | … | `Crucipuzzle sugli animali` | LearningResource, BreadcrumbList |
| Cartina muta | `Cartina muta della Lombardia da stampare (PDF)` | `Cartina muta della Lombardia con province, fisica e politica, da stampare in A4. Dati ISTAT.` | `Cartina muta della Lombardia` | ImageObject (license, creditText ISTAT), BreadcrumbList |
| Ricorrenza | `25 aprile per la scuola primaria: schede e attività` | … | `25 aprile: schede per la scuola primaria` | LearningResource, BreadcrumbList, FAQPage (sin `Event`) |
| Home | `Schede Facili – schede didattiche e calendario scolastico` | … | ver arriba | WebSite (+SearchAction), Organization |

**GEO/AEO:** en cada página un bloque "In breve" de 2–3 frases arriba con la respuesta directa ("In Veneto la scuola inizia il … e finisce il …"), "Aggiornato il …" visible, fuente enlazada, FAQ con preguntas reales del autocompletado ("quando iniziano le vacanze di natale in veneto 2026"). Canonical en todas; `?q=` → canonical limpio. Sitemap XML + IndexNow como en Aulita. Search Console: propiedad de dominio con país objetivo Italia (no aplica geotargeting manual en .com moderno, basta idioma + contenido).

**hreflang:** no hace falta (dominio independiente, un solo idioma). Si algún día se enlaza con Aulita, solo un link en "Chi siamo".

## 8. Legales / UE
- `/privacy/` (GDPR, base jurídica, titular, derechos, Garante Privacy), `/cookie/` (lista de cookies, cómo revocar), `/termini/`, `/fonti-e-licenze/` (ISTAT CC BY 4.0, OpenDyslexic SIL OFL, fuentes Google Fonts OFL).
- **CMP certificada por Google con TCF 2.2** (obligatoria para AdSense en EEE): opción más simple = la "Privacy & messaging" de AdSense (gratis); alternativas Iubenda, Cookiebot. Reemplaza la island `Consentimiento.tsx` de Aulita. Google Consent Mode v2.
- Titular de la web: Martin en Argentina; hay que declararlo en la privacy (transferencia de datos fuera de UE).

## 9. Qué se reutiliza de Aulita
- Directo (copiar y traducir): `lib/wordsearch.ts`, `crossword.ts`, `math.ts`, `prng.ts`, `normalize.ts`, `seo.ts`, `meta.ts` (+ tests), islands `SopaGenerator`, `CrucigramaGenerator`, `OperacionesGenerator`, `ProximasEfemerides`, `preview.tsx`; componentes `Breadcrumbs`, `Preguntas`, `CalendarioAnual`, `ListaFeriados`, `Footer` (+ `footer.ts`), `Anuncio`; `calendario-escolar.ts` + su lógica "a confirmar"; `scripts/validate-data.ts`.
- Adaptar: `calendario.ts` (Pascua y ponti italianos, no hay trasladables), `normalize.ts` (apóstrofos/“l'”), `siluetas.py` → script para generar SVG desde shapefile ISTAT.
- No reutilizar: datos argentinos, `Consentimiento.tsx` (reemplazar por CMP), mapas IGN, textos.
- Recomendación: repo nuevo (copia), no monorepo, para que los cambios de Aulita no rompan el italiano.

## 10. Marca y diseño
- Paleta: Terracotta `#C2522D` (acción/CTA), Verde salvia `#3F6B4E` (secundario, calendario), Inchiostro `#1F2A44` (texto), Carta `#FBF6EE` (fondo), Ocra `#E0A526` (resaltados). Contraste texto/fondo AA verificado para inchiostro sobre carta y blanco sobre terracotta/verde.
- Tipografías (Google Fonts, licencia SIL OFL 1.1, uso comercial libre): **Fraunces** (títulos, aire editorial italiano) + **Atkinson Hyperlegible** (texto; diseñada para baja visión, coherente con el enfoque DSA). Modo DSA de las fichas: **OpenDyslexic** (SIL OFL).
- Logo provisorio: wordmark "schede facili" en Fraunces con una tilde de lápiz terracotta.
