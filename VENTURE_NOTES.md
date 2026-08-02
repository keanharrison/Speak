# Speak — Venture notes

Running log of founder insights, advisor feedback, and go-to-market decisions.  
Agents: read this when planning product, pitch, or demo work. Append new dated entries; don’t overwrite history.

---

## 2026-07-24 — McCoy: mobile-first demo (not desktop sidebar)

**Decision:** Optimize the web app for **phone screens** (responsive breakpoints). Demo via QR code → live mobile URL. Do **not** rebuild native Xcode/Swift for Demo Day.

**Why:**
- Sidebar / desktop dashboard feels B2B SaaS, not consumer-native
- Home-screen icon + push beats bookmarking a URL for retention/urgency
- Ideal users already carry phones; sample UX is high-friction enough — access shouldn’t add laptop friction
- Checking/sharing results anywhere matters

**Constraint:**
- Apple takes ~30% — **payments stay on web**, not IAP for Demo Day / early GTM

**Out of scope for now:**
- Full React Native / Expo rewrite (possible later; native Swift/Xcode too slow/fragile for timeline)
- Desktop-first sidebar as the primary experience

**Build implication:** Keep underlying architecture/functionality; change layout to mobile-first. QR on Demo Day table → live demo.

**McCoy bandwidth:** Can help with Figma Make / design; outreach fills most other time.

---

## 2026-07-24 — Megan: work backwards from Demo Day

**Demo Day goal:** Get someone to give us money (friends & family / angels — ~1 year from venture).

**Pitch vibe:** Hustlers who grabbed the opportunity immediately — interviews, partnerships, outreach in motion. Show how we think through problems. VCs like knowing people early even if not writing the check yet.

**What money is for:** Fund concrete next steps (name X/Y in ask — lab partners, beta push, etc.). Advice from angels also valuable.

**PMF path:**
- Need **beta users** and **vets**
- Beta ask: ~1×/week in app + **2 interviews**
- Target **angel beta users** who may love it *and* fund it

**Asks (3):**
1. Money ask — funds X and Y
2. Help pulling in beta users (esp. angel betas)
3. Advice going forward

**Pitch structure (Megan’s order):**
1. **Start with a story** (not stats first) — McCoy / childhood dog: whimpering, family present, hard decision to put dog down; later learn it may have been preventable. Audience nods — they’ve felt not knowing what’s going on inside their pet.
2. Pets = family. Nobody remembers percentages; they remember stories. Use stats sparingly; pick ones that serve the **core problem**.
3. Core problem Speak solves: **knowledge is power** + **early detection**
4. Solution section — keep; she liked it (direct, clear value prop)
5. Ask: “We already see with beta users that people want this” → tie back to the emotional story
6. Traction line to hit: signing lab partners in VA + finalizing push to beta users

**Fundraising stage framing:** Friends & family / angel now — not pitching as venture-ready yet.

---

## 2026-07-24 — Briefed from Drive doc `Speak` (folder: Speak)

