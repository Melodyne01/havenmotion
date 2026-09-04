#!/usr/bin/env python3
"""Génère les icônes PNG de l'application à partir de la marque « HM ».

Les icônes doivent rester identiques au favicon (`public/favicon.svg`) : carré
ambre, lettres charbon. Le script n'utilise que la bibliothèque standard, il
est donc rejouable partout :

    python3 tools/generate-icons.py

Sortie : `public/icons/icon-{32,180,192,512}.png`.
"""

from __future__ import annotations

import struct
import zlib
from pathlib import Path

AMBER = (0xF2, 0xB3, 0x3D)
CHARCOAL = (0x0B, 0x0B, 0x0C)
SIZES = (32, 180, 192, 512)
SUPERSAMPLE = 3

Polygon = list[tuple[float, float]]


def rect(x: float, y: float, w: float, h: float) -> Polygon:
    return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]


def glyph_polygons() -> list[Polygon]:
    """« HM » en coordonnées normalisées (carré unitaire)."""
    stroke = 0.085
    top, height = 0.27, 0.46
    bottom = top + height
    gap = 0.05
    width_h, width_m = 0.30, 0.34
    left = (1 - (width_h + gap + width_m)) / 2

    # H : deux montants et une barre médiane.
    h_left = left
    polygons = [
        rect(h_left, top, stroke, height),
        rect(h_left + width_h - stroke, top, stroke, height),
        rect(h_left + stroke, top + (height - stroke) / 2, width_h - 2 * stroke, stroke),
    ]

    # M : deux montants et le V central.
    m_left = left + width_h + gap
    apex_x = m_left + width_m / 2
    apex_y = top + 0.58 * height
    polygons += [
        rect(m_left, top, stroke, height),
        rect(m_left + width_m - stroke, top, stroke, height),
        [(m_left, top), (m_left + stroke, top), (apex_x + stroke / 2, apex_y), (apex_x - stroke / 2, apex_y)],
        [
            (m_left + width_m - stroke, top),
            (m_left + width_m, top),
            (apex_x + stroke / 2, apex_y),
            (apex_x - stroke / 2, apex_y),
        ],
    ]
    return polygons


def inside(polygon: Polygon, px: float, py: float) -> bool:
    """Test pair/impair (ray casting) sur un polygone convexe ou non."""
    result = False
    count = len(polygon)
    for i in range(count):
        x1, y1 = polygon[i]
        x2, y2 = polygon[(i + 1) % count]
        if (y1 > py) != (y2 > py):
            x_at = x1 + (py - y1) * (x2 - x1) / (y2 - y1)
            if px < x_at:
                result = not result
    return result


def render(size: int, polygons: list[Polygon]) -> bytes:
    """Rendu supersamplé, renvoyé en lignes PNG (filtre 0 + RGB)."""
    step = 1.0 / (size * SUPERSAMPLE)
    rows = bytearray()
    samples = SUPERSAMPLE * SUPERSAMPLE
    for y in range(size):
        rows.append(0)
        for x in range(size):
            hits = 0
            for sy in range(SUPERSAMPLE):
                py = (y * SUPERSAMPLE + sy + 0.5) * step
                for sx in range(SUPERSAMPLE):
                    px = (x * SUPERSAMPLE + sx + 0.5) * step
                    if any(inside(polygon, px, py) for polygon in polygons):
                        hits += 1
            coverage = hits / samples
            rows.extend(
                round(AMBER[channel] + (CHARCOAL[channel] - AMBER[channel]) * coverage)
                for channel in range(3)
            )
    return bytes(rows)


def chunk(kind: bytes, payload: bytes) -> bytes:
    return (
        struct.pack('>I', len(payload))
        + kind
        + payload
        + struct.pack('>I', zlib.crc32(kind + payload) & 0xFFFFFFFF)
    )


def write_png(path: Path, size: int, raw: bytes) -> None:
    header = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)
    path.write_bytes(
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', header)
        + chunk(b'IDAT', zlib.compress(raw, 9))
        + chunk(b'IEND', b'')
    )


def main() -> None:
    polygons = glyph_polygons()
    target = Path(__file__).resolve().parent.parent / 'public' / 'icons'
    target.mkdir(parents=True, exist_ok=True)
    for size in SIZES:
        path = target / f'icon-{size}.png'
        write_png(path, size, render(size, polygons))
        print(f'{path} ({size}×{size})')


if __name__ == '__main__':
    main()
