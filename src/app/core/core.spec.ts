import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { APPS, DONATION_URL, PRODUCT, SOCIALS, UTM, whatsappUrl, withUtm } from '../data/site.data';
import { formatEur, formatXaf, xafToEur } from './format';
import { I18nService } from './i18n.service';
import { EN, FR } from './messages';
import { BACKGROUNDS, ROTATION_MS, backgroundAt, nextChangeAt } from './background.service';
import { buildStructuredData } from './structured-data';

describe('prix', () => {
  it("convertit 7 500 XAF en 11,43 € (parité fixe 655,957)", () => {
    expect(xafToEur(7500)).toBe(11.43);
  });

  it('formate le prix en français et en anglais', () => {
    expect(formatEur(11.43, 'fr')).toContain('11,43');
    expect(formatEur(11.43, 'en')).toBe('€11.43');
    expect(formatXaf(7500, 'fr')).toBe('7 500 XAF');
    expect(formatXaf(7500, 'en')).toBe('7,500 XAF');
  });

  it('le prix des données structurées est celui qui est affiché', () => {
    const graph = (buildStructuredData() as { '@graph': { '@type': string; offers?: { price: string; priceCurrency: string } }[] })['@graph'];
    const offer = graph.find((n) => n['@type'] === 'Product')!.offers!;
    expect(offer.price).toBe(String(PRODUCT.priceXaf));
    expect(offer.priceCurrency).toBe('XAF');
  });
});

describe('liens', () => {
  it('encode le message WhatsApp et utilise le bon numéro', () => {
    expect(whatsappUrl(FR.waMessage)).toBe(
      'https://wa.me/237678548542?text=Bonjour%20Israel%2C%20je%20vous%20contacte%20depuis%20votre%20page%20de%20liens.',
    );
  });

  it("ajoute l'UTM aux liens Chariow", () => {
    expect(withUtm(PRODUCT.url)).toBe(`https://store.tilstack.me/prd_t6xzuw62?${UTM}`);
  });
});

describe('textes', () => {
  it("l'anglais a exactement les mêmes clés que le français", () => {
    expect(Object.keys(EN).sort()).toEqual(Object.keys(FR).sort());
  });

  it('chaque texte est renseigné', () => {
    for (const dict of [FR, EN]) for (const v of Object.values(dict)) expect(v.trim().length).toBeGreaterThan(0);
  });
});

describe('I18nService', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] }));

  it('bascule de langue et met à jour la langue du document', () => {
    const i18n = TestBed.inject(I18nService);
    expect(i18n.lang()).toBe('fr');
    i18n.toggle();
    expect(i18n.lang()).toBe('en');
    expect(i18n.m().buy).toBe(EN.buy);
    TestBed.tick();
    expect(document.documentElement.lang).toBe('en');
    localStorage.removeItem('tl-lang');
  });
});

describe('fond tournant (toutes les 2 h 30)', () => {
  const MIN = 60 * 1000;
  const T = 150 * MIN; // 2 h 30

  it("change toutes les 2 h 30, dans l'ordre : échecs, damiers, pions, Bible", () => {
    expect(ROTATION_MS).toBe(2.5 * 3600 * 1000);
    expect(BACKGROUNDS).toEqual(['echecs', 'damiers', 'pions', 'bible']);
    expect(backgroundAt(0)).toBe('echecs');
    expect(backgroundAt(T)).toBe('damiers');
    expect(backgroundAt(2 * T)).toBe('pions');
    expect(backgroundAt(3 * T)).toBe('bible');
    expect(backgroundAt(4 * T)).toBe('echecs');
  });

  it("reste identique pendant 2 h 30, puis annonce le prochain changement à l'heure pile", () => {
    expect(backgroundAt(T - 1)).toBe('echecs');
    expect(backgroundAt(T)).toBe('damiers');
    expect(nextChangeAt(T + 40 * MIN)).toBe(2 * T);
    expect(nextChangeAt(2 * T)).toBe(3 * T);
  });

  it('un tour complet des quatre fonds dure 10 heures', () => {
    expect(BACKGROUNDS.length * ROTATION_MS).toBe(10 * 3600 * 1000);
  });
});

describe('réseaux et applications', () => {
  const url = (id: string) => SOCIALS.find((s) => s.id === id)?.url;

  it('utilise les adresses données par Israel', () => {
    expect(url('linkedin')).toBe('https://www.linkedin.com/in/tientcheuisrael/');
    expect(url('x')).toBe('https://x.com/israelTientcheu');
    expect(url('facebook')).toBe('https://www.facebook.com/profile.php?id=61580044283073');
    expect(url('youtube')).toBe('https://www.youtube.com/@tilstack');
  });

  it("n'affiche aucune adresse de Full Gospel Mission Kotto", () => {
    expect(SOCIALS.some((s) => /fgmkotto|fullgospel/i.test(s.url))).toBeFalse();
  });

  it('la prochaine application s\'appelle Séla Cantiques, sans lien ni faux détail', () => {
    const next = APPS.find((a) => a.id === 'next')!;
    expect(next.name).toBe('Séla Cantiques');
    expect(next.url).toBeUndefined();
  });
});

describe('bouton « Me soutenir »', () => {
  it('pointe vers le projet de don Chariow, sur la carte Séla Cantiques', () => {
    expect(DONATION_URL).toBe('https://store.tilstack.me/prd_qpqx6nho');
    expect(APPS.find((a) => a.id === 'next')?.supportUrl).toBe(DONATION_URL);
    expect(withUtm(DONATION_URL)).toBe(`https://store.tilstack.me/prd_qpqx6nho?${UTM}`);
  });
});
