import type { APIRoute } from 'astro';
import { SITE_URL } from '../config/site';
import { corpoRobots } from '../lib/robots';

export const GET: APIRoute = () =>
  new Response(corpoRobots(SITE_URL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
