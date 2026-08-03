import type {
  AskPageContent,
  BaileyPageContent,
  DashboardContent,
  DashboardPageContent,
  DeliveryPageContent,
  HandoffPageContent,
  InfoPageContent,
  GlassLabPageContent,
  LandingCard,
  Pet,
  PlaceholderPageContent,
  QuarterlyResult,
  ResultsPageContent,
  SidebarNavItem,
  TrendPoint,
  VetAppointment,
  VetPageContent,
  YouPageContent,
} from "@/types";

/** Single source of truth for all Speak demo data. Import from here — never hardcode in JSX. */

export const pet: Pet = {
  name: "Bailey",
  breed: "Golden Retriever",
  ageYears: 4,
  sex: "female",
};

export const usgTrend: TrendPoint[] = [
  { quarter: "Q1", value: 1.048 },
  { quarter: "Q2", value: 1.045 },
  { quarter: "Q3", value: 1.022 },
];

export const currentQuarter = "Q3 2026";

/** Mobile bottom nav — Home · Speak · Care · You */
export const mobileNav = {
  wordmark: "Speak",
  tabs: [
    { href: "/dashboard", label: "Home", icon: "home" },
    { href: "/ask", label: "Speak", icon: "messageCircle" },
    { href: "/vet", label: "Care", icon: "vet" },
    { href: "/insurance", label: "Claim", icon: "claim" },
    { href: "/profile", label: "Profile", icon: "user" },
  ] satisfies SidebarNavItem[],
} as const;

/** @deprecated Prefer mobileNav for the demo shell. Kept for reference. */
export const sidebar = {
  wordmark: "Speak",
  primaryNav: [
    { href: "/dashboard", label: "Dashboard", icon: "home" },
    { href: "/ask", label: "Ask Speak", icon: "messageCircle" },
    { href: "/scheduling", label: "Scheduling", icon: "calendar" },
    { href: "/lab-messages", label: "Lab messages", icon: "flask" },
  ] satisfies SidebarNavItem[],
  secondaryNav: [
    { href: "/profile", label: "Profile", icon: "user" },
    { href: "/settings", label: "Settings", icon: "settings" },
  ] satisfies SidebarNavItem[],
  user: {
    initial: "M",
    name: "Maya",
    subtitle: "Active · $30/mo",
  },
} as const;

