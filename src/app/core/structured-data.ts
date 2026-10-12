import { PERSON, PORTFOLIO_URL, PRODUCT, SITE_URL, SOCIALS } from '../data/site.data';

/** Données structurées (schema.org). Le prix vient de la même constante que le prix affiché. */
export function buildStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#israel`,
        name: PERSON.name,
        alternateName: PERSON.alias,
        url: PORTFOLIO_URL,
        image: `${SITE_URL}/assets/img/avatar-dessin.webp`,
        jobTitle: PERSON.jobTitle,
        email: `mailto:${PERSON.email}`,
        address: { '@type': 'PostalAddress', addressLocality: 'Douala', addressCountry: 'CM' },
        sameAs: SOCIALS.filter((s) => s.id !== 'mail').map((s) => s.url),
      },
      {
        '@type': 'Product',
        '@id': PRODUCT.url,
        name: PRODUCT.name,
        description: PRODUCT.description,
        image: `${SITE_URL}/assets/img/og-cont.jpg`,
        brand: { '@type': 'Brand', name: PERSON.alias },
        offers: {
          '@type': 'Offer',
          url: PRODUCT.url,
          price: String(PRODUCT.priceXaf),
          priceCurrency: 'XAF',
          availability: 'https://schema.org/InStock',
          seller: { '@id': `${SITE_URL}/#israel` },
        },
      },
    ],
  };
}
