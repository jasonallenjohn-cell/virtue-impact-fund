# Virtue Impact Fund × Heal House — Investor Materials site

A single, shareable static site that collects the brand guidelines and every
deck behind one hub page. Open `index.html` and click through; open any deck and
print it to a clean, one-slide-per-page PDF.

## What's here

```
index.html              The hub — links to all four pieces (the page you share).
brand-guidelines.html   21 slides — the identity system.
offering-deck.html      13 slides — the fund offering.
listowel-lakeshore.html 13 slides — the two-site pipeline deck.
8440-highway-27.html    22 slides — the co-branded flagship project.

deck.css                Shared deck runtime styles (scaling + print).
deck.js                 Shared deck runtime (navigation + counter).
assets/                 Logos, photography, and project boards (shared).
source/                 The original Claude Design *.dc.html files (the source
                        of truth for slide content).
build.py                Regenerates the four deck .html files from source/.
```

## Presenting

Open any deck. Navigate with **← / →**, **Space**, **Page Up/Down**, **Home/End**,
number keys, or by **clicking** the left / right of the slide. The URL tracks the
current slide (`…/8440-highway-27.html#7`) so you can link to an exact slide.

## Printing to PDF (the reliable way)

1. Open the deck and press **⌘P** (Mac) or **Ctrl+P** (Windows).
2. Destination: **Save as PDF**.
3. **Margins: None**, **Background graphics: On**.

Each slide prints as its own full 1920×1080 (16:9) page — no scaling drift, the
text lands exactly where it does on screen. (This is what fixes the earlier
"prints wrong" problem: the deck switches to a print layout instead of letting
the browser fight the on-screen scaling.)

## Editing going forward

- **Change slide content:** edit the matching file in `source/` (each slide is a
  plain inline-styled `<section>`), then run the build:

  ```sh
  python3 build.py
  ```

  …or edit the generated `*.html` directly (a rebuild overwrites it).
- **Change navigation / print behaviour:** edit `deck.css` / `deck.js` once — all
  decks share them.
- **Change the hub:** edit `index.html` directly.

## Publishing

The whole folder is static — host it anywhere. It is currently set up to deploy
via GitHub Pages; pushing to the repo updates the live link. The same folder can
be connected to Vercel for auto-deploys if preferred.

---
*Confidential — Virtue Impact Fund × Heal House. Draft · illustrative · subject to diligence.*