/** Q3 panel markers — source for the latest screening test detail. */
const q3MetricCards = [
  {
    id: "kidney_concentration",
    plainLabel: "Kidney concentration",
    plainValue: "1.022",
    technicalLabel: "Urine Specific Gravity · 1.022",
    referenceRange: "Normal range: 1.015 – 1.050",
    explanation:
      "This measures how concentrated Bailey's urine is — a signal of how well her kidneys are retaining water. Her value has drifted downward over three quarters, which is worth discussing with your vet.",
    status: "changed" as const,
    statusLabel: "Changed from baseline",
    sparkline: "down" as const,
  },
  {
    id: "urine_acidity",
    plainLabel: "Urine acidity",
    plainValue: "6.5",
    technicalLabel: "pH · 6.5",
    referenceRange: "Normal range: 5.5 – 7.5",
    explanation:
      "Urine acidity reflects Bailey's diet and overall urinary health. Her level is in a healthy range with no change from prior quarters.",
    status: "normal" as const,
    statusLabel: "Within baseline",
    sparkline: "flat" as const,
  },
  {
    id: "kidney_filter_health",
    plainLabel: "Kidney filter health",
    plainValue: "0.28",
    technicalLabel: "UPC Ratio · 0.28",
    referenceRange: "Normal range: below 0.40",
    explanation:
      "This ratio compares protein to creatinine in urine — a sensitive early signal of kidney filter stress. Bailey's value is healthy.",
    status: "normal" as const,
    statusLabel: "Within baseline",
    sparkline: "flat" as const,
  },
  {
    id: "blood_sugar",
    plainLabel: "Blood sugar",
    plainValue: "Negative",
    technicalLabel: "Glucose · Negative",
    referenceRange: "Normal range: not detected",
    explanation:
      "Glucose in urine can be an early sign of blood sugar issues. None was detected in Bailey's sample — a reassuring result.",
    status: "normal" as const,
    statusLabel: "Within baseline",
    sparkline: "flat" as const,
  },
  {
    id: "protein_leakage",
    plainLabel: "Protein leakage",
    plainValue: "Negative",
    technicalLabel: "Protein · Negative",
    referenceRange: "Normal range: not detected",
    explanation:
      "Protein in urine can indicate early kidney stress. None was found in Bailey's sample.",
    status: "normal" as const,
    statusLabel: "Within baseline",
    sparkline: "flat" as const,
  },
  {
    id: "fat_breakdown",
    plainLabel: "Fat breakdown",
    plainValue: "Negative",
    technicalLabel: "Ketones · Negative",
    referenceRange: "Normal range: not detected",
    explanation:
      "Ketones appear when the body breaks down fat for energy. None were detected — Bailey's metabolism looks stable.",
    status: "normal" as const,
    statusLabel: "Within baseline",
    sparkline: "flat" as const,
  },
  {
    id: "liver_stress",
    plainLabel: "Liver stress",
    plainValue: "Negative",
    technicalLabel: "Bilirubin · Negative",
    referenceRange: "Normal range: not detected",
    explanation:
      "Bilirubin in urine can signal liver or bile duct stress. None was detected in Bailey's sample.",
    status: "normal" as const,
    statusLabel: "Within baseline",
    sparkline: "flat" as const,
  },
  {
    id: "blood_in_urine",
    plainLabel: "Blood in urine",
    plainValue: "Negative",
    technicalLabel: "Blood / RBC · Negative",
    referenceRange: "Normal range: not detected",
    explanation:
      "Blood cells in urine can indicate infection, inflammation, or other urinary tract issues. None were found.",
    status: "normal" as const,
    statusLabel: "Within baseline",
    sparkline: "flat" as const,
  },
];

function allClearMarkers(usg: string) {
  return q3MetricCards.map((card) =>
    card.id === "kidney_concentration"
      ? {
          ...card,
          plainValue: usg,
          technicalLabel: `Urine Specific Gravity · ${usg}`,
          status: "normal" as const,
          statusLabel: "Within baseline",
          sparkline: "flat" as const,
          explanation:
            "Bailey's kidney concentration matched her usual pattern this quarter.",
        }
      : {
          ...card,
          status: "normal" as const,
          statusLabel: "Within baseline",
          sparkline: "flat" as const,
        },
  );
}

