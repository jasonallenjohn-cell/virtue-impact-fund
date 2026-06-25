#!/usr/bin/env python3
"""
Virtue Impact Fund — deck build step.

Reads the Claude Design source files in ./source/*.dc.html and emits clean,
standalone, dependency-free deck HTML files in this folder. Each output deck:
  • keeps the original slide markup verbatim (pixel-faithful)
  • drops the proprietary <x-dc> / <x-import> / support.js / deck-stage.js runtime
  • wires up the shared ./deck.css + ./deck.js instead

Re-run after editing any source file:   python3 build.py

To change a deck's CONTENT, edit the matching file in ./source/ and rebuild,
or edit the generated .html directly (a rebuild will overwrite it).
"""
import re
import html
import pathlib

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "source"

# source filename -> (output filename, <title>)
DECKS = [
    ("Virtue Impact Fund - Platform Investor Deck.dc.html",
     "platform-investor-deck.html", "Virtue Impact Fund × Heal — Platform Investor Deck"),
    ("Virtue Impact Fund - The Fund.dc.html",
     "the-fund.html", "Virtue Impact Fund — The Fund"),
    ("Virtue Impact Fund - Platform Ecosystem.dc.html",
     "platform-ecosystem.html", "Virtue Impact Fund × Aevum × Heal — The Platform"),
    ("Virtue Impact Fund - Brand Guidelines.dc.html",
     "brand-guidelines.html", "Virtue Impact Fund — Brand Guidelines"),
    ("Virtue Impact Fund - Offering Deck.dc.html",
     "offering-deck.html", "Virtue Impact Fund — Offering Deck"),
    ("Virtue Impact Fund - Listowel + Lakeshore.dc.html",
     "listowel-lakeshore.html", "Virtue Impact Fund — Listowel + Lakeshore"),
    ("Virtue Impact Fund - 8440 Highway 27.dc.html",
     "8440-highway-27.html", "Virtue Impact Fund × Heal — 8440 Highway 27"),
    ("Virtue Impact Fund - Keele Street King City.dc.html",
     "keele-street-king-city.html", "Virtue Impact Fund × Heal — 12882 Keele Street, King City"),
    ("Virtue Impact Fund - 584 Oakwood Avenue.dc.html",
     "584-oakwood-avenue.html", "Virtue Impact Fund × Heal — 584 Oakwood Avenue"),
    ("Virtue Impact Fund - 27 Blake Street Barrie.dc.html",
     "27-blake-street-barrie.html", "Virtue Impact Fund × Heal — 27-31 Blake Street, Barrie"),
    ("Virtue Impact Fund - 286 Ardagh Road Barrie.dc.html",
     "286-ardagh-road-barrie.html", "Virtue Impact Fund × Heal — 286 Ardagh Road, Barrie"),
    ("Virtue Impact Fund - 6700 Highway 7 Vaughan.dc.html",
     "6700-highway-7-vaughan.html", "Virtue Impact Fund × Heal — 6700 Highway 7, Vaughan"),
]

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<script src="gate.js"></script>
<title>{title}</title>
<!-- ===== fonts + brand helper classes (from the design source helmet) ===== -->
{helmet}
<link rel="icon" type="image/png" href="assets/favicon-vif.png">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="A ~$50M impact fund across seven Build Canada Homes projects in Ontario — the fund becomes the landowner.">
<meta property="og:image" content="https://jasonallenjohn-cell.github.io/virtue-impact-fund/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:image" content="https://jasonallenjohn-cell.github.io/virtue-impact-fund/assets/og-image.png">
<link rel="stylesheet" href="deck.css">
</head>
<body>
<a class="deck-home" href="materials.html" title="Back to all materials">&larr; All materials</a>
<div class="stage" id="stage">
  <div class="canvas" id="canvas">
{slides}
  </div>
</div>
<div class="deck-overlay" id="deckOverlay" aria-hidden="true"></div>
<script src="deck.js"></script>
</body>
</html>
"""


def extract(text):
    helmet_m = re.search(r"<helmet>(.*?)</helmet>", text, re.DOTALL)
    ximport_m = re.search(r"<x-import\b[^>]*>(.*?)</x-import>", text, re.DOTALL)
    if not helmet_m or not ximport_m:
        raise ValueError("source file is not in the expected <x-dc> format")
    helmet = helmet_m.group(1).strip()
    sections = re.findall(r"<section\b.*?</section>", ximport_m.group(1), re.DOTALL)
    return helmet, sections


def main():
    for src_name, out_name, title in DECKS:
        text = (SRC / src_name).read_text(encoding="utf-8")
        helmet, sections = extract(text)
        slides = "\n".join(
            '    <div class="slide{cls}">{body}</div>'.format(
                cls=" active" if i == 0 else "", body=s
            )
            for i, s in enumerate(sections)
        )
        out = PAGE.format(title=html.escape(title), helmet=helmet, slides=slides)
        (HERE / out_name).write_text(out, encoding="utf-8")
        print(f"  {out_name:24s}  {len(sections):>2d} slides")


if __name__ == "__main__":
    print("Building Virtue Impact Fund decks…")
    main()
    print("Done.")
