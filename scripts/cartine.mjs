import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = dirname(fileURLToPath(import.meta.url))
const ROOT = join(QUI, '..')
const CACHE = join(QUI, '.cache')
const ZIP = join(CACHE, 'Limiti01012026_g.zip')
const ZIP_URL = 'https://www.istat.it/storage/cartografia/confini_amministrativi/generalizzati/2026/Limiti01012026_g.zip'
const USCITA = join(ROOT, 'src/data/cartine')
const PUBBLICA = join(ROOT, 'public/cartine')

const SLUG = {
  1: 'piemonte',
  2: 'valle-d-aosta',
  3: 'lombardia',
  4: 'trentino-alto-adige',
  5: 'veneto',
  6: 'friuli-venezia-giulia',
  7: 'liguria',
  8: 'emilia-romagna',
  9: 'toscana',
  10: 'umbria',
  11: 'marche',
  12: 'lazio',
  13: 'abruzzo',
  14: 'molise',
  15: 'campania',
  16: 'puglia',
  17: 'basilicata',
  18: 'calabria',
  19: 'sicilia',
  20: 'sardegna',
}

const CAPOLUOGHI_ITALIA = new Set(['TO', 'AO', 'MI', 'TN', 'BZ', 'VE', 'TS', 'GE', 'BO', 'FI', 'PG', 'AN', 'RM', 'AQ', 'CB', 'NA', 'BA', 'PZ', 'CZ', 'PA', 'CA'])

const NOME = {
  piemonte: 'Piemonte',
  'valle-d-aosta': 'Valle d’Aosta',
  lombardia: 'Lombardia',
  'trentino-alto-adige': 'Trentino-Alto Adige',
  veneto: 'Veneto',
  'friuli-venezia-giulia': 'Friuli Venezia Giulia',
  liguria: 'Liguria',
  'emilia-romagna': 'Emilia-Romagna',
  toscana: 'Toscana',
  umbria: 'Umbria',
  marche: 'Marche',
  lazio: 'Lazio',
  abruzzo: 'Abruzzo',
  molise: 'Molise',
  campania: 'Campania',
  puglia: 'Puglia',
  basilicata: 'Basilicata',
  calabria: 'Calabria',
  sicilia: 'Sicilia',
  sardegna: 'Sardegna',
  italia: 'Italia',
}

function scarica() {
  mkdirSync(CACHE, { recursive: true })
  execFileSync('curl', ['-fsSL', '-A', 'schedefacili-cartine', '-o', ZIP, ZIP_URL], { stdio: 'inherit' })
  execFileSync('unzip', ['-qo', ZIP, '-d', CACHE], { stdio: 'inherit' })
}

function mapshaper(argomenti) {
  execFileSync('npx', ['--yes', 'mapshaper', ...argomenti], { stdio: 'inherit' })
}

function prepara() {
  const shp = join(CACHE, 'ProvCM01012026_g/ProvCM01012026_g_WGS84.shp')
  mapshaper([
    shp,
    '-filter-fields',
    'COD_REG,DEN_UTS,SIGLA',
    '-simplify',
    'visvalingam',
    '15%',
    'keep-shapes',
    '-o',
    'format=geojson',
    'precision=0',
    join(CACHE, 'province.geojson'),
    '-dissolve',
    'COD_REG',
    '-o',
    'format=geojson',
    'precision=0',
    join(CACHE, 'regioni.geojson'),
    '-dissolve',
    '-o',
    'format=geojson',
    'precision=0',
    join(CACHE, 'italia.geojson'),
  ])
}

function leggi(nome) {
  const dato = JSON.parse(readFileSync(join(CACHE, nome), 'utf8'))
  if (dato.type === 'FeatureCollection') return dato.features
  if (dato.type === 'GeometryCollection') {
    return dato.geometries.map((geometry) => ({ type: 'Feature', properties: {}, geometry }))
  }
  if (dato.type === 'Feature') return [dato]
  throw new Error(`GeoJSON non letto: ${nome}`)
}

function anelli(geometria) {
  if (geometria.type === 'Polygon') return geometria.coordinates
  if (geometria.type === 'MultiPolygon') return geometria.coordinates.flat()
  return []
}

function poligoni(geometria) {
  if (geometria.type === 'Polygon') return [geometria.coordinates]
  if (geometria.type === 'MultiPolygon') return geometria.coordinates
  return []
}

function areaAnello(anello) {
  let area = 0
  for (let indice = 0; indice < anello.length - 1; indice += 1) {
    const [x1, y1] = anello[indice]
    const [x2, y2] = anello[indice + 1]
    area += x1 * y2 - x2 * y1
  }
  return Math.abs(area) / 2
}

function centro(anello) {
  let area = 0
  let cx = 0
  let cy = 0
  for (let indice = 0; indice < anello.length - 1; indice += 1) {
    const [x1, y1] = anello[indice]
    const [x2, y2] = anello[indice + 1]
    const incrocio = x1 * y2 - x2 * y1
    area += incrocio
    cx += (x1 + x2) * incrocio
    cy += (y1 + y2) * incrocio
  }
  if (Math.abs(area) < 1) return anello[0]
  return [cx / (3 * area), cy / (3 * area)]
}

function dentro(punto, anello) {
  let interno = false
  const [x, y] = punto
  for (let indice = 0, precedente = anello.length - 1; indice < anello.length; precedente = indice, indice += 1) {
    const [x1, y1] = anello[indice]
    const [x2, y2] = anello[precedente]
    if (y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1) interno = !interno
  }
  return interno
}