export const dashboardPage: DashboardPageContent = {
  greetingSubtitle: `${pet.name} · ${pet.breed} · ${pet.ageYears} years`,
  storyLine: "Screen · plain English · prep for your vet",
  testsHeading: "Past screenings",
  latestSummary: {
    eyebrow: "Latest results",
    detailsLabel: "View details",
  },
  recentChatsHeading: "Resume in Speak",
  recentChatsCtaLabel: "Continue",
  recentChats: [
    {
      id: "q3-kidney",
      title: "Kidney trend check",
      preview: "Q3 2026",
      href: "/ask?chat=q3-kidney",
    },
    {
      id: "q2-all-clear",
      title: "All-clear check-in",
      preview: "Q2 2026",
      href: "/ask?chat=q2-all-clear",
    },
  ],
  kitStatus: {
    heading: "Kit",
    statusLabel: "Results ready",
    steps: [
      { label: "Dispatched", status: "complete" },
      { label: "Delivered", status: "complete" },
      { label: "Registered", status: "complete" },
      { label: "Mailed", status: "complete" },
      { label: "Lab", status: "complete" },
      { label: "Results", status: "current" },
    ],
    nextKitDetail: "Next kit ships October 1",
    daysUntilNextKit: 67,
  },
  kitInFlightStatus: {
    heading: "Kit",
    statusLabel: "At the lab",
    steps: [
      { label: "Dispatched", status: "complete" },
      { label: "Delivered", status: "complete" },
      { label: "Registered", status: "complete" },
      { label: "Mailed", status: "complete" },
      { label: "Lab", status: "current" },
      { label: "Results", status: "upcoming" },
    ],
    nextKitDetail: "Results usually land in 3–5 days",
    daysUntilNextKit: 4,
    heroTitle: "Bailey's kit is in progress",
    heroBody:
      "We'll notify you when results are ready. Until then, Speak can help with last quarter or day-to-day care.",
    askCta: "Open in Speak",
    askHref: "/ask?about=Bailey%27s%20kit%20status",
    lastResultsHeading: "Last results · Q2",
    lastResultsBody: "All markers within Bailey's baseline.",
    lastResultsCta: "Open in Speak",
    lastResultsHref: "/ask?about=Q2%20results",
    daysLabel: "Est. days",
  },
  tests: [
    {
      id: "q3",
      quarter: "Q3 2026",
      dateLabel: "July 15, 2026",
      bluf: "One value changed from Bailey's baseline — kidney concentration. Worth a vet conversation.",
      status: "changed",
      markers: q3MetricCards,
      speakTopic: "Q3 2026 results",
    },
    {
      id: "q2",
      quarter: "Q2 2026",
      dateLabel: "April 12, 2026",
      bluf: "All markers within Bailey's baseline this quarter.",
      status: "normal",
      markers: allClearMarkers("1.045"),
      speakTopic: "Q2 2026 results",
    },
    {
      id: "q1",
      quarter: "Q1 2026",
      dateLabel: "January 18, 2026",
      bluf: "All markers within Bailey's baseline this quarter.",
      status: "normal",
      markers: allClearMarkers("1.048"),
      speakTopic: "Q1 2026 results",
    },
  ],
  trendChart: {
    title: "Kidney concentration",
    subtitle: "The marker Speak is watching",
    referenceRangeLabel: "Reference range: 1.015 — 1.050",
    referenceMin: 1.015,
    referenceMax: 1.05,
    points: [
      { quarter: "Q1", periodLabel: "Q1", value: 1.048 },
      { quarter: "Q2", periodLabel: "Q2", value: 1.045 },
      { quarter: "Q3", periodLabel: "Q3", value: 1.022 },
    ],
    caption:
      "Dropped from Bailey's own baseline. Population range is fine — her personal trend is what matters.",
  },
};

export const dashboard: DashboardContent = {
  screeningLabel: "Quarterly screening",
  banner: `${pet.name}'s Q3 results are ready. One value changed from her baseline.`,
  trendCaption:
    "Specific gravity has dropped 4% from Bailey's baseline. Worth a vet conversation.",
  ctaLabel: "View full Q3 report →",
  ctaHref: "/dashboard",
  trend: usgTrend,
  metrics: [
    {
      label: "Urine Specific Gravity",
      value: "1.022",
      status: "changed",
      statusLabel: "Trending down ↓",
    },
    {
      label: "Urine Protein",
      value: "Negative",
      status: "normal",
      statusLabel: "Normal",
    },
    {
      label: "pH",
      value: "6.5",
      status: "normal",
      statusLabel: "Normal",
    },
  ],
};

export const q3Result: QuarterlyResult = {
  quarter: "Q3 2026",
  collectedDate: "July 12, 2026",
  processedBy: "NBVL",
  deliveredDate: "July 15, 2026",
  markers: [
    {
      id: "urine_specific_gravity",
      label: "Urine Specific Gravity",
      value: "1.022",
      status: "changed",
      statusLabel: "Changed from baseline",
      plainEnglish:
        "Specific gravity measures how concentrated Bailey's urine is. Her value has drifted downward over three quarters — from 1.048 to 1.022. This isn't outside the population range, but it's a meaningful change from Bailey's own normal. Worth discussing with your vet.",
      trend: usgTrend,
    },
    {
      id: "urine_protein",
      label: "Urine Protein",
      value: "Negative",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "No protein detected in Bailey's urine. This is a good sign — protein in urine can indicate early kidney stress. Bailey is clear. This is worth a conversation with your vet if anything changes next quarter.",
    },
    {
      id: "ph",
      label: "pH",
      value: "6.5",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "Bailey's urine pH is in a healthy range. No changes from her prior baseline. This is worth a conversation with your vet if anything changes next quarter.",
    },
    {
      id: "glucose",
      label: "Glucose",
      value: "Negative",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "No glucose in Bailey's urine. This rules out one of the early markers of diabetes. This is worth a conversation with your vet if anything changes next quarter.",
    },
  ],
  flag: {
    heading: "One value changed from Bailey's baseline.",
    body: "Her urine specific gravity has dropped meaningfully over three quarters. This is worth a conversation with your vet — not an emergency, but don't wait until next quarter.",
  },
};

