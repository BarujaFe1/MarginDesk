"""Generate demo seed CSVs and placeholder PNG assets for MarginDesk."""

from __future__ import annotations

import csv
import math
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED = ROOT / "data" / "seed"
ASSETS = ROOT / "assets"
SHOTS = ASSETS / "screenshots"


def write_seed_csvs() -> None:
    SEED.mkdir(parents=True, exist_ok=True)

    services = [
        ["service_id", "name", "hours", "hourly_rate", "notes"],
        ["svc-brand", "Brand system + guidelines", "28", "120", "Logo refresh"],
        ["svc-site", "Landing page (Next.js)", "40", "140", "Responsive landing"],
        ["svc-pm", "Project coordination", "8", "100", "Kickoff and reviews"],
    ]
    costs = [
        ["cost_id", "label", "category", "amount", "recurring"],
        ["cost-stock", "Stock photography pack", "assets", "180", "false"],
        ["cost-fonts", "Premium font license", "licenses", "120", "false"],
        ["cost-hosting", "Hosting (3 months)", "infra", "90", "false"],
        ["lib-figma", "Figma Professional (mês)", "tools", "75", "true"],
        ["lib-copy", "Copywriter freela (pacote)", "subcontract", "800", "false"],
    ]
    projects = [
        [
            "project_id",
            "client_name",
            "project_title",
            "planned_hours",
            "actual_hours",
            "price",
            "planned_margin_pct",
            "actual_margin_pct",
        ],
        ["prj-001", "Studio Norte", "Rebrand + landing page", "82", "71.5", "14500", "32.4", "37.1"],
        ["prj-002", "Agência Lume", "Social media retainer (setup)", "36", "48", "6800", "38.2", "17.6"],
        ["prj-003", "Consultoria Atlas", "Dashboard operacional MVP", "96", "102", "22000", "40.0", "37.1"],
    ]

    for name, rows in (
        ("services_demo.csv", services),
        ("costs_demo.csv", costs),
        ("projects_demo.csv", projects),
    ):
        with (SEED / name).open("w", encoding="utf-8", newline="") as fh:
            csv.writer(fh).writerows(rows)
        print("wrote", name, "rows", len(rows) - 1)


def png(path: Path, w: int, h: int, paint) -> None:
    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    raw = bytearray()
    for y in range(h):
        raw.append(0)
        for x in range(w):
            r, g, b = paint(x, y, w, h)
            raw.extend((r & 255, g & 255, b & 255))
    data = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def lerp(a: float, b: float, t: float) -> int:
    return int(a + (b - a) * t)


def clamp(v: float, lo: int = 0, hi: int = 255) -> int:
    return max(lo, min(hi, int(v)))


def icon_paint(x: int, y: int, w: int, h: int):
    cx, cy = w / 2, h / 2
    dx, dy = x - cx, y - cy
    dist = (dx * dx + dy * dy) ** 0.5
    t = min(dist / (w * 0.62), 1.0)
    r = lerp(18, 40, t)
    g = lerp(22, 55, 1 - t)
    b = lerp(28, 48, t)
    # Margin bars
    for i, bh in enumerate((0.35, 0.55, 0.72, 0.48)):
        bx0 = w * (0.28 + i * 0.12)
        bx1 = bx0 + w * 0.08
        by1 = h * 0.78
        by0 = by1 - h * bh
        if bx0 <= x <= bx1 and by0 <= y <= by1:
            gold = 0.55 + 0.1 * i
            return (
                clamp(180 + 40 * gold),
                clamp(130 + 20 * gold),
                clamp(60 + 10 * i),
            )
    # Desk line
    if abs(y - h * 0.78) < 2 and w * 0.22 < x < w * 0.78:
        return (212, 168, 75)
    return (clamp(r), clamp(g), clamp(b))


def hero_paint(x: int, y: int, w: int, h: int):
    t = y / h
    r = lerp(12, 28, t)
    g = lerp(16, 32, t)
    b = lerp(20, 36, t)
    # Soft gold glow top-left
    glow = math.exp(-(((x / w - 0.18) ** 2) / 0.08 + ((y / h - 0.2) ** 2) / 0.06))
    r = clamp(r + 90 * glow)
    g = clamp(g + 55 * glow)
    b = clamp(b + 20 * glow)
    # Panel blocks
    for px0, py0, pw, ph, tone in (
        (0.08, 0.28, 0.38, 0.42, 1.0),
        (0.52, 0.22, 0.40, 0.28, 0.85),
        (0.52, 0.56, 0.40, 0.28, 0.75),
    ):
        if px0 * w <= x <= (px0 + pw) * w and py0 * h <= y <= (py0 + ph) * h:
            return (
                clamp(30 + 18 * tone + 40 * glow),
                clamp(36 + 14 * tone),
                clamp(40 + 10 * tone),
            )
    return (r, g, b)


def arch_paint(x: int, y: int, w: int, h: int):
    bg = (14, 18, 22)
    # Horizontal flow nodes
    nodes = [0.12, 0.28, 0.44, 0.60, 0.76, 0.90]
    cy = h * 0.5
    for i, nx in enumerate(nodes):
        cx = w * nx
        if (x - cx) ** 2 + (y - cy) ** 2 <= (h * 0.08) ** 2:
            return (212, 168, 75) if i % 2 == 0 else (126, 184, 168)
        if i < len(nodes) - 1:
            x0, x1 = w * nx + h * 0.08, w * nodes[i + 1] - h * 0.08
            if x0 <= x <= x1 and abs(y - cy) < 2:
                return (120, 110, 90)
    # Subtle grid
    if x % 40 == 0 or y % 40 == 0:
        return (28, 34, 40)
    return bg


def shot_paint(label_hash: int):
    def paint(x: int, y: int, w: int, h: int):
        t = y / h
        r = lerp(10 + label_hash % 8, 26, t)
        g = lerp(14, 30 + (label_hash % 10), t)
        b = lerp(18, 34, t)
        # Header bar
        if y < h * 0.12:
            return (clamp(r + 20), clamp(g + 12), clamp(b + 8))
        # Content cards
        for i in range(3):
            y0 = h * (0.2 + i * 0.22)
            y1 = y0 + h * 0.18
            x0, x1 = w * 0.08, w * 0.92
            if x0 <= x <= x1 and y0 <= y <= y1:
                accent = (label_hash * (i + 3)) % 40
                return (clamp(32 + accent), clamp(38 + accent // 2), clamp(42))
        return (clamp(r), clamp(g), clamp(b))

    return paint


def generate_assets() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    SHOTS.mkdir(parents=True, exist_ok=True)

    png(ASSETS / "icon.png", 256, 256, icon_paint)
    png(ASSETS / "hero-cover.png", 1280, 640, hero_paint)
    png(ASSETS / "social-preview.png", 1280, 640, hero_paint)
    png(ASSETS / "architecture-pipeline.png", 1280, 520, arch_paint)

    shots = [
        "01-margin-calculator.png",
        "02-proposal-builder.png",
        "03-scope-risk-checklist.png",
        "04-cost-library.png",
        "05-project-margin-tracker.png",
        "06-profit-panel.png",
        "07-public-proposal.png",
        "08-billing-overview.png",
    ]
    for i, name in enumerate(shots):
        png(SHOTS / name, 960, 540, shot_paint(17 + i * 11))
        print("wrote", name)


if __name__ == "__main__":
    write_seed_csvs()
    generate_assets()
    print("done")
