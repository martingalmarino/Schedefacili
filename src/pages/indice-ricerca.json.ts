import type { APIRoute } from 'astro';
import { INDICE } from '../lib/indice-ricerca';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(INDICE), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
