#!/usr/bin/env python3
"""Génère les boucles d'ambiance qui habillent les cadres vidéo en attendant
les films du studio.

Pas d'image de banque, pas de CDN tiers : les boucles sont fabriquées ici et
servies par le site lui-même. Chaque plan est une dérive lumineuse ambre sur
fond charbon — grain argentique, halo anamorphique, vignettage — dans les
couleurs de la direction artistique « Cinéma ».

    pip install numpy pillow
    python3 tools/generate-ambience.py

Sortie, dans `public/ambience/` : un `.webm` (VP8, muet, bouclé) et un `.jpg`
(première image, poster de repli) par entrée de PLANS.

Le mouvement est bâti sur des sinusoïdes dont la période est exactement la
durée du plan : la dernière image enchaîne sur la première sans à-coup.
"""

from __future__ import annotations

import subprocess
from dataclasses import dataclass, field
from io import BytesIO
from pathlib import Path

import numpy as np
from PIL import Image

FFMPEG = '/opt/pw-browsers/ffmpeg-1011/ffmpeg-linux'

WIDTH, HEIGHT = 1280, 536  # 2.39:1, le cadre du site
FPS = 15
SECONDS = 8

CHARCOAL = np.array([11, 11, 12], dtype=np.float64)


@dataclass
class Halo:
    """Foyer lumineux parcourant une trajectoire fermée (donc bouclable)."""

    x: float  # centre en largeur, 0 → 1
    y: float  # centre en hauteur, 0 → 1
    dx: float  # amplitude du va-et-vient horizontal
    dy: float  # amplitude du va-et-vient vertical
    size: float  # rayon, en fraction de la largeur
    gain: float  # intensité au centre
    turns: float = 1.0  # nombre de tours sur la durée du plan
    phase: float = 0.0


@dataclass
class Plan:
    slug: str
    tint: tuple[int, int, int]
    halos: list[Halo]
    # Bande horizontale très diffuse, à la manière d'un flare anamorphique.
    streak_gain: float = 0.08
    streak_turns: float = 1.0
    streak_y: float = 0.5  # hauteur de repos, 0 = haut du cadre
    streak_sway: float = 0.22  # amplitude du va-et-vient vertical
    grain: float = 7.0


AMBER = (242, 179, 61)
AMBER_PALE = (236, 205, 150)
AMBER_COLD = (158, 152, 142)

PLANS: list[Plan] = [
    Plan(
        slug='showreel',
        tint=AMBER,
        halos=[
            Halo(x=0.32, y=0.45, dx=0.10, dy=0.06, size=0.26, gain=0.30),
            Halo(x=0.74, y=0.62, dx=0.08, dy=0.05, size=0.18, gain=0.17, phase=1.9),
        ],
        streak_gain=0.09,
        streak_y=0.46,
    ),
    Plan(
        slug='mariage',
        tint=AMBER_PALE,
        halos=[
            Halo(x=0.40, y=0.30, dx=0.05, dy=0.08, size=0.28, gain=0.26, turns=0.5),
            Halo(x=0.68, y=0.70, dx=0.06, dy=0.04, size=0.16, gain=0.13, phase=2.7),
        ],
        streak_gain=0.07,
        streak_y=0.70,
        streak_sway=0.12,
        grain=6.0,
    ),
    Plan(
        slug='corporate',
        tint=AMBER_COLD,
        halos=[
            Halo(x=0.30, y=0.52, dx=0.16, dy=0.02, size=0.24, gain=0.34),
            Halo(x=0.78, y=0.40, dx=0.12, dy=0.03, size=0.16, gain=0.20, phase=3.1),
        ],
        streak_gain=0.08,
        streak_y=0.28,
        streak_sway=0.10,
        grain=5.0,
    ),
    Plan(
        slug='sport',
        tint=AMBER,
        halos=[
            Halo(x=0.26, y=0.58, dx=0.14, dy=0.10, size=0.19, gain=0.31, turns=2.0),
            Halo(x=0.70, y=0.36, dx=0.12, dy=0.08, size=0.14, gain=0.19, turns=2.0, phase=2.2),
        ],
        streak_gain=0.10,
        streak_turns=2.0,
        streak_y=0.62,
        streak_sway=0.16,
        grain=9.0,
    ),
    Plan(
        slug='clip',
        tint=AMBER,
        halos=[
            Halo(x=0.50, y=0.50, dx=0.18, dy=0.12, size=0.20, gain=0.33, turns=3.0),
            Halo(x=0.20, y=0.34, dx=0.10, dy=0.10, size=0.13, gain=0.18, turns=3.0, phase=1.2),
        ],
        streak_gain=0.10,
        streak_turns=3.0,
        streak_y=0.38,
        grain=8.0,
    ),
    Plan(
        slug='lifestyle',
        tint=AMBER_PALE,
        halos=[
            Halo(x=0.44, y=0.44, dx=0.09, dy=0.07, size=0.30, gain=0.24, turns=0.5),
        ],
        streak_gain=0.06,
        streak_y=0.56,
        streak_sway=0.28,
        grain=6.0,
    ),
]


