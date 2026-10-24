import type { Template } from '../types';
import { CLASSE_PRIMA } from './classe-1';
import { CLASSE_SECONDA } from './classe-2';
import { CLASSE_TERZA } from './classe-3';
import { CLASSE_QUARTA } from './classe-4';
import { CLASSE_QUINTA } from './classe-5';

export const TEMPLATES: readonly Template[] = [
  ...CLASSE_PRIMA,
  ...CLASSE_SECONDA,
  ...CLASSE_TERZA,
  ...CLASSE_QUARTA,
  ...CLASSE_QUINTA,
];