export const complianceFootnote =
  "Speak screens and refers. We never diagnose. This report is for informational purposes — your vet interprets and acts.";

export const resultsPage: ResultsPageContent = {
  contextLabel: "Q3 2026 · Full report",
  title: `${pet.name}'s urinalysis results`,
  meta: "Collected July 12, 2026 · Processed by NBVL · Delivered July 15, 2026",
  markers: [
    {
      id: "kidney_concentration",
      plainLabel: "Kidney concentration",
      plainValue: "Slightly low",
      technicalLabel: "Urine Specific Gravity · 1.022",
      status: "changed",
      statusLabel: "Changed from baseline",
      plainEnglish:
        "This measures how concentrated Bailey's urine is. Her value has drifted downward over three quarters — from 1.048 to 1.022. This isn't outside the population range, but it's a meaningful change from Bailey's own normal. Worth discussing with your vet.",
      sparkline: "down",
    },
    {
      id: "urine_acidity",
      plainLabel: "Urine acidity",
      plainValue: "Healthy",
      technicalLabel: "pH · 6.5",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "Bailey's urine acidity is in a healthy range. No changes from her prior baseline.",
      sparkline: "flat",
    },
    {
      id: "kidney_filter_health",
      plainLabel: "Kidney filter health",
      plainValue: "Healthy",
      technicalLabel: "UPC Ratio · 0.28",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "Bailey's kidney filter health looks steady. This early signal of filter stress is within her expected range.",
      sparkline: "flat",
    },
    {
      id: "blood_sugar",
      plainLabel: "Blood sugar",
      plainValue: "Not detected",
      technicalLabel: "Glucose · Negative",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "No blood sugar was detected in Bailey's urine. This is a reassuring early screening result.",
      sparkline: "flat",
    },
    {
      id: "protein_leakage",
      plainLabel: "Protein leakage",
      plainValue: "Not detected",
      technicalLabel: "Protein · Negative",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "No protein leakage was detected. Protein in urine can signal early kidney stress — Bailey is clear here.",
      sparkline: "flat",
    },
    {
      id: "fat_breakdown",
      plainLabel: "Fat breakdown",
      plainValue: "Not detected",
      technicalLabel: "Ketones · Negative",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "No signs of fat breakdown were detected. Bailey's metabolic markers look stable this quarter.",
      sparkline: "flat",
    },
    {
      id: "liver_stress",
      plainLabel: "Liver stress",
      plainValue: "Not detected",
      technicalLabel: "Bilirubin · Negative",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "No liver stress signal was detected in Bailey's sample this quarter.",
      sparkline: "flat",
    },
    {
      id: "blood_in_urine",
      plainLabel: "Blood in urine",
      plainValue: "Not detected",
      technicalLabel: "Blood / RBC · Negative",
      status: "normal",
      statusLabel: "Normal",
      plainEnglish:
        "No blood was detected in Bailey's urine. That is a good screening result.",
      sparkline: "flat",
    },
  ],
  flag: {
    heading: "One value changed from Bailey's baseline.",
    body: "Her kidney concentration has dropped meaningfully over three quarters. This is worth a conversation with your vet — not an emergency, but don't wait until next quarter.",
    bookCta: "Open in Speak",
    bookHref: "/ask?about=this%20quarter%27s%20results",
  },
  complianceFootnote,
};

