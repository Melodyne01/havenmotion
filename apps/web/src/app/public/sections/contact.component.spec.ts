import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let httpMock: HttpTestingController;
  let queryParams: Record<string, string> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: { queryParamMap: convertToParamMap(queryParams) } }),
        },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Les chargements du SiteStore peuvent rester en vol : on les ignore.
    httpMock.verify({ ignoreCancelled: true });
    queryParams = {};
  });

  function fill(fixture: ReturnType<typeof TestBed.createComponent<ContactComponent>>): void {
    const element: HTMLElement = fixture.nativeElement;
    (element.querySelector('#name') as HTMLInputElement).value = 'Camille Martin';
    element.querySelector('#name')!.dispatchEvent(new Event('input'));
    (element.querySelector('#email') as HTMLInputElement).value = 'camille@example.fr';
    element.querySelector('#email')!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('bloque un envoi sans e-mail valide', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const form = (fixture.nativeElement as HTMLElement).querySelector('form')!;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.componentInstance['form'].invalid).toBeTrue();
    httpMock.expectNone((request) => request.url.includes('/public/leads'));
  });

  it('envoie la demande avec la formule, la région et la langue, puis affiche la confirmation', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    fill(fixture);
    const element: HTMLElement = fixture.nativeElement;
    (element.querySelector('#pack') as HTMLSelectElement).value = 'combo';
    element.querySelector('#pack')!.dispatchEvent(new Event('change'));
    (element.querySelector('#region') as HTMLSelectElement).value = 'lille-nord';
    element.querySelector('#region')!.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const request = httpMock.expectOne((r) => r.url.includes('/public/leads'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body.name).toBe('Camille Martin');
    expect(request.request.body.pack).toBe('combo');
    expect(request.request.body.region).toBe('lille-nord');
    expect(request.request.body.locale).toBe('fr');
    expect(request.request.body.website).toBe('');
    request.flush({ id: 'x' });
    fixture.detectChanges();

    expect(element.textContent).toContain('Demande envoyée');
  });

  it('affiche le forfait de déplacement dès qu’une région est choisie', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('#travel-hint')).toBeNull();

    (element.querySelector('#region') as HTMLSelectElement).value = 'luxembourg';
    element.querySelector('#region')!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(element.querySelector('#travel-hint')?.textContent).toContain('190');

    (element.querySelector('#region') as HTMLSelectElement).value = 'bruxelles';
    element.querySelector('#region')!.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(element.querySelector('#travel-hint')?.textContent).toContain('inclus');
  });

  it('préremplit la catégorie et la formule depuis la grille tarifaire', () => {
    queryParams = { categorie: 'corporate', formule: 'video' };
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();

    const form = fixture.componentInstance['form'].getRawValue();
    expect(form.projectType).toBe('Corporate');
    expect(form.pack).toBe('video');
  });
});
