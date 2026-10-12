import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [App], providers: [provideZonelessChangeDetection()] }));

  it('affiche un seul h1, le bouton Acheter et le bouton WhatsApp', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('h1').length).toBe(1);
    const buy = el.querySelector<HTMLAnchorElement>('.btn--primary')!;
    expect(buy.href).toContain('https://store.tilstack.me/prd_t6xzuw62');
    expect(buy.href).toContain('utm_source=cont.tilstack.me');
    expect(el.querySelector<HTMLAnchorElement>('.btn--whatsapp')!.href).toContain('https://wa.me/237678548542?text=');
  });

  it('montre Nuvel comme « en développement » et sans lien', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const items = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.apps__list li'));
    const nuvel = items.find((li) => li.textContent?.includes('Nuvel'))!;
    expect(nuvel.querySelector('a')).toBeNull();
    expect(nuvel.textContent).toContain('En développement');
  });

  it('affiche le bouton « Me soutenir » vers le don, sur la carte Séla Cantiques', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const card = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.apps__list li')).find((li) => li.textContent?.includes('Séla'))!;
    const link = card.querySelector<HTMLAnchorElement>('a.support')!;
    expect(link.href).toContain('https://store.tilstack.me/prd_qpqx6nho');
    expect(link.textContent).toContain('Me soutenir');
  });
});
