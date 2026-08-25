import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Les chargements du SiteStore peuvent rester en vol : on les ignore.
    httpMock.verify({ ignoreCancelled: true });
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

  it('envoie la demande et affiche la confirmation', () => {
    const fixture = TestBed.createComponent(ContactComponent);
    fixture.detectChanges();
    fill(fixture);

    (fixture.nativeElement as HTMLElement).querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const request = httpMock.expectOne((r) => r.url.includes('/public/leads'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body.name).toBe('Camille Martin');
    expect(request.request.body.website).toBe('');
    request.flush({ id: 'x' });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Demande envoyée');
  });
});
