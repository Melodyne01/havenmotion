import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';
import { QuoteFormComponent } from './quote-form.component';

describe('QuoteFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuoteFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  function setValue(element: HTMLElement, selector: string, value: string, event = 'input'): void {
    const field = element.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
    field.value = value;
    field.dispatchEvent(new Event(event));
  }

  it('n’a plus de champ date ni e-mail', () => {
    const fixture = TestBed.createComponent(QuoteFormComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('input[type="date"]')).toBeNull();
    expect(element.querySelector('input[type="email"]')).toBeNull();
  });

  it('exige un nom avant de préparer le message', () => {
    const fixture = TestBed.createComponent(QuoteFormComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(element.querySelector('#quote-name-error')).not.toBeNull();
    expect(element.querySelector('#quote-preview')).toBeNull();
  });

  it('prépare le message et propose l’envoi par e-mail', () => {
    const fixture = TestBed.createComponent(QuoteFormComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    setValue(element, '#quote-name', 'Camille Martin');
    setValue(element, '#quote-region', 'luxembourg', 'change');
    fixture.detectChanges();
    expect(element.querySelector('#quote-travel-hint')?.textContent).toContain('190');

    element.querySelector('form')!.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const preview = element.querySelector('#quote-preview') as HTMLTextAreaElement;
    expect(preview.value).toContain('Camille Martin');
    expect(preview.value).toContain('Luxembourg (déplacement : 190');
    const mail = [...element.querySelectorAll('a')].find((a) => a.href.startsWith('mailto:'));
    expect(mail?.href).toContain('body=Bonjour');
  });

  it('applique le préremplissage reçu du lien cliqué', () => {
    const fixture = TestBed.createComponent(QuoteFormComponent);
    (fixture.componentRef as ComponentRef<QuoteFormComponent>).setInput('prefill', { category: 'corporate', pack: 'video', region: 'bruxelles' });
    fixture.detectChanges();
    const form = fixture.componentInstance['form'].getRawValue();
    expect(form.category).toBe('corporate');
    expect(form.pack).toBe('video');
    expect(form.region).toBe('bruxelles');
  });
});