export const askPage: AskPageContent = {
  title: "Speak",
  messages: [],
  aboutGreeting:
    "I see you're curious about {topic}. What do you want to know?",
  suggestions: [
    {
      id: "results-mean",
      title: "What do Bailey's results mean?",
      reply:
        "Bailey's Q3 panel is mostly steady against her own baseline. One value — kidney concentration — is lower than her usual pattern. That doesn't name a condition; it means this quarter is worth a calm vet conversation so they can look at the full picture with you.",
    },
    {
      id: "what-changed",
      title: "What changed this quarter?",
      reply:
        "Kidney concentration moved from Bailey's earlier quarters (about 1.048 → 1.045 → 1.022). Everything else on this panel stayed in her usual range. One change from baseline is the story this quarter — worth a vet conversation.",
    },
    {
      id: "what-next",
      title: "What should I do next?",
      reply:
        "Keep Bailey's usual routine, note anything new you notice at home, and book a visit with your own vet to review the flagged marker. When you're ready, open Care → Share with vet for a short packet you control — Speak explains the change; your vet decides what it means for Bailey.",
    },
    {
      id: "vet-bring",
      title: "What should I bring to the vet?",
      reply:
        "Bring Bailey's Q3 summary and the kidney concentration trend. Mention any day-to-day notes — appetite, water, energy, bathroom habits. On Care, you can preview a share-with-vet packet and send or print it yourself — Speak never books or sends without you.",
    },
  ],
  defaultReply:
    "I can explain Bailey's Speak results in plain English — what's steady, what changed from her baseline, and what a sensible next step looks like. I won't diagnose. For symptoms or care changes, your vet is the right call. Try a suggested question, or ask about this quarter's results.",
  pastChatsHeading: "Previous chats",
  pastChats: [
    {
      id: "q3-kidney",
      title: "Kidney trend check",
      preview: "Kidney trend check",
      quarter: "Q3 2026",
      messages: [
        {
          role: "user",
          body: "What does Bailey's trend show?",
        },
        {
          role: "speak",
          body: "Across Q1–Q3, Bailey's kidney concentration eased downward versus her own starting point. Trends help you see change early; they aren't a diagnosis. Your vet can say whether this pattern needs a closer look.",
        },
        {
          role: "user",
          body: "What should I bring to the vet?",
        },
        {
          role: "speak",
          body: "Bring Bailey's Q3 summary and the kidney concentration trend. Mention any day-to-day notes — appetite, water, energy, bathroom habits. On Care, you can preview a share-with-vet packet and send or print it yourself — Speak never books or sends without you.",
        },
      ],
    },
    {
      id: "q2-all-clear",
      title: "All-clear check-in",
      preview: "All-clear check-in",
      quarter: "Q2 2026",
      messages: [
        {
          role: "user",
          body: "How do the other markers look?",
        },
        {
          role: "speak",
          body: "In Q2, Bailey's full panel stayed consistent with her baseline — no Speak flags. That quarter was an all-clear check-in against her own history.",
        },
      ],
    },
    {
      id: "q3-vet-prep",
      title: "Vet visit prep",
      preview: "Vet visit prep",
      quarter: "Q3 2026",
      messages: [
        {
          role: "user",
          body: "What should I bring to the vet?",
        },
        {
          role: "speak",
          body: "Bring Bailey's Q3 summary and the kidney concentration trend. Mention any day-to-day notes — appetite, water, energy, bathroom habits. On Care, you can preview a share-with-vet packet and send or print it yourself — Speak never books or sends without you.",
        },
      ],
    },
    {
      id: "q1-baseline",
      title: "Baseline explained",
      preview: "Baseline explained",
      quarter: "Q1 2026",
      messages: [
        {
          role: "user",
          body: "What do Bailey's results mean?",
        },
        {
          role: "speak",
          body: "Q1 set Bailey's personal baseline — the reference Speak uses later. Nothing here is a diagnosis; it's a starting point for her own history. Worth a vet conversation if anything about her day-to-day care feels off.",
        },
      ],
    },
    {
      id: "q2-water",
      title: "Water & appetite",
      preview: "Water & appetite",
      quarter: "Q2 2026",
      messages: [
        {
          role: "user",
          body: "Should I change Bailey's water or food?",
        },
        {
          role: "speak",
          body: "Speak won't tell you to change diet or treatment. Keep her usual routine unless your vet says otherwise. Note drinking, appetite, and energy so you have concrete details for a visit — worth a vet conversation if something new stands out.",
        },
      ],
    },
    {
      id: "q3-next-steps",
      title: "Sensible next steps",
      preview: "Sensible next steps",
      quarter: "Q3 2026",
      messages: [
        {
          role: "user",
          body: "What should I do next?",
        },
        {
          role: "speak",
          body: "Keep Bailey's usual routine, note anything new you notice at home, and book a visit with your own vet to review the flagged marker. When you're ready, open Care → Share with vet for a short packet you control — Speak explains the change; your vet decides what it means for Bailey.",
        },
      ],
    },
  ],
  inputPlaceholder: "Message",
};

