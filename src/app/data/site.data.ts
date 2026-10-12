import type { MessageKey } from '../core/messages';

/** Liens et constantes du site — source unique (page, données structurées, tests). */
export const SITE_URL = 'https://cont.tilstack.me';
export const PORTFOLIO_URL = 'https://tilstack.me';
export const CV_URL = 'https://tilstack.me/TilStack_CV.pdf';
export const STORE_URL = 'https://store.tilstack.me';
export const UTM = 'utm_source=cont.tilstack.me&utm_medium=links';

/** Projet de don de l'application Séla Cantiques, sur la boutique Chariow (produit « Don libre »). */
export const DONATION_URL = `${STORE_URL}/prd_qpqx6nho`;

export const PERSON = {
  name: 'TIENTCHEU Israel',
  alias: 'TilStack',
  email: 'israel01tientcheu@gmail.com',
  phoneE164: '+237678548542',
  phoneDisplay: '+237 678 54 85 42',
  jobTitle: 'Ingénieur logiciel & formateur en informatique',
} as const;

/** Parité fixe officielle du franc CFA : 1 € = 655,957 XAF. */
export const XAF_PER_EUR = 655.957;

export const PRODUCT = {
  name: 'Remotion Video Studio — le skill Claude qui fabrique tes vidéos animées',
  shortName: 'Remotion Video Studio',
  description:
    "Un skill Claude qui crée des vidéos animées à partir d'une simple description (personnages, voix off, sous-titres), exportées en MP4, sans logiciel de montage ni code.",
  url: `${STORE_URL}/prd_t6xzuw62`,
  priceXaf: 7500,
  oldPriceXaf: 12000,
} as const;

export interface SocialLink {
  id: 'github' | 'linkedin' | 'x' | 'tiktok' | 'facebook' | 'youtube' | 'mail';
  label: string;
  url: string;
}

export const SOCIALS: readonly SocialLink[] = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/TilStack' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/tientcheuisrael/' },
  { id: 'x', label: 'X (Twitter)', url: 'https://x.com/israelTientcheu' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@tilstack_draw' },
  { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61580044283073' },
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@tilstack' },
  { id: 'mail', label: 'E-mail', url: `mailto:${PERSON.email}` },
];

export interface AppItem {
  id: string;
  /** Nom propre (non traduit). */
  name: string;
  logo?: string;
  url?: string;
  altKey?: MessageKey;
  descKey?: MessageKey;
  badgeKey: MessageKey;
  /** Badge discret (projet sans date). */
  soft?: boolean;
  /** Si renseigné, la carte affiche un bouton « Me soutenir » vers ce lien. */
  supportUrl?: string;
}

export const APPS: readonly AppItem[] = [
  {
    id: 'otadex',
    name: 'Otadex',
    logo: 'assets/img/otadex-logo.webp',
    url: 'https://otadex.tilstack.me',
    altKey: 'otadexAlt',
    descKey: 'otadexDesc',
    badgeKey: 'otadexBadge',
  },
  {
    id: 'nuvel',
    name: 'Nuvel',
    logo: 'assets/img/nuvel-logo.webp',
    altKey: 'nuvelAlt',
    descKey: 'nuvelDesc',
    badgeKey: 'nuvelBadge',
  },
  { id: 'next', name: 'Séla Cantiques', descKey: 'nextDesc', badgeKey: 'nextBadge', soft: true, supportUrl: DONATION_URL },
];

export const withUtm = (url: string): string => `${url}${url.includes('?') ? '&' : '?'}${UTM}`;

export const whatsappUrl = (text: string): string =>
  `https://wa.me/${PERSON.phoneE164.slice(1)}?text=${encodeURIComponent(text)}`;
