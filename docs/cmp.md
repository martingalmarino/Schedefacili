# CMP y AdSense

La publicidad está apagada. `Anuncio.astro` no carga `adsbygoogle.js` hasta que se cumplan las tres condiciones del código: `CMP_ATTIVA` en true, `PUBLIC_ADSENSE_ENABLED=true` y `PUBLIC_ADSENSE_CLIENT` con un id real `ca-pub-…` (no el literal `[ADSENSE_CLIENT_ID]`).

El consentimiento por defecto está en `src/components/Consenso.astro`, en el `<head>`, antes de cualquier script de Google:

- `ad_storage`, `ad_user_data`, `ad_personalization` y `analytics_storage` en `denied`
- `wait_for_update`: 500

## Checklist

1. Elegir una CMP certificada por Google con TCF 2.2. La opción simple es AdSense › Privacy e messaggi. Alternativas: Iubenda, Cookiebot.
2. Pegar el script de esa CMP en `src/components/Consenso.astro`, en el comentario `[CMP]`, después del default de Consent Mode.
3. Configurar el mensaje GDPR para Italia y el EEE.
4. Verificar Consent Mode v2 con Tag Assistant: los cuatro signals nacen en `denied` y se actualizan solo después de la elección.
5. Poner `CMP_ATTIVA` en `true` dentro de `src/lib/cmp.ts`.
6. Definir `PUBLIC_ADSENSE_ENABLED=true` y `PUBLIC_ADSENSE_CLIENT` con el id `ca-pub-…`.
7. Sustituir el comentario de `public/ads.txt` por la línea real de AdSense.
8. Recién ahí el recuadro de `Anuncio.astro` reserva altura y carga el script.

El botón «Gestisci cookie» llama a `googlefc.showRevocationMessage` cuando la CMP de AdSense está presente. Hasta ese momento el sitio avisa que el panel no está activo.

No hay Google Fonts, Analytics ni otros embeds de terceros antes del consentimiento. Los caracteres se sirven desde el sitio.
