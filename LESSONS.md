# LESSONS.md — Speak

> Collaborative doc that locks in decisions so agents never repeat the same mistake.
> Add a lesson every time a non-obvious fix is found. Date every entry.

---

## Format

```
### [Date] — [Short title]
**What happened:** brief description of the issue or decision
**What we learned:** the rule that prevents it from happening again
**Applies to:** which files, components, or patterns this affects
```

---

## Lessons

### 2026-07-19 — Compliance copy must never be AI-generated freely
**What happened:** Initial PRD draft used language that could be read as diagnostic.
**What we learned:** All result copy must follow the template: "[marker] has [changed/is within] [Bailey's baseline / the expected range]. [Plain-English explanation.] This is worth a conversation with your vet." The AI must never freestyle result copy outside this template.
**Applies to:** `/app/results/page.tsx`, `/lib/hardcoded-data.ts`, any AI Q&A feature

### 2026-07-19 — All demo data lives in one place
**What happened:** Risk of hardcoded data scattered across components making the demo inconsistent.
**What we learned:** All hardcoded demo data (Bailey's name, values, vet info, dates) lives exclusively in `/lib/hardcoded-data.ts`. Components import from there. Never hardcode strings directly in JSX.
**Applies to:** All screen components

### 2026-07-19 — Brand colors are locked
**What happened:** Multiple palette iterations during branding research.
**What we learned:** Canvas `#EDEAE3`, Ink `#1A1A1A`, Accent `#C4763A`. These do not change without explicit human director approval. No agent should suggest or implement color changes without being asked.
**Applies to:** All components, Tailwind config

### 2026-07-19 — No gradients, shadows, or dark mode
**What happened:** Default Tailwind and component libraries add shadows and hover effects by default.
**What we learned:** Speak's aesthetic is flat and clean (Pymander-style). Strip all box-shadows, gradients, and dark mode classes from components. Only exception: `border: 0.5px solid rgba(0,0,0,0.07)` on white cards.
**Applies to:** All components, global CSS
