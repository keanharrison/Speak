# Speak — Product Requirements Document

**Last updated:** 2026-07-21  
**Status:** Functional demo first. Visual design / brand polish deferred.  
**Demo Day:** August 3–4, UVA Darden iLab

---

## What we're building

Speak is an at-home pet health screening membership for dog owners. Owners receive a quarterly urinalysis kit, mail a sample to a partner lab, and receive results translated into plain English against their dog's own longitudinal baseline. When something looks off, Speak flags it and refers the owner to a vet. We never diagnose — we screen and refer.

This PRD covers the **demo build**: a hardcoded, video-ready web app that tells the Speak story end-to-end. No live backend, auth, payments, or real AI. All data is realistic and fake.

**Current priority:** Functionality, navigation, and story clarity. Aesthetics come later.

**UX direction (2026-07-24):** Mobile-first web app (phone breakpoints). Demo Day via QR → live URL. Payments stay on web (avoid App Store cut). See [VENTURE_NOTES.md](./VENTURE_NOTES.md).

---

## Demo characters

| Role | Details |
|---|---|
| Pet | Bailey — Golden Retriever, 4 years, female, 62 lbs |
| Owner | Maya — Active membership · $30/mo |
| Quarter | Q3 2026 |
| Story beat | Kidney concentration (urine specific gravity) trending down: Q1 1.048 → Q2 1.045 → Q3 1.022. One value changed from Bailey's baseline. Worth a vet conversation. |
| Vet | Dr. Sarah Chen, Crozet Animal Hospital — Tuesday, July 22 · 2:00 PM |

---

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (utility layout only for now — no brand-locked visual system in this PRD)
- Lucide React
- Vercel
- All demo data in `src/lib/hardcoded-data.ts` — never hardcode strings in JSX

---

## Compliance (legal — never violate)

- Every flagged output ends with **"worth a vet conversation"** — never a condition name
- Never use: "diagnosis", "treatment", "you have", disease names, drug names
- Flag language: **"changed from baseline"** — never "abnormal"
- Results view requires footnote: Speak screens and refers. We never diagnose.
- Ask Speak requires: **"Speak explains. Your vet diagnoses."**
- AI answers must stay grounded in Bailey's record and never invent clinical conclusions

---

## Information architecture

### Primary nav (sidebar)

| Item | Purpose |
|---|---|
| **Dashboard** | Coupled health home: status + markers + trends + drill-down (see below) |
| **Ask Speak** | Plain-English Q&A on Bailey's record; BLUF first, dig deeper optional |
| **Scheduling** | TBD after interviews — placeholder for now |
| **Lab messages** | TBD — candidate for owner↔vet coordination layer; placeholder for now |
| **Profile** | Two tabs: **Pet** \| **Owner** |
| **Settings** | TBD — placeholder for now |

### Flow destinations (not primary nav)

| Route | Purpose |
|---|---|
| `/onboarding` | First-run: dog info → insurance question → confirmation → Dashboard |
| `/handoff` | Vet booking confirmation after user acts on a flag |

### Explicitly cut from demo

- **Package delivery** — quarterly kits are expected; tracker doesn't carry the story
- **Separate Bailey nav item** — replaced by Profile → Pet tab
- **Landing page polish** — blank / placeholder until design exploration is done
- **Standalone Results page as equal peer to Dashboard** — coupled into Dashboard (see below)

---

## Core product decisions

### 1. Dashboard + Results are coupled

**Problem:** Separate Dashboard and Results screens heavily overlap (same 8 markers, same story).

**Decision:** One **Dashboard** experience with progressive disclosure:

