import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AnalyticsService } from './analytics';

describe('AnalyticsService', () => {
  let calls: [string, Record<string, unknown>][];

  beforeEach(() => {
    calls = [];
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => {
    delete (window as unknown as { umami?: unknown }).umami;
  });

  it('ne fait rien si Umami n’est pas chargé (bloqueur, dev)', () => {
    expect(() => TestBed.inject(AnalyticsService).track('quote_open', { source: 'hero' })).not.toThrow();
  });

  it('envoie l’événement à Umami en retirant les valeurs vides', () => {
    (window as unknown as { umami: unknown }).umami = { track: (name: string, data: Record<string, unknown>) => calls.push([name, data]) };
    TestBed.inject(AnalyticsService).track('quote_submit_whatsapp', { category: 'mariage', pack: undefined, region: '', budget: null, step: 3 });
    expect(calls).toEqual([['quote_submit_whatsapp', { category: 'mariage', step: 3 }]]);
  });

  it('n’interrompt jamais le site si Umami lève une erreur', () => {
    (window as unknown as { umami: unknown }).umami = {
      track: () => {
        throw new Error('réseau');
      },
    };
    expect(() => TestBed.inject(AnalyticsService).track('quote_copy')).not.toThrow();
  });
});