function puntoInterno(geometria) {
  let migliore = null
  let area = 0
  for (const poligono of poligoni(geometria)) {
    const esterno = poligono[0]
    if (!esterno) continue
    const misura = areaAnello(esterno)
    if (misura > area) {
      area = misura
      migliore = esterno
    }
  }
  if (!migliore) return null
  const candidato = centro(migliore)
  if (dentro(candidato, migliore)) return candidato
  return migliore[Math.floor(migliore.length / 2)]
}

function estremi(features) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const feature of features) {
    for (const anello of anelli(feature.geometry)) {
      for (const [x, y] of anello) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }
  return { minX, minY, maxX, maxY }
}

function proiettore(box) {
  const margine = 16
  const larghezza = box.maxX - box.minX || 1
  const altezza = box.maxY - box.minY || 1
  const scala = 1000 / Math.max(larghezza, altezza)
  const vistaLarghezza = Math.round(larghezza * scala + margine * 2)
  const vistaAltezza = Math.round(altezza * scala + margine * 2)
  return {
    vista: `0 0 ${vistaLarghezza} ${vistaAltezza}`,
    punto(xy) {
      const x = (xy[0] - box.minX) * scala + margine
      const y = (box.maxY - xy[1]) * scala + margine
      return `${x.toFixed(1)} ${y.toFixed(1)}`
    },
  }
}

function tracciato(geometria, punto) {
  return poligoni(geometria)
    .map((poligono) => poligono.map((anello) => anello.map((xy, indice) => `${indice === 0 ? 'M' : 'L'}${punto(xy)}`).join('') + 'Z').join(''))
    .join('')
}

function documento(vista, corpo, etichetta) {
  return `<svg id="carta" xmlns="http://www.w3.org/2000/svg" viewBox="${vista}" role="img" aria-label="${etichetta}">
  <style>
    .dettaglio, .capoluoghi { display: none; }
    svg.con-dettaglio .dettaglio, svg.con-capoluoghi .capoluoghi { display: inline; }
  </style>
${corpo}
</svg>
`
}

function salva(slug, testo) {
  writeFileSync(join(USCITA, `${slug}.svg`), testo)
  writeFileSync(join(PUBBLICA, `${slug}.svg`), testo)
}

function genera() {
  const province = leggi('province.geojson')
  const regioni = leggi('regioni.geojson')
  const italia = leggi('italia.geojson')
  mkdirSync(USCITA, { recursive: true })
  mkdirSync(PUBBLICA, { recursive: true })

  const italiaGeom = italia[0]?.geometry
  if (!italiaGeom) throw new Error('Manca il contorno dell’Italia')
  const vistaItalia = proiettore(estremi(italia))
  const regioniItalia = regioni
    .map((feature) => {
      const slug = SLUG[feature.properties.COD_REG]
      if (!slug) throw new Error(`Regione senza slug: ${feature.properties.COD_REG}`)
      return `    <path data-regione="${slug}" d="${tracciato(feature.geometry, vistaItalia.punto)}"><title>${NOME[slug]}</title></path>`
    })
    .join('\n')
  const capoluoghiItalia = province
    .filter((feature) => CAPOLUOGHI_ITALIA.has(feature.properties.SIGLA))
    .map((feature) => {
      const punto = puntoInterno(feature.geometry)
      if (!punto) return ''
      const [x, y] = vistaItalia.punto(punto).split(' ')
      return `    <circle cx="${x}" cy="${y}" r="5"><title>${feature.properties.DEN_UTS}</title></circle>`
    })
    .join('\n')
  salva(
    'italia',
    documento(
      vistaItalia.vista,
      `  <g class="contorno" fill="#FBF6EE" stroke="#1F2A44" stroke-width="2" stroke-linejoin="round">
    <path d="${tracciato(italiaGeom, vistaItalia.punto)}"/>
  </g>
  <g class="dettaglio" fill="#FBF6EE" stroke="#1F2A44" stroke-width="1.4" stroke-linejoin="round">
${regioniItalia}
  </g>
  <g class="capoluoghi" fill="#C2522D">
${capoluoghiItalia}
  </g>`,
      'Italia',
    ),
  )

  for (const [codice, slug] of Object.entries(SLUG)) {
    const codiceNumero = Number(codice)
    const regione = regioni.find((feature) => feature.properties.COD_REG === codiceNumero)
    const pezzi = province.filter((feature) => feature.properties.COD_REG === codiceNumero)
    if (!regione || pezzi.length === 0) throw new Error(`Dati incompleti per ${slug}`)
    const vista = proiettore(estremi([regione, ...pezzi]))
    const confini = pezzi
      .map((feature) => `    <path d="${tracciato(feature.geometry, vista.punto)}"><title>${feature.properties.DEN_UTS}</title></path>`)
      .join('\n')
    const punti = pezzi
      .map((feature) => {
        const interno = puntoInterno(feature.geometry)
        if (!interno) return ''
        const [x, y] = vista.punto(interno).split(' ')
        return `    <circle cx="${x}" cy="${y}" r="6"><title>${feature.properties.DEN_UTS}</title></circle>`
      })
      .join('\n')
    salva(
      slug,
      documento(
        vista.vista,
        `  <g class="contorno" fill="#FBF6EE" stroke="#1F2A44" stroke-width="2.4" stroke-linejoin="round">
    <path d="${tracciato(regione.geometry, vista.punto)}"/>
  </g>
  <g class="dettaglio" fill="none" stroke="#1F2A44" stroke-width="1.3" stroke-linejoin="round">
${confini}
  </g>
  <g class="capoluoghi" fill="#C2522D">
${punti}
  </g>`,
        NOME[slug] ?? slug,
      ),
    )
  }
}

const soloDisegno = process.argv.includes('--solo-disegno')
if (!soloDisegno) {
  scarica()
  prepara()
}
genera()
console.log('SVG scritti in src/data/cartine e public/cartine')
