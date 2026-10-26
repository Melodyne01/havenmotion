import { buildQuoteMessage, mailtoUrl, prefillFromParams, whatsappUrl } from './quote';

describe('quote', () => {
  const request = {
    name: 'Camille Martin',
    category: 'mariage' as const,
    pack: 'combo' as const,
    region: 'lille-nord',
    budget: '2 000 – 5 000 €',
    message: 'Cérémonie fin d’après-midi.',
  };

  it('compose un message en français avec le prix de départ et le forfait de déplacement', () => {
    const text = buildQuoteMessage('fr', 'Heaven Motion', request);
    expect(text).toContain('Bonjour Heaven Motion,');
    expect(text).toContain('Je m’appelle Camille Martin');
    expect(text).toContain('• Projet : Mariage');
    expect(text).toContain('Photo + vidéo (à partir de 2 790 € TTC)');
    expect(text).toContain('Lille – Nord (déplacement : 90 €)');
    expect(text).toContain('Cérémonie fin d’après-midi.');
    expect(text).not.toMatch(/date/i);
  });

  it('compose le message dans la langue du visiteur, sans espace avant les deux-points', () => {
    const text = buildQuoteMessage('en', 'Heaven Motion', { ...request, category: 'sport', pack: 'video', region: null });
    expect(text).toContain('Hello Heaven Motion,');
    expect(text).toContain('• Package: Video + editing (from 590 € excl. VAT)');
    expect(text).toContain('• Location: to be confirmed');
    expect(text).not.toContain(' :');
  });

  it('n’affiche aucun prix pour une catégorie sur devis', () => {
    const text = buildQuoteMessage('fr', 'Heaven Motion', { ...request, category: 'corporate', pack: 'custom', region: null });
    expect(text).toContain('• Formule : Sur mesure\n');
    expect(text).not.toContain('à partir de');
  });

  it('accepte « Autre » sans formule ni lieu', () => {
    const text = buildQuoteMessage('nl', 'Heaven Motion', { ...request, category: null, pack: null, region: null, message: '' });
    expect(text).toContain('• Project: ander');
    expect(text).not.toContain('Formule');
    expect(text).not.toContain('Details');
  });

  it('construit des liens WhatsApp et e-mail encodés', () => {
    expect(whatsappUrl('+32 470 12 34 56', 'Bonjour & merci')).toBe('https://wa.me/32470123456?text=Bonjour%20%26%20merci');
    expect(mailtoUrl('contact@heavenmotion.be', 'Devis', 'Ligne 1\nLigne 2')).toBe(
      'mailto:contact@heavenmotion.be?subject=Devis&body=Ligne%201%0ALigne%202',
    );
  });

  it('lit le préremplissage dans les paramètres et ignore les valeurs inconnues', () => {
    expect(prefillFromParams(new URLSearchParams('categorie=sport&formule=photo&region=bruxelles'))).toEqual({
      category: 'sport',
      pack: 'photo',
      region: 'bruxelles',
    });
    expect(prefillFromParams(new URLSearchParams('categorie=x&formule=y&region=z'))).toEqual({ category: null, pack: null, region: null });
  });
});