export const baileyPage: BaileyPageContent = {
  title: pet.name,
  subtitle: pet.breed,
  historyHeading: "Health history",
  history: [
    {
      quarter: "Q1 2026",
      summary: "All markers within Bailey's baseline.",
      status: "normal",
      statusLabel: "Normal",
    },
    {
      quarter: "Q2 2026",
      summary: "All markers within Bailey's baseline.",
      status: "normal",
      statusLabel: "Normal",
    },
    {
      quarter: "Q3 2026",
      summary: "One value changed from Bailey's baseline — kidney concentration.",
      status: "changed",
      statusLabel: "Changed from baseline",
    },
  ],
  nextKitHeading: "Next kit",
  nextKitBody: "Next kit ships October 1, 2026",
  membershipHeading: "Membership",
  membershipBody: "Active · $30/month",
  weightLabel: "62 lbs",
  sexLabel: "Female",
  ageLabel: `${pet.ageYears} years`,
  breedLabel: pet.breed,
  vetClinicLabel: "Vet on file",
  vetClinicDetail: "Crozet Animal Hospital",
};

export const youPage: YouPageContent = {
  title: "Profile",
  petTabLabel: "Pet",
  ownerTabLabel: "Owner",
  pet: baileyPage,
  owner: {
    firstName: "Maya",
    lastName: "Chen",
    email: "maya@email.com",
    phone: "(434) 555-0142",
    membershipLabel: "Membership",
    membershipDetail: "Active · $30/month",
    preferredVetLabel: "Preferred clinic",
    preferredVetDetail: "Crozet Animal Hospital",
    insuranceLabel: "Pet insurance",
    insuranceDetail: "Trupanion · Policy on file",
    insuranceHint: "Managed on the Vet tab.",
  },
  notificationsHeading: "Notifications",
  notifications: [
    {
      id: "results-ready",
      label: "Results ready",
      detail: "When Bailey's panel is in Speak",
      enabled: true,
    },
    {
      id: "kit-dispatched",
      label: "Kit dispatched",
      detail: "When the next kit ships",
      enabled: true,
    },
  ],
  notificationsFootnote: "Only these two moments matter for V1.",
};

export const vetPage: VetPageContent = {
  title: "Care",
  subtitle: "Show up prepared — your clinic still owns care.",
  clinicHeading: "Clinic on file",
  vetName: "Dr. Sarah Chen",
  clinic: "Crozet Animal Hospital",
  phone: "(434) 555-0190",
  address: "1200 Crozet Ave, Crozet, VA 22932",
  insuranceHeading: "Pet insurance",
  insuranceDetail: "Trupanion · Policy on file",
  insuranceHint: "Optional — for your records.",
  visitsHeading: "Visits",
  visits: [
    {
      id: "v1",
      dateLabel: "July 22, 2026",
      clinic: "Crozet Animal Hospital",
      reason: "Review Q3 kidney concentration change",
      statusLabel: "Upcoming",
    },
    {
      id: "v0",
      dateLabel: "March 3, 2026",
      clinic: "Crozet Animal Hospital",
      reason: "Annual wellness exam",
      statusLabel: "Completed",
    },
  ],
  scheduleCta: "Book with your clinic",
  scheduleHint:
    "You call them — Speak doesn't auto-book.",
  historyHeading: "Screening history",
  history: baileyPage.history,
  sharePacket: {
    heading: "Share with vet",
    subtitle: "A short packet you control — preview, then send or print yourself.",
    bullets: [
      "Bailey · Golden Retriever · 4 years · 62 lbs",
      "Q3 2026: one marker changed from baseline — kidney concentration (1.022 vs earlier quarters ~1.048 → 1.045).",
      "Other panel markers steady vs Bailey's baseline.",
      "Owner notes to add at the visit: appetite, water, energy, bathroom habits.",
    ],
    shareCta: "Copy packet summary",
    copiedLabel: "Copied — paste into email or notes",
    footnote:
      "Speak screens and refers. This packet is not a diagnosis. Your vet decides next steps.",
  },
};