Source: [Speak Google Doc](https://docs.google.com/document/d/1OF9DQJZ4VUcYnhaXND1twezk09fdwE12hDXOB6UtijM/edit) (master working doc — action items, research, pitch, partnerships).

**Product spine (locked):** Quarterly at-home screening → partner lab → plain English vs dog’s own baseline → flag → vet referral / booking / records. Screen & refer; never diagnose (teletriage). Wedge = follow-through, not detection.

**ICP:** Maya — Millennial pet parent 28–43, urban/inner-suburb, $75K+, often female; wants to be proactive but isn’t (“seems fine” + cost/inertia). Dogs first.

**Delivery (research in doc):** Mobile-responsive web as system of record + SMS (primary) / email (backup) for result + booking nudge. Native app deferred unless interviews prove a daily/weekly loop. (McCoy later pushed mobile-first UX + QR demo — align web to phone; payments stay web.)

**Architecture (research in doc):** Deterministic pipeline, not autonomous agents. Rules compute flags (population range + RCV vs baseline); LLM only translates already-flagged facts under schema/banned-phrase validation. Vet booking = concierge until real API. Stack direction: Next.js + Supabase + Vercel; Twilio/SendGrid later.

**Open ops blockers in doc:** Lab partner (NBVL / VA / UVA path; QSM/FetchDx conflicted), ICP interviews, entity rename from Vantage, state triage compliance, scheduling path.

**Pitch (Scout story):** Lead with Scout → silent disease / early detection → solution → “already doing” lab partners + beta (angel betas) → money funds X/Y + advice. Megan refinements already captured above.

**Prototype implications from doc:** Dead-simple collection story; green “all clear” + calm “one thing to check with vet”; trend line that sells subscription; mobile web demo for Demo Day; no diagnosis language.

---

## 2026-07-26 — Vet booking / handoff: future scope, not V1

**Decision:** Do **not** ship in-app vet booking or “Speak booked your appointment” flows in V1 / Demo Day.

**Why:**
- No veterinarian partnerships on the near-term roadmap
- Auto-booking with zero owner choice is bad product design and breaks trust
- Speak’s V1 job is **screen & refer** — flag change from baseline, explain in plain English, point the owner to *their* vet

**V1 instead:**
- Flag copy ends with “worth a vet conversation”
- Primary CTA from a flag → **Ask Speak** (what it means / what to do next / what to bring)
- Owner books with their existing clinic outside Speak

**Future iteration (post-V1):** optional booking/concierge only after partnerships + explicit owner-driven scheduling UX (never silent auto-book).

**Prototype:** `/handoff` redirects Home; Home/Results CTAs go to Ask, not a fake confirmation.

---

## 2026-07-26 — Supplementary positioning + Demo Night vision (Kean + McCoy)

### Thinking
- Angels/VCs at Demo Night will dismiss a product that looks like “pretty lab PDF in an app.” Home + Ask alone can read as thin unless the story shows Speak sitting *between* Maya, the lab, and her existing vet.
- “Supplementary” is the honest near-term stance: Speak does not replace the clinic. The risk is that “supplementary” sounds optional/weak. The counter is: Speak owns the longitudinal record and the moment of clarity *before* the visit — the vet still owns diagnosis and care.

### Pivot
- Away from: Speak as the system that auto-books the vet (no partners; silent booking destroys trust).
- Toward: Speak as the **owner’s prep + memory layer** for care that still happens at their clinic. Booking may appear in a Demo Night *mock* of the full vision only if it is clearly owner-initiated theater — not “we booked you.” Real scheduling integrations remain a hurdle, not a V1 claim.

### Hurdle / problem
- After a flag, Maya still has to: understand the change, decide whether to call the vet, remember what to say, bring the right context, and not lose the thread until the next kit. Labs and vets don’t close that loop for her; Google makes it worse (anxiety + junk).
- Quarterly cadence leaves a long quiet gap. If the app goes dark, membership feels like four PDFs a year.

### Solution direction (needs, not features)
Mission needs of owners who already use vets + labs:
1. **Know if something changed for *my* dog** — not a population scare chart.
2. **Understand without becoming a clinician** — plain English, no diagnosis cosplay.
3. **Know what to do next without panicking** — calm next step, timeboxing (“call this week” vs emergency theater).
4. **Show up to the vet prepared** — what changed, since when, what I’ve noticed at home; a packet she controls.
5. **Not lose context between kits / between visits** — notes, prior quarters, saved explanations.
6. **Trust the loop** — sample → lab → result → action is visible; no black box.

Booking is one *possible* answer to (3)/(4), not the only one. Until partners exist, the honest mock is **owner-driven readiness** (share/export/prep), with optional future “help me schedule” as vision — never Speak acting unilaterally.

### Demo Night implication
- Show full vision surfaces that serve those needs (prep packet, between-kit notes feeding Ask, dig-deeper grounding, membership/kit confidence) so Speak doesn’t read as dashboard-only.
- Do not fake closed vet partnerships. Mock interactions must stay compliant and owner-controlled.

---

## 2026-07-26 — Claude surface map vs mission needs (synthesis)

### Thinking
- Claude’s Home / Ask / You map is mostly the right *jobs*, not a random feature dump.
- Demo Night still needs one primary story (flagged baseline → clarity → prep for *her* vet). Other Home states (kit-in-flight, all-clear, quiet between-kit) are real, but secondary.

### Alignment
- Status-first Home, plain-English markers, one hero trend, Ask grounded in Bailey + chips, You = pet context + history, share-with-vet as loop-closer without clinic partnerships — matches supplementary positioning.

### Differences / corrections
- **Between-kit hook:** Claude overweights “general Ask questions (food/routine).” That’s useful but weak alone (generic chatbot risk). Stronger reopen reasons: observations/notes, saved answers, share packet, kit-in-flight status.
- **Kit tracker replacing status:** correct as a *state machine*, wrong as the default Demo Night screen.
- **Eight markers × one action line each:** too many CTAs. One primary action on the flagged marker; normals stay quiet/reassurance-only.
- **Notifications / insurance:** foreshadow GTM — keep thin; don’t center the pitch on them.

### Solution direction
- Demo Night path: flagged Home → trend/marker → Ask → **Share-with-vet packet** → You history.
- Stub: kit-in-flight Home, between-kit Ask mode, saved answers, insurance field, notification prefs.
- Defer: real booking, community, multi-pet, wearables.

---

## 2026-07-26 — Tab IA still open (brainstorm later)

### Thinking
- Home vs Results may be redundant if Home is only a “quick check” and Results is the same BLUF story with more detail.
- Ask as a peer tab may over-emphasize chat for what is mostly analysis + rewording. Alternatives: Results / Kit / You; Ask nested inside a result; or a Notes tab.
- Do not rearrange tabs mid-demo polish until the story path is locked.
- Cut product theater on Ask: no Save answer, no between-kit mode labels, no per-message “Speak explains / vet diagnoses” chrome. Maya already knows why she opened Ask; suggested questions can mix results + food without mode switches.

### Solution direction (2026-07-27 layout)
- **Home** = screening list (Q1–Q3) + slim kit strip. Tap a quarter → distilled BLUF + compact marker cards + one **Open in Speak** button.
- **Speak** = chatbot that digs into whatever card/test you opened.
- **Vet** = clinic, insurance, visits, schedule stub, share packet, screening history.
- **You** = pet + owner account + notifications.
- Dog-shaped in-app agent: brainstorm only — needs logo mockup first.

---

## Open threads (from these notes)

- [ ] Mobile-first layout pass on demo app (QR-ready)
- [ ] Pitch deck/story rewrite per Megan’s structure
- [ ] Beta program definition (1×/week + 2 interviews) + angel-beta ask
- [ ] Name what money funds (X and Y) for the ask
- [ ] Payments architecture: web checkout, mobile UX
