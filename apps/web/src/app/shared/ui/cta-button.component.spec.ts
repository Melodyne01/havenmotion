import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CtaButtonComponent } from './cta-button.component';

@Component({
  imports: [CtaButtonComponent],
  template: '<app-cta-button [href]="href">Demander un devis</app-cta-button>',
})
class HostComponent {
  href: string | null = null;
}

describe('CtaButtonComponent', () => {
  it('rend un bouton sans href', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('button.cta')?.textContent).toContain('Demander un devis');
    expect(element.querySelector('a.cta')).toBeNull();
  });

  it('rend un lien quand href est fourni', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.href = '#contact';
    fixture.detectChanges();
    const link = (fixture.nativeElement as HTMLElement).querySelector('a.cta');
    expect(link?.getAttribute('href')).toBe('#contact');
    expect(link?.textContent).toContain('Demander un devis');
  });
});