export const vetAppointment: VetAppointment = {
  vetName: "Dr. Sarah Chen",
  clinic: "Crozet Animal Hospital",
  dateLabel: "Tuesday, July 22 · 2:00 PM",
  address: "1200 Crozet Ave, Crozet, VA 22932",
  estimatedCost: "$120 – $180 (routine consultation)",
  recordsStatusLabel: "Share packet ready",
  recordsNote:
    "Preview and copy Bailey's Speak summary from Vet when you're ready — Speak never books or sends without you.",
};

export const handoffNextSteps = [
  "Open Vet → Share with vet for a packet you control.",
  "Book with your own clinic when you're ready.",
  "Your next Speak kit ships October 1.",
] as const;

export const handoffPage: HandoffPageContent = {
  backLabel: "← Back to Home",
  backHref: "/dashboard",
  title: "Prep for Bailey's vet visit",
  subtitle: "You decide when to share — Speak doesn't book for you.",
  nextHeading: "What happens next",
  nextSteps: [...handoffNextSteps],
  calendarCta: "Add reminder",
  viewSentLabel: "View Q3 summary →",
  viewSentHref: "/dashboard",
};

export const schedulingPage: PlaceholderPageContent = {
  title: "Scheduling",
  subtitle: "Future scope — not V1",
  body: "Vet booking / clinic partnerships are deferred past V1. Speak screens and refers; owners book with their own vet. No auto-booking without user choice or partners.",
};

export const labMessagesPage: PlaceholderPageContent = {
  title: "Lab messages",
  subtitle: "Updates from sample to result",
  body: "Lab status messages will live here in V1. For the demo, Bailey's Q3 results are already on the Dashboard and Results screens.",
};

export const settingsPage: PlaceholderPageContent = {
  title: "Settings",
  subtitle: "Account preferences",
  body: "Notification preferences live under You → Owner for the demo. Full settings come later.",
};

/** Prototype about page — founders + roadmap (Notion-plain). */
export const infoPage: InfoPageContent = {
  title: "Info",
  intro:
    "Speak is a prototype for Demo Day. Built by Kean Harrison and McCoy Ferguson — at-home screening that helps dog owners see change early and show up prepared for their vet.",
  teamHeading: "Team",
  contacts: [
    {
      name: "Kean Harrison",
      role: "Co-founder",
      email: "kean@speak.health",
      linkedinUrl: "https://www.linkedin.com/in/keanharrison",
      linkedinLabel: "LinkedIn",
    },
    {
      name: "McCoy Ferguson",
      role: "Co-founder",
      email: "mccoy@speak.health",
      linkedinUrl: "https://www.linkedin.com/in/mccoyferguson",
      linkedinLabel: "LinkedIn",
    },
  ],
  roadmapHeading: "Roadmap",
  roadmap: [
    {
      phase: "Now",
      title: "Demo Day prototype",
      detail:
        "Hardcoded Home · Ask · You story — flagged baseline, grounded Ask, share-with-vet packet. No live lab or booking.",
    },
    {
      phase: "Next",
      title: "Beta + real pipeline",
      detail:
        "Partner lab, kit logistics, results-ready and kit-dispatched notifications, beta owner interviews.",
    },
    {
      phase: "Later",
      title: "Clinic + membership depth",
      detail:
        "Owner-initiated scheduling with real partners, richer vet prep, insurance-aware flows, multi-pet households.",
    },
  ],
  footnote:
    "Speak screens and refers. We never diagnose. This page is for Demo Day visitors — not part of the owner product story.",
};

