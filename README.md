# Speak

At-home pet health screening membership for dog owners. Quarterly urinalysis, plain-English results against each dog's longitudinal baseline, and vet referral when something looks off. We screen and refer — never diagnose.

**Demo Day:** August 3–4, UVA Darden iLab

## Docs

- [PRD.md](./PRD.md) — product requirements (functional demo; design deferred)
- [VENTURE_NOTES.md](./VENTURE_NOTES.md) — founder/advisor insights (append-only)
- [INTERVIEW_QUESTIONS.md](./INTERVIEW_QUESTIONS.md) — YC / Mom Test interview script
- [GOOGLE_DRIVE_MCP.md](./GOOGLE_DRIVE_MCP.md) — Google Drive MCP setup
- [MOBILE_UI_NOTES.md](./MOBILE_UI_NOTES.md) — patterns from mobile UI reference video
- [AGENTS.md](./AGENTS.md) — AI agent workflow
- [LESSONS.md](./LESSONS.md) — locked decisions
- [LANDING_LAYOUT.md](./LANDING_LAYOUT.md) — landing layout plan (spec only; on hold)
- [public/references/](./public/references/) — Cleo / Pymander UI references

## Stack

Next.js 14 (App Router) · Tailwind CSS · TypeScript · Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo routes

| Route | Screen |
|---|---|
| `/` | Landing |
| `/dashboard` | Bailey's health record |
| `/results` | Q3 urinalysis results |
| `/ask` | Ask Speak (hardcoded Q&A) |
| `/bailey` | Pet profile |
| `/handoff` | Vet booking confirmation |
| `/scheduling` | Scheduling placeholder |
| `/lab-messages` | Lab messages placeholder |
| `/delivery` | Package delivery status |
| `/settings` | Settings placeholder |
| `/profile` | Profile placeholder |

All demo data lives in `src/lib/hardcoded-data.ts`. No env vars required for the demo.
