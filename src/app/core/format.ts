import { XAF_PER_EUR } from '../data/site.data';
import type { Lang } from './messages';

const LOCALE: Record<Lang, string> = { fr: 'fr-FR', en: 'en-GB' };

/** Équivalent en euros arrondi au centime (7 500 XAF → 11,43 €). */
export const xafToEur = (xaf: number): number => Math.round((xaf / XAF_PER_EUR) * 100) / 100;

export const formatXaf = (xaf: number, lang: Lang): string =>
  `${new Intl.NumberFormat(LOCALE[lang]).format(xaf).replace(/ /g, ' ')} XAF`;

export const formatEur = (eur: number, lang: Lang): string =>
  new Intl.NumberFormat(LOCALE[lang], { style: 'currency', currency: 'EUR' }).format(eur);