/** Design lab — glass morphism reference (not part of Demo Night story). */
export const glassLabPage: GlassLabPageContent = {
  title: "Glass lab",
  subtitle: "Design reference — dark orbs + real glass cards.",
  stats: [
    {
      id: "usg",
      label: "Kidney concentration",
      value: "1.022",
      detail: "Changed from Bailey's baseline",
    },
    {
      id: "ph",
      label: "Urine acidity",
      value: "6.5",
      detail: "Steady · healthy range",
    },
    {
      id: "kits",
      label: "Kits completed",
      value: "3",
      detail: "Q1 → Q3 2026",
    },
    {
      id: "next",
      label: "Days to next kit",
      value: "67",
      detail: "Ships October 1",
    },
  ],
  note: "Glass only works over blurred color. Flat cream = cloudy card, not glass.",
};

export const kitPage: PlaceholderPageContent = {
  title: "Kit",
  subtitle: "Q3 2026 · Bailey",
  body: "Results ready. Track kit status here in V1 — dispatched through lab received. For Demo Day, open Home to see Bailey's Q3 story.",
};

export const profilePage: PlaceholderPageContent = {
  title: "Profile",
  subtitle: "Maya · Speak member",
  body: "Owner profile and household details will live here. For the demo, Maya's membership status is shown in the sidebar.",
};

export const deliveryPage: DeliveryPageContent = {
  title: "Package delivery",
  subtitle: "Q3 kit and sample return · Bailey",
  steps: [
    {
      label: "Kit delivered",
      detail: "Q3 screening kit arrived June 28, 2026",
      status: "complete",
    },
    {
      label: "Sample received at lab",
      detail: "NBVL received Bailey's sample July 13, 2026",
      status: "complete",
    },
    {
      label: "Results delivered",
      detail: "Q3 report ready in your dashboard · July 15, 2026",
      status: "complete",
    },
    {
      label: "Next kit ships",
      detail: "Q4 kit scheduled · October 1, 2026",
      status: "upcoming",
    },
  ],
};

export const landingCards: LandingCard[] = [
  {
    background: "#3D2010",
    chip: {
      status: "changed",
      title: "Specific gravity trending down",
      subtitle: "Worth a vet conversation",
    },
    label: "Early detection",
    description: "Catch changes before symptoms show.",
  },
  {
    background: "#5C3D28",
    chip: {
      status: "normal",
      title: "Q3 results processed",
      subtitle: "All values within Bailey's baseline",
    },
    label: "Plain English results",
    description: "No lab jargon. Just what it means.",
  },
  {
    background: "#8B5E3C",
    chip: {
      status: "changed",
      title: "Vet visit ready",
      subtitle: "Share packet · you decide when",
    },
    label: "Show up prepared",
    description: "A short packet you bring to your clinic.",
  },
];

export const landingCopy = {
  heroLine1: "Your dog can't tell you",
  heroLine2Before: "what's wrong.",
  heroLine2Accent: " Speak can.",
  subhead:
    "Quarterly at-home screening that catches change early — and helps you show up prepared for your vet.",
  tryNowCta: "Try Now",
  tryNowHref: "/dashboard",
  footerTagline: "Your dog's health record",
} as const;

/** Contacts / socials tab — founders + Speak channels (links TBD). */
export const contactsPage = {
  title: "Contacts",
  intro:
    "Questions about Speak, the demo, or working together? Reach out to McCoy or Kean — we'd love to hear from you.",
  foundersHeading: "Founders",
  people: [
    {
      name: "McCoy Ferguson",
      role: "Co-founder",
      email: "wesmccoy23@gmail.com",
      linkedin: "https://www.linkedin.com/in/mccoyferguson/",
    },
    {
      name: "Kean Harrison",
      role: "Co-founder",
      email: "kean.thurman.harrison@gmail.com",
      linkedin: "https://www.linkedin.com/in/keanh/",
    },
  ],
  socialHeading: "Follow Speak",
  socials: [
    { id: "instagram" as const, label: "Instagram", href: "" },
    { id: "linkedin" as const, label: "LinkedIn", href: "" },
    { id: "x" as const, label: "X", href: "" },
  ],
} as const;
