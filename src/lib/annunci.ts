import { CMP_ATTIVA } from './cmp';

export const CLIENTE_ADSENSE_SEGNA = '[ADSENSE_CLIENT_ID]';

export function annunciAccesi(input: {
  enabled?: string;
  client?: string;
  cmpAttiva?: boolean;
}): boolean {
  const cmp = input.cmpAttiva ?? CMP_ATTIVA;
  if (!cmp) return false;
  if (input.enabled !== 'true') return false;
  const client = input.client?.trim() ?? '';
  if (!client || client === CLIENTE_ADSENSE_SEGNA || client.includes('[')) return false;
  if (!client.startsWith('ca-pub-')) return false;
  return true;
}
