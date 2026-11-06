import { MediaAsset } from '../../models';
import { imageAlt, responsiveImage } from './responsive-image';

function asset(overrides: Partial<MediaAsset> = {}): MediaAsset {
  return {
    id: 'a',
    kind: 'Image',
    fileName: 'IMG_0001.JPG',
    posterUrl: '/media/renditions/a/share.jpg',
    width: 6000,
    height: 4000,
    durationSec: 0,
    sizeBytes: 12_000_000,
    processingStatus: 'Ready',
    renditions: [
      { type: 'image/webp', url: '/media/renditions/a/2400.webp', width: 2400, height: 1600, muted: false },
      { type: 'image/webp', url: '/media/renditions/a/800.webp', width: 800, height: 533, muted: false },
      { type: 'image/webp', url: '/media/renditions/a/1600.webp', width: 1600, height: 1067, muted: false },
    ],
    createdAt: '2026-11-06T00:00:00Z',
    ...overrides,
  };
}

describe('responsiveImage', () => {
  it('liste les déclinaisons WebP par largeur croissante', () => {
    const image = responsiveImage(asset());
    expect(image?.srcset).toBe(
      '/media/renditions/a/800.webp 800w, /media/renditions/a/1600.webp 1600w, /media/renditions/a/2400.webp 2400w',
    );
    expect(image?.src).toBe('/media/renditions/a/1600.webp');
    expect([image?.width, image?.height]).toEqual([1600, 1067]);
  });

  it('prend la déclinaison demandée pour le src par défaut', () => {
    expect(responsiveImage(asset(), 800)?.src).toBe('/media/renditions/a/800.webp');
  });

  it('retombe sur le fichier unique d’une image non optimisée', () => {
    const image = responsiveImage(asset({ renditions: [], posterUrl: '/media/originals/a.jpg' }));
    expect(image).toEqual({ src: '/media/originals/a.jpg', srcset: '', width: 6000, height: 4000 });
  });

  it('ignore les rendus vidéo et prend le poster', () => {
    const video = asset({
      kind: 'Video',
      posterUrl: '/media/renditions/v/poster.jpg',
      renditions: [{ type: 'video/mp4', url: '/media/renditions/v/web.mp4', width: 1920, height: 1080, muted: false }],
    });
    expect(responsiveImage(video)?.src).toBe('/media/renditions/v/poster.jpg');
    expect(responsiveImage(video)?.srcset).toBe('');
  });

  it('renvoie null sans média', () => {
    expect(responsiveImage(null)).toBeNull();
  });
});

describe('imageAlt', () => {
  it('prend le texte saisi dans la langue de la page', () => {
    const photo = asset({ alt: { fr: 'Première danse', nl: 'Eerste dans', en: '' } });
    expect(imageAlt(photo, 'nl', 'Titre')).toBe('Eerste dans');
  });

  it('retombe sur le texte fourni, jamais sur le nom du fichier', () => {
    expect(imageAlt(asset({ alt: { fr: '', nl: '', en: '  ' } }), 'en', 'Wedding at the castle')).toBe(
      'Wedding at the castle',
    );
    expect(imageAlt(asset(), 'fr', 'Mariage au château')).toBe('Mariage au château');
  });
});
