# Landing page layout plan

> Spec only — not implemented. Use this as a map when you return with screenshots.
> Landing route (`/`) is currently a blank canvas while you gather inspiration.

---

## Design intent

Hybrid of:

- **Cleo** — cinematic photography, full-bleed hero, glass morphism, dark sections, pill nav
- **Pymander** — earth tones, heavy confident typography, simple sections, notification chips on photo cards

Reference images live in `public/references/`.

---

## Proposed section stack (top → bottom)

### 1. Nav (over hero)
- Left: Speak logo / wordmark
- Center or mid: How it works · Manifesto · FAQ
- Right: primary CTA (Try Now)
- Style direction: transparent / glass pill over hero photo (Cleo-like)

### 2. Hero (full viewport)
- Full-bleed photography (dog / lifestyle, warm light)
- Dark gradient overlay fading into dark section below
- Centered headline (editorial display font):
  - Line 1: "Your dog can't tell you what's wrong."
  - Line 2: "Speak can." (accent)
- Short subhead under headline
- Primary CTA under subhead
- Optional: scroll hint

### 3. Feature cards (dark band)
- Background continues from hero fade (`#1A1A1A`)
- Three cards in a row (stack on mobile)
- Glass / frosted card treatment
- Each card:
  - Notification chip at top (status signal)
  - Bold label + short subtitle at bottom
- Themes: Early detection · Plain English results · Show up prepared (share packet)

### 4. How it works (light canvas)
- Background: warm canvas (`#EDEAE3`)
- Three numbered steps:
  1. We mail you a kit
  2. A lab runs it
  3. We tell you what it means
- Large step numbers + short body copy
- Three columns desktop / stacked mobile

### 5. Social proof (white)
- Header: "What pet parents are saying."
- Three static testimonial cards
- Each: dog photo · dog name/age · short quote · owner name

### 6. FAQ (warm off-white)
- Header: "Common questions."
- Accordion list (expand/collapse)
- Topics: kit mechanics · not a vet replacement · quarterly cadence · what's included in membership

### 7. Footer (dark)
- Dark bar (`#1A1A1A`)
- Left: speak
- Right: tagline ("Your dog's health record")

---

## Content sources

All final copy should live in `src/lib/hardcoded-data.ts` when implemented.

Existing landing copy already includes:
- Hero headline / accent / subhead
- Try Now CTA → `/dashboard`
- Three feature cards (chips + labels)

Still to add when building:
- How it works steps
- Testimonials
- FAQ items

---

## Brand constraints (current docs)

Locked in `AGENTS.md` / `PRD.md` unless Kean updates them:

- Colors: canvas `#EDEAE3`, ink `#1A1A1A`, accent `#C4763A`
- Compliance: screen and refer — never diagnose
- Flag language: "changed from baseline" — never "abnormal"

Likely doc exceptions needed for this redesign:
- Display font for headlines (e.g. Playfair Display)
- Gradients / glass / soft depth on landing only
- Hero CTA treatment may differ from black-pill app CTAs

---

## Implementation notes (for later)

- Touch landing only until approved: `src/app/page.tsx` (+ layout fonts / data as needed)
- Do not redesign dashboard/app pages in the same pass
- Prefer screenshot-driven implementation: you bring references → we match specific UI beats

---

## Blank canvas status

`src/app/page.tsx` is intentionally empty of UI chrome right now so you can explore freely and return with screenshots.