def coordinates() -> tuple[np.ndarray, np.ndarray]:
    """Grille normalisée : x de 0 à 1, y ramené au même pas que x."""
    x = np.linspace(0.0, 1.0, WIDTH)[None, :]
    y = (np.linspace(0.0, 1.0, HEIGHT) * (HEIGHT / WIDTH))[:, None]
    return x, y


VIGNETTE = None


def vignette() -> np.ndarray:
    """Assombrissement des bords, calculé une fois."""
    global VIGNETTE
    if VIGNETTE is None:
        x, y = coordinates()
        cx, cy = 0.5, 0.5 * (HEIGHT / WIDTH)
        radius = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / 0.62
        VIGNETTE = np.clip(1.0 - 0.92 * radius**2, 0.04, 1.0)
    return VIGNETTE


def frame_intensity(plan: Plan, progress: float, x: np.ndarray, y: np.ndarray) -> np.ndarray:
    """Carte d'intensité lumineuse d'une image, entre 0 et ~1."""
    angle = 2.0 * np.pi * progress
    scale = HEIGHT / WIDTH
    intensity = np.zeros((HEIGHT, WIDTH), dtype=np.float64)

    for halo in plan.halos:
        turn = angle * halo.turns + halo.phase
        cx = halo.x + halo.dx * np.cos(turn)
        cy = (halo.y + halo.dy * np.sin(turn)) * scale
        squared = ((x - cx) ** 2 + (y - cy) ** 2) / (halo.size**2)
        # Respiration lente de l'intensité, en quadrature du déplacement.
        breath = 0.82 + 0.18 * np.sin(turn * 0.5 + 1.1)
        intensity += halo.gain * breath * np.exp(-squared)

    # Flare horizontal : très étalé en largeur, resserré en hauteur.
    streak_y = (plan.streak_y + plan.streak_sway * np.sin(angle * plan.streak_turns)) * scale
    streak = np.exp(-((y - streak_y) ** 2) / (0.018**2))
    intensity += plan.streak_gain * streak * (0.55 + 0.45 * np.cos(angle * plan.streak_turns))

    # Plafond : au-delà, le blanc pellicule du titre ne passerait plus.
    return np.clip(intensity * vignette(), 0.0, 0.42)


def render(plan: Plan, rng: np.random.Generator) -> list[Image.Image]:
    x, y = coordinates()
    tint = np.array(plan.tint, dtype=np.float64)
    frames: list[Image.Image] = []

    for index in range(FPS * SECONDS):
        intensity = frame_intensity(plan, index / (FPS * SECONDS), x, y)
        pixels = CHARCOAL[None, None, :] + intensity[:, :, None] * (tint - CHARCOAL)[None, None, :]
        # Grain argentique : bruit monochrome, ajouté après la couleur pour
        # rester perceptible dans les noirs sans délaver les hautes lumières.
        pixels += rng.normal(0.0, plan.grain, (HEIGHT, WIDTH, 1))
        frames.append(Image.fromarray(np.clip(pixels, 0, 255).astype(np.uint8), mode='RGB'))

    return frames


def encode(frames: list[Image.Image], target: Path) -> None:
    """Encode en VP8/WebM muet. L'ffmpeg disponible ne lit que du MJPEG en
    entrée : les images transitent donc en JPEG par un tube."""
    process = subprocess.Popen(
        [
            FFMPEG, '-y', '-hide_banner', '-loglevel', 'error',
            '-f', 'image2pipe', '-vcodec', 'mjpeg', '-r', str(FPS), '-i', 'pipe:0',
            '-an', '-c:v', 'libvpx', '-b:v', '360k', '-crf', '34',
            '-g', str(FPS * SECONDS), '-auto-alt-ref', '0',
            '-f', 'webm', str(target),
        ],
        stdin=subprocess.PIPE,
    )
    assert process.stdin is not None
    for frame in frames:
        buffer = BytesIO()
        frame.save(buffer, format='JPEG', quality=95)
        process.stdin.write(buffer.getvalue())
    process.stdin.close()
    if process.wait() != 0:
        raise SystemExit(f'ffmpeg a échoué sur {target}')


def main() -> None:
    target = Path(__file__).resolve().parent.parent / 'public' / 'ambience'
    target.mkdir(parents=True, exist_ok=True)

    for plan in PLANS:
        # Graine fixe : deux exécutions produisent le même fichier.
        frames = render(plan, np.random.default_rng(abs(hash(plan.slug)) % (2**32)))
        frames[0].save(target / f'{plan.slug}.jpg', format='JPEG', quality=82, optimize=True)
        encode(frames, target / f'{plan.slug}.webm')
        webm = (target / f'{plan.slug}.webm').stat().st_size
        poster = (target / f'{plan.slug}.jpg').stat().st_size
        print(f'{plan.slug:10s} webm {webm // 1024:4d} Ko · poster {poster // 1024:3d} Ko')


if __name__ == '__main__':
    main()
