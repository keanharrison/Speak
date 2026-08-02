# Mobile UI notes — from Blossom Movie (SwiftUI) tutorial

Source: Blossom Build / Carlos — “complete iOS app” SwiftUI course (Blossom Movie).  
**Not** building a native movie app. Extract **patterns** useful for Speak’s **mobile web** demo.

---

## Patterns to steal for Speak

### 1. Bottom tabs as the app chrome
- Four (or fewer) tabs in a bottom toolbar — not a left sidebar.
- Each tab owns a screen; root view only hosts the tab container.
- **Speak mapping:** Dashboard · Ask Speak · Profile · More (Scheduling / Lab / Settings stubs).

### 2. Thin shell, fat screens
- Keep the root layout clean (tab host only).
- One file/component per screen so screens don’t balloon.

### 3. Centralized copy & icons
- Tutorial used a `Constants` file for tab labels and SF Symbol names.
- **Speak mapping:** keep using `hardcoded-data.ts` (+ Lucide icons). No strings littered in JSX.

### 4. Hero + scroll body
- Home opens with a hero, then vertically scrollable sections.
- Gradient/fade between hero and content softens the cut (optional polish later).
- **Speak mapping:** status/flag hero band → marker cards → trend section.

### 5. Reusable list/card building blocks (DRY)
- One horizontal-list / card component reused with different headers/data.
- Prefer compose-once, use-many over copy-paste styles.
- **Speak mapping:** `MarkerCard`, `StatusBanner`, `TrendChart`, `PillButton`.

### 6. Detail via navigation / drill-down
- Tap item → detail screen (name, description, actions).
- Prefer explicit navigation path over fragile nested links when possible.
- **Speak mapping:** tap marker → detail sheet/modal (plain English + technical + explanation).

### 7. Loading / empty / error states
- Explicit UI states: not started · loading · success · failed · empty list message.
- Don’t leave a blank screen when there’s nothing to show.
- **Speak mapping:** stubs for empty Ask / no downloads equivalent; loading only if we add async later (demo is mostly static).

### 8. Search UX (later / Ask Speak inspiration)
- Searchable bar, toggle mode, **debounce** (~500ms) so you don’t fire on every keystroke.
- Default content when search is empty.
- **Speak mapping:** Ask Speak input can stay disabled for demo; debounce if we ever wire live search.

### 9. Persist “saved” items (optional later)
- Tutorial: download tab + local persistence (SwiftData).
- **Speak mapping:** not needed for Demo Day; handoff confirmation is enough.

### 10. Buttons that work inside scroll
- Ghost/outline buttons (frame + stroke) used repeatedly via a shared style.
- Note: scroll containers can steal tap animations — still ensure buttons remain tappable (web: normal buttons/links).

---

## What *not* to copy

- Movie/TV APIs, YouTube trailers, download manager
- SwiftUI / Xcode / SwiftData / MVVM-for-native specifically
- Hard-coded hex brand from the tutorial (Speak brand deferred; function first)
- Desktop sidebar layouts

---

## Speak demo alignment

| Tutorial idea | Speak mobile demo |
|---|---|
| Bottom TabView | Mobile bottom nav |
| Home hero + lists | Dashboard banner + markers + trend |
| Detail screen | Marker detail sheet |
| Search tab | Ask Speak |
| Download tab | Skip / replace with Profile |
| Constants file | `hardcoded-data.ts` |
| QR / phone demo | Mobile-first breakpoints, Demo Day QR |

---

## Build order reminder

Functionality first → aesthetics later. One screen/feature at a time; approve before next.
