import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { VideoFrameComponent, teaserStart } from './video-frame.component';
import { MediaAsset } from '../../models';

function film(id: string, withTeaser: boolean): MediaAsset {
  return {
    id,
    kind: 'video',
    posterUrl: `/${id}/poster.jpg`,
    renditions: [
      { type: 'video/mp4', url: `/${id}/web.mp4`, width: 1920, height: 1080, muted: false },
      { type: 'video/webm', url: `/${id}/web.webm`, width: 1920, height: 1080, muted: false },
      { type: 'video/mp4', url: `/${id}/band-muted.mp4`, width: 1280, height: 720, muted: true },
      ...(withTeaser ? [{ type: 'video/mp4', url: `/${id}/teaser.mp4`, width: 1280, height: 720, muted: true, teaser: true }] : []),
    ],
  } as unknown as MediaAsset;
}

@Component({
  imports: [VideoFrameComponent],
  template: `<app-video-frame [asset]="asset()" playback="teaser" [muted]="false" [loop]="false" [controls]="true" label="Mariage à Gand" />`,
})
class HostComponent {
  readonly asset = signal<MediaAsset | null>(film('a', true));
}

async function render() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  const root = fixture.nativeElement as HTMLElement;
  // L'IntersectionObserver répond de façon asynchrone.
  for (let i = 0; i < 50 && !root.querySelector('video'); i++) {
    await new Promise((resolve) => setTimeout(resolve, 20));
    fixture.detectChanges();
  }
  return { fixture, root, video: () => root.querySelector('video') as HTMLVideoElement };
}

const sourceUrls = (video: HTMLVideoElement) => [...video.querySelectorAll('source')].map((s) => s.getAttribute('src'));

describe('VideoFrameComponent en mode teaser', () => {
  it('lit l’extrait muet en boucle, sans contrôles, avec un bouton « Voir le film »', async () => {
    const { root, video } = await render();
    expect(sourceUrls(video())).toEqual(['/a/teaser.mp4']);
    expect(video().muted).toBeTrue();
    expect(video().loop).toBeTrue();
    expect(video().hasAttribute('controls')).toBeFalse();
    expect(root.querySelector('.frame__play')?.textContent).toContain('Voir le film');
  });

  it('passe au film complet avec le son au clic', async () => {
    const { fixture, root, video } = await render();
    (root.querySelector('.frame__play') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('.frame__play')).toBeNull();
    expect(sourceUrls(video())).toEqual(['/a/web.webm', '/a/web.mp4']);
    expect(video().muted).toBeFalse();
    expect(video().loop).toBeFalse();
    expect(video().hasAttribute('controls')).toBeTrue();
  });

  it('un autre film repart sur son extrait ; sans extrait, la version muette sert de boucle', async () => {
    const { fixture, root, video } = await render();
    (root.querySelector('.frame__play') as HTMLButtonElement).click();
    fixture.componentInstance.asset.set(film('b', false));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(root.querySelector('.frame__play')).not.toBeNull();
    expect(sourceUrls(video())).toEqual(['/b/band-muted.mp4']);
    expect(video().muted).toBeTrue();
  });

  it('cale l’extrait à 10 % des films de plus d’une minute', () => {
    expect(teaserStart(45)).toBe(0);
    expect(teaserStart(300)).toBe(30);
    expect(teaserStart(65)).toBeCloseTo(6.5);
    expect(teaserStart(NaN)).toBe(0);
  });
});
