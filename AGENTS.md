# AGENTS.md — Speak AI-Native Development Guide

> This file is the source of truth for how AI agents and human directors work together on this repo.
> Read this before touching any code. Update it when the team learns a better way.

---

## Who we are

**Human director:** Kean Harrison (direction, judgment, customer value, final accountability)
**Co-founder:** McCoy Ferguson
**Stack:** Next.js 14 + Tailwind CSS + TypeScript + Vercel
**Product:** Speak — at-home pet health screening membership for dog owners

---

## The AI-native team model

Four roles. Every session has all four.

| Role | Responsibility |
|---|---|
| Planning AI | Turns vision into options, architecture, tasks, risks, tests |
| Coding/debugging AI | Implements, refactors, explains changes, investigates failures |
| Human director | Owns direction, judgment, customer value, final accountability |
| MCP servers | Connect agents to tools (Figma, GitHub, etc.) |

The human director is never optional. AI proposes. Human decides.

---

## Model selection — use this every time

Per Terry Schoof, AI Solutions VP at Booz Allen Hamilton. Treat as gospel.

| Task | Model |
|---|---|
| Fast cheap edits, typos, copy tweaks | GPT-4.1 / Claude Haiku |
| Normal dev assistant | GPT-4.5 (Codex) |
| Cursor-style coding agent, real implementation | Claude Sonnet Thinking |
| Complex architecture, high-risk design decisions | Claude High/xHigh Thinking / Claude Opus |
| Multi-file refactor with tests | Codex High/xHigh / Claude Opus |
| Docs, READMEs, task breakdowns | Codex / Claude Sonnet |
| Debugging weird runtime issues | Codex High/xHigh first → Claude Sonnet to patch |
| Frontend/UI implementation | Claude Sonnet |
| Security, compliance, teletriage copy validation | Codex High Thinking |
| Agentic dev workflows | Codex High Thinking / Claude Thinking |

Never use a heavy model for a cheap task. Never use a cheap model for architecture.

---

## Development phases

### Phase 1 — Ideation
Before writing a single line:
- Who is the user? (Maya, 34, Millennial pet parent, $75K+, guilty but avoidant)
- What is the JTBD? (Know my dog is okay without having to think about it)
- What pain exists? (Inertia, cost, "the dog seems fine" rationalization)
- What are we NOT building? (Diagnosis, scheduling API, blood/DNA testing in V1, native app)

### Phase 2 — Planning
Every feature needs all five before implementation begins:
1. **Outcome** — what does done look like?
2. **Thin slice** — smallest demo-able path to that outcome
3. **Architecture** — which files, which components, which data shape
4. **Tasks/steps** — ordered, one at a time
5. **Acceptance criteria** — how do we know this is right?

### Phase 3 — Execution

**Strong loop (always do this):**
- Implement one task at a time
- Run or inspect immediately after each change
- Ask the AI what it changed and why
- Commit working checkpoints before moving on
- Use logs and screenshots as evidence

**Weak loop (never do this):**
- Ask for the whole app at once
- Accept giant diffs blindly
- Skip testing until the end
- Change scope mid-session

**Common trap:** starting too big. If a task takes more than 30 minutes, break it down further.

### Phase 4 — Troubleshoot and validate
1. Capture exact error text — copy it verbatim
2. Ask AI to diagnose via logs and screenshots
3. Verify the fix worked before moving on
4. Log the fix in LESSONS.md if it was non-obvious

---

## Architecture

```
/app
  /page.tsx                  → Landing page (waitlist)
  /dashboard/page.tsx        → Pet dashboard
  /results/page.tsx          → Q3 result view
  /handoff/page.tsx          → Vet booking confirmation
/components
  /Navbar.tsx
  /Footer.tsx
  /ResultCard.tsx
  /TrendLine.tsx
  /NotificationChip.tsx
  /VetBookingCard.tsx
/lib
  /hardcoded-data.ts         → All demo data lives here, nowhere else
```

All demo data is hardcoded in `/lib/hardcoded-data.ts`. No API calls, no database for the demo build. If you find yourself making a fetch request that isn't to an AI model, stop and check this file first.

---

## Brand and style rules

**Never change these without Kean's approval:**

- Canvas: `#EDEAE3`
- Ink: `#1A1A1A`
- Accent: `#C4763A`
- Footer: `#1A1A1A`
- White surfaces: `#FFFFFF`
- Muted text: `#777777`
- Normal indicator: `#2A8A5A`
- Flag indicator: `#C4763A`
- Font: Inter (Google Fonts)
- Border radius: 14px on cards
- No gradients, no shadows, no dark mode

---

## Compliance rules — NEVER violate these

These are not style preferences. They are legal requirements.

- Every result output ends with "worth a vet conversation" — never a condition name
- Never use: "diagnosis", "treatment", "you have", disease names, drug names
- The compliance footnote on the results screen is required and must not be removed
- Flag language: "changed from baseline" — never "abnormal"
- If any AI-generated copy crosses this line, reject it and rewrite

---

## Files to protect

Do not modify these without explicit instruction:
- `AGENTS.md` (this file)
- `LESSONS.md`
- `/lib/hardcoded-data.ts` (source of truth for all demo data)
- `/app/results/page.tsx` compliance footnote copy

---

## Drift prevention

Drift = an AI agent gradually moving away from the original goal.

Prevent it:
- Restate the objective at the start of every new thread
- Start a new thread for every distinct feature or bug
- Never let a single thread grow beyond ~20 exchanges
- Summarize decisions and prune noise regularly
- When in doubt, re-read this file and the PRD before continuing

Signs of drift: agent starts suggesting new features, changing the color palette, adding complexity that wasn't in the plan, or using different copy than what's in the PRD.

---

## Slash commands

| Command | What it does |
|---|---|
| `/plan` | Stacked sub-plans, run in order |
| `/test` | Gated manual test matrix |
| `/commit` | Logical grouped commits, approved first |
| `/changelog` | Bump to next minor, merge-friendly |
| `/make-pr` | Full PR body, blends new work in |
| `/status` | Five-bullet glance, no disruption |
| `/poke` | Hard interrupt, break out of loops |
| `/continue` | Resume after an interruption |
| `/help` | Smart wizard routing for next steps |

---

## Skills

If something works well in a Cursor thread, end the thread with: "Convert this into a skill so we don't have to explain it again." Skills live in `/skills/` and are referenced by commands.

---

## PR format

Every PR must include:
1. **Summary:** title, branch, what changed
2. **Key findings:** severity + finding + one-line impact
3. **Evidence:** file/area + brief evidence
4. **Tests:** pass/fail, what's missing
5. **Open questions:** anything unresolved
6. **Recommended actions:** specific next steps

---

## What we are building for Demo Day

A hardcoded, video-ready web app prototype that tells the Speak story end-to-end. Four screens. No real backend. All data is realistic and fake. Target: 90-second video demo for August 3-4, UVA Darden iLab Demo Day.

The demo does not need to be functional. It needs to be beautiful, fast, and story-correct.

---

## What we are NOT building (yet)

- Real lab integration
- Vet scheduling API
- Authentication / real accounts
- Blood, stool, or DNA testing
- Native mobile app
- Admin portal
- Subscription billing
- Cat panel
