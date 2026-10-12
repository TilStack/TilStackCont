/** Textes de la page. Le français est la référence : l'anglais doit avoir exactement les mêmes clés. */
export const FR = {
  title: 'TilStack — Remotion Video Studio, applications et contact',
  description:
    "Remotion Video Studio : le skill Claude qui fabrique tes vidéos animées (7 500 XAF). Applications Otadex et Nuvel, WhatsApp, portfolio et contact d'Israel Tientcheu (TilStack), Douala.",
  clockPlace: 'à Douala',
  langGroup: 'Langue',
  langFr: 'FR — Français',
  langEn: 'EN — English',
  themeToDark: 'Activer le thème sombre',
  themeToLight: 'Activer le thème clair',
  avatarAlt: "Portrait dessiné d'Israel Tientcheu : un jeune homme aux cheveux frisés et à lunettes, en t-shirt sombre",
  mascotAlt: "Avatar 3D d'Israel Tientcheu, veste marine TilStack, un ordinateur sous le bras",
  tagline: 'Ingénieur logiciel & formateur en informatique',
  motto: 'Être exceptionnel',
  productKicker: 'Produit n°1',
  productSub: 'Le skill Claude qui fabrique tes vidéos animées.',
  productDesc:
    "Décris ta vidéo en quelques mots : Claude crée l'animation avec personnages, voix off et sous-titres, exportée en MP4. Sans logiciel de montage, sans code.",
  priceNote: 'Équivalent indicatif · parité fixe 1 € = 655,957 XAF',
  priceLabel: 'Prix',
  oldPriceAria: 'Ancien prix',
  buy: 'Acheter',
  whatsapp: 'Me contacter sur WhatsApp',
  waMessage: 'Bonjour Israel, je vous contacte depuis votre page de liens.',
  appsTitle: 'Mes applications',
  support: 'Me soutenir',
  supportAria: 'Me soutenir : faire un don libre pour Séla Cantiques',
  linksAria: 'Liens',
  portfolio: 'Portfolio',
  cv: 'CV',
  store: 'Boutique complète',
  storeShort: 'Boutique',
  vcard: 'Enregistrer mon contact',
  vcardShort: 'Contact',
  socialsAria: 'Réseaux',
  footer: 'Douala, Cameroun',
} as const;

export type MessageKey = keyof typeof FR;
export type Messages = Record<MessageKey, string>;
export type Lang = 'fr' | 'en';

export const EN: Messages = {
  title: 'TilStack — Remotion Video Studio, apps and contact',
  description:
    'Remotion Video Studio: the Claude skill that makes your animated videos (7,500 XAF). Otadex and Nuvel apps, WhatsApp, portfolio and contact of Israel Tientcheu (TilStack), Douala.',
  clockPlace: 'in Douala',
  langGroup: 'Language',
  langFr: 'FR — Français',
  langEn: 'EN — English',
  themeToDark: 'Switch to dark theme',
  themeToLight: 'Switch to light theme',
  avatarAlt: 'Drawn portrait of Israel Tientcheu: a young man with curly hair and glasses, in a dark t-shirt',
  mascotAlt: '3D avatar of Israel Tientcheu in a navy TilStack jacket, a laptop under his arm',
  tagline: 'Software engineer & IT trainer',
  motto: 'Be exceptional',
  productKicker: 'Product #1',
  productSub: 'The Claude skill that makes your animated videos.',
  productDesc:
    'Describe your video in a few words: Claude builds the animation with characters, voice-over and subtitles, exported as MP4. No editing software, no code.',
  priceNote: 'Indicative equivalent · fixed rate €1 = 655.957 XAF',
  priceLabel: 'Price',
  oldPriceAria: 'Former price',
  buy: 'Buy now',
  whatsapp: 'Contact me on WhatsApp',
  waMessage: 'Hello Israel, I am contacting you from your links page.',
  appsTitle: 'My apps',
  support: 'Support me',
  supportAria: 'Support me: make a free donation for Séla Cantiques',
  linksAria: 'Links',
  portfolio: 'Portfolio',
  cv: 'Résumé',
  store: 'Full store',
  storeShort: 'Store',
  vcard: 'Save my contact',
  vcardShort: 'Contact',
  socialsAria: 'Social networks',
  footer: 'Douala, Cameroon',
};

export const MESSAGES: Record<Lang, Messages> = { fr: FR, en: EN };
