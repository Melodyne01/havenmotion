import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { QuoteFormComponent } from './quote-form.component';

describe('QuoteFormComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [QuoteFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  function create(prefill = {}) {
    const fixture = TestBed.createComponent(QuoteFormComponent);
    fixture.componentRef.setInput('prefill', prefill);
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  function pick(element: HTMLElement, text: string): void {
    const label = [...element.querySelectorAll('label.choice')].find((l) => l.textContent?.trim().startsWith(text));
    if (!label) {
      throw new Error(`Choix introuvable : ${text}`);
    }
    const input = label.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
  }

  function button(element: HTMLElement, text: RegExp): HTMLButtonElement {
    return [...element.querySelectorAll('button')].find((b) => text.test(b.textContent ?? '')) as HTMLButtonElement;
  }

  it('n’utilise aucune liste déroulante, ni champ date ni e-mail', () => {
    const { element } = create();
    expect(element.querySelector('select')).toBeNull();
    expect(element.querySelector('input[type="date"], input[type="email"]')).toBeNull();
    expect(element.querySelectorAll('label.choice input[type="radio"]').length).toBeGreaterThan(7);
  });

  it('exige un type de projet avant l’étape 2', () => {
    const { fixture, element } = create();
    button(element, /continuer/i).click();
    fixture.detectChanges();
    expect(element.textContent).toContain('Choisissez un type de projet.');
    expect(element.textContent).toContain('Étape 1 sur 3');
  });

  it('affiche le prix de départ sur les formules une fois le projet choisi', () => {
    const { fixture, element } = create();
    pick(element, 'Corporate');
    fixture.detectChanges();
    expect(element.textContent).toContain('990 € HTVA');
  });

  it('parcourt les trois étapes et compose le message en direct', () => {
    const { fixture, element } = create();
    pick(element, 'Mariage');
    fixture.detectChanges();
    pick(element, 'Photo + vidéo');
    button(element, /continuer/i).click();
    fixture.detectChanges();

    pick(element, 'Luxembourg');
    fixture.detectChanges();
    // Un pays à une seule région la sélectionne d'office et affiche le forfait.
    expect(element.querySelector('#quote-travel-hint')?.textContent).toContain('190');
    button(element, /continuer/i).click();
    fixture.detectChanges();

    const name = element.querySelector('#quote-name') as HTMLInputElement;
    name.value = 'Camille Martin';
    name.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const preview = element.querySelector('#quote-preview')!.textContent!;
    expect(preview).toContain('Je m’appelle Camille Martin');
    expect(preview).toContain('Photo + vidéo (à partir de 2 690 € TTC)');
    expect(preview).toContain('Luxembourg (déplacement : 190');
    const mail = [...element.querySelectorAll('a')].find((a) => a.href.startsWith('mailto:'));
    expect(mail?.href).toContain('body=Bonjour');
    const whatsapp = [...element.querySelectorAll('a')].find((a) => a.href.startsWith('https://wa.me/'));
    expect(whatsapp?.href).toMatch(/^https:\/\/wa\.me\/32477753577\?text=Bonjour/);
    expect(whatsapp?.target).toBe('_blank');
  });

  it('bloque l’envoi tant que le nom manque', () => {
    const { fixture, element } = create({ category: 'sport' });
    button(element, /continuer/i).click();
    fixture.detectChanges();
    button(element, /continuer/i).click();
    fixture.detectChanges();
    const whatsapp = [...element.querySelectorAll('a')].find((a) => a.href.startsWith('https://wa.me/'))!;
    const click = new MouseEvent('click', { cancelable: true });
    whatsapp.dispatchEvent(click);
    fixture.detectChanges();
    expect(click.defaultPrevented).toBeTrue();
    expect(element.querySelector('#quote-name-error')).not.toBeNull();
  });

  it('applique le préremplissage reçu du lien cliqué, pays compris', () => {
    const { fixture, element } = create({ category: 'corporate', pack: 'video', region: 'lille-nord' });
    const checked = () => [...element.querySelectorAll('label.choice input:checked')].map((i) => (i as HTMLInputElement).value);
    expect(checked()).toEqual(['corporate', 'video']);
    button(element, /continuer/i).click();
    fixture.detectChanges();
    expect(checked()).toContain('FR');
    expect(checked()).toContain('lille-nord');
  });
});