1. **At a glance** — status banner, priority signal (what's changed), key trend
2. **Marker overview** — cards / widgets for the screening panel
3. **Drill-down** — clicking a marker expands detail (modal or inline panel): technical name, value, reference range, plain-English explanation, sparkline/trend if relevant
4. **Action** — if something changed from baseline → Book a vet visit → `/handoff`

There is **no separate primary "Results" tab** in the target IA. If a `/results` route exists during migration, it should redirect or act as a deep-link into the dashboard drill-down for the flagged marker.

**Open (needs interviews + solidification):**
- Exactly which widgets belong on the default view vs. behind drill-down
- Whether the dashboard is **static** for demo vs. later **dynamic** (bespoke widgets per pet / flags)
- Final set and ranking of the 8 markers (what's "most important" for Maya)

### 2. Candidate marker set (demo — plain English)

Working list for the urinalysis panel. Subject to change after interviews.

| Plain-English label | Demo value | Status |
|---|---|---|
| Kidney concentration | Slightly low | Changed from baseline / Trending ↓ |
| Urine acidity | Healthy | Normal |
| Kidney filter health | Healthy | Normal |
| Blood sugar | Not detected | Normal |
| Protein leakage | Not detected | Normal |
| Fat breakdown | Not detected | Normal |
| Liver stress | Not detected | Normal |
| Blood in urine | Not detected | Normal |

**Rule:** UI labels stay plain English. Technical names (e.g. Urine Specific Gravity · 1.022) appear only in drill-down.

### 3. Ask Speak — BLUF + dig deeper + observability

**Demo:** Hardcoded conversation (no live model).

**Product pattern:**
1. **BLUF first** — immediate plain answer
2. **Dig deeper** — user can expand / click components of the answer (specific claims, markers, time periods)
3. **Sources / grounding** — show (or make available) what Speak used: quarter values, baseline comparison, report text
4. **Non-goals in answer** — never diagnose; end flagged guidance with vet conversation language

**Demo debate (open):** Whether sources are visible in the Demo Day video UI, or present in product but collapsed. Direction: sources should be *ready*; visual treatment TBD.

**Observability analogy:** Like expanding Cursor's thinking — user can see *what* Speak looked at and *why* it said what it said.

**Grounding context (future real product):** pet longitudinal markers, current quarter results, flags, owner notes (if shipped), appointment state — not unbounded "big data" without provenance.

### 4. Profile (Pet | Owner)

Single **Profile** tab with two sub-tabs:

- **Pet** — Bailey identity, weight, history timeline (Q1–Q3 summaries), next kit, membership tied to pet
- **Owner** — Maya identity, household, insurance (ties to onboarding B2B2C beat)

### 5. Onboarding

Three steps:

1. Tell us about your dog (pre-filled Bailey for demo)
2. Do you have pet insurance? → surfaces "Your insurer may cover this. We'll check." (McCoy / B2B2C story)
3. You're all set → Start membership → Dashboard

### 6. Handoff

Confirmation that Speak booked the visit and sent records ahead. Closes the loop after a baseline change. Not a sidebar destination.

### 7. Lab messages / vet coordination (hypothesis — not built yet)

Candidate future role for **Lab messages** (or a renamed Coordination tab):

- Owner provides vet email
- Speak helps send structured updates / records
- Backend LLM + email API is a possible implementation later

**Status:** Interesting; **blocked on user interviews.** Placeholder only in demo.

### 8. Owner Notes / knowledge base (hypothesis — not built yet)

Idea: owner can speak or type qualitative notes ("Today Bailey didn't seem herself because…") that become part of the pet knowledge base alongside lab results, unlocking paired insights later.

**Status:** Unvalidated. Include in interviews before committing UI. Not required for Demo Day unless interviews strongly demand it.

---

## Demo flow (video target ~90s)

1. `/onboarding` — complete 3 steps (include insurance beat)
2. `/dashboard` — status, markers, trend, drill into kidney concentration
3. Book a vet visit → `/handoff` — confirmation + records sent
4. Optional: `/ask` — BLUF answer + dig-deeper / sources beat

Landing is not part of the demo path until redesigned.

---

## Screens — build status for this PRD

| Screen | Demo requirement |
|---|---|
| Landing `/` | Placeholder / blank — skip polish |
| Onboarding `/onboarding` | Required |
| Dashboard `/dashboard` | Required — coupled summary + drill-down |
| Ask Speak `/ask` | Required — hardcoded BLUF chat; dig-deeper stubs OK |
| Handoff `/handoff` | Required — flow destination |
| Profile `/profile` | Required — Pet \| Owner tabs |
| Scheduling `/scheduling` | Placeholder heading + one sentence |
| Lab messages `/lab-messages` | Placeholder; coordination TBD post-interviews |
| Settings `/settings` | Placeholder |
| Delivery | **Cut** |
| Standalone Results nav | **Coupled into Dashboard** |

---

## V1 scope (post-demo, real product)

**In scope for real V1 (directional):**
- Urinalysis kit + lab pipeline
- Account + pet/owner profile
- Longitudinal baseline + flags
- Plain-English results + vet referral / concierge handoff
- Ask Speak grounded on pet record
- Notifications (email/SMS)
- Vet-ready summary / PDF

**Deferred / interview-gated:**
- Owner↔vet coordination / email automation
- Owner voice/text notes knowledge base
- Dynamic per-pet dashboard widgets
- In-app scheduling API
- Billing automation
- Blood / stool / DNA
- Admin portal, cats, B2B beyond insurance tease

---

## Open questions (interviews first)

See [INTERVIEW_QUESTIONS.md](./INTERVIEW_QUESTIONS.md) — YC / Mom Test script (past behavior only; no product pitch).

Product hypotheses to validate *after* interviews (not in the interview script itself):
- Coupled dashboard vs separate report
- Which markers matter at a glance
- Vet email / coordination layer
- Owner qualitative notes
- Ask Speak sources / dig-deeper
- Insurance question in onboarding

---

## Non-goals for this demo

- Real auth, payments, lab APIs, live LLM
- Functional PDF download / calendar add (UI stubs OK)
- Landing page visual redesign
- Brand color system / typography overhaul (deferred — do not encode colors in this PRD)
- Delivery tracking
- Separate Bailey tab

---

## Repo notes

- Repo: `speak-app`
- Branch: `main`
- Deploy: Vercel
- Env vars for demo: none
- Source of truth for copy/data: `src/lib/hardcoded-data.ts`
