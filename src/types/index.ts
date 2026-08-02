/** Shared TypeScript types for Speak demo data. */

export type MarkerStatus = "normal" | "changed";

export type MarkerId =
  | "urine_specific_gravity"
  | "urine_protein"
  | "ph"
  | "glucose";

export interface Pet {
  name: string;
  breed: string;
  ageYears: number;
  sex: "female" | "male";
}

export interface TrendPoint {
  quarter: string;
  value: number;
}

export interface Marker {
  id: MarkerId;
  label: string;
  value: string;
  status: MarkerStatus;
  /** Short status label shown on chips — never "abnormal". */
  statusLabel: string;
  /** Plain-English explanation. Must stay compliance-safe. */
  plainEnglish: string;
  /** Optional longitudinal values for sparklines / charts. */
  trend?: TrendPoint[];
}

export interface QuarterlyResult {
  quarter: string;
  collectedDate: string;
  processedBy: string;
  deliveredDate: string;
  markers: Marker[];
  flag: {
    heading: string;
    body: string;
  } | null;
}

export interface VetAppointment {
  vetName: string;
  clinic: string;
  dateLabel: string;
  address: string;
  estimatedCost: string;
  /** Status chip — owner-controlled, never “records sent” without consent */
  recordsStatusLabel: string;
  recordsNote: string;
}

export interface LandingCard {
  background: string;
  chip: {
    status: MarkerStatus;
    title: string;
    subtitle: string;
  };
  label: string;
  description: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  status: MarkerStatus;
  statusLabel: string;
}

export interface DashboardMetricCard {
  id: string;
  plainLabel: string;
  plainValue: string;
  technicalLabel: string;
  referenceRange: string;
  explanation: string;
  status: MarkerStatus;
  statusLabel: string;
  sparkline: "down" | "flat";
}

export interface DashboardTrendPoint {
  quarter: string;
  periodLabel: string;
  value: number;
}

export interface DashboardKitStep {
  label: string;
  status: "complete" | "current" | "upcoming";
}

export interface DashboardRecentChat {
  id: string;
  title: string;
  preview: string;
  href: string;
}

export interface DashboardPageContent {
  /** Greeting context under first name — pet, not quarter (avoids Q3 twice) */
  greetingSubtitle: string;
  /** One-line product story under the greeting */
  storyLine: string;
  testsHeading: string;
  /** Latest report summary — first block on Home */
  latestSummary: {
    eyebrow: string;
    detailsLabel: string;
  };
  /** Resume Speak threads — second block on Home */
  recentChatsHeading: string;
  recentChatsCtaLabel: string;
  recentChats: DashboardRecentChat[];
  kitStatus: {
    heading: string;
    statusLabel: string;
    steps: DashboardKitStep[];
    nextKitDetail: string;
    daysUntilNextKit: number;
  };
  kitInFlightStatus: {
    heading: string;
    statusLabel: string;
    steps: DashboardKitStep[];
    nextKitDetail: string;
    daysUntilNextKit: number;
    heroTitle: string;
    heroBody: string;
    askCta: string;
    askHref: string;
    lastResultsHeading: string;
    lastResultsBody: string;
    lastResultsCta: string;
    lastResultsHref: string;
    daysLabel: string;
  };
  /** Past + current screening tests — Home list, newest first */
  tests: ScreeningTestSummary[];
  trendChart: {
    title: string;
    subtitle: string;
    referenceRangeLabel: string;
    referenceMin: number;
    referenceMax: number;
    points: DashboardTrendPoint[];
    caption: string;
  };
}

export interface ScreeningTestSummary {
  id: string;
  quarter: string;
  dateLabel: string;
  /** One-line BLUF for the list + detail hero */
  bluf: string;
  status: MarkerStatus;
  markers: DashboardMetricCard[];
  speakTopic: string;
}

export interface SidebarNavItem {
  href: string;
  label: string;
  icon:
    | "home"
    | "fileText"
    | "messageCircle"
    | "calendar"
    | "flask"
    | "package"
    | "pawPrint"
    | "settings"
    | "user"
    | "more"
    | "vet"
    | "contacts";
}

export interface DashboardContent {
  screeningLabel: string;
  banner: string;
  trendCaption: string;
  ctaLabel: string;
  ctaHref: string;
  metrics: DashboardMetric[];
  trend: TrendPoint[];
}

export interface ResultsMarker {
  id: string;
  plainLabel: string;
  plainValue: string;
  technicalLabel: string;
  status: MarkerStatus;
  statusLabel: string;
  plainEnglish: string;
  sparkline?: "down" | "flat";
}

export interface ResultsPageContent {
  contextLabel: string;
  title: string;
  meta: string;
  markers: ResultsMarker[];
  flag: {
    heading: string;
    body: string;
    bookCta: string;
    bookHref: string;
  };
  complianceFootnote: string;
}

export interface AskMessage {
  role: "user" | "speak";
  body: string;
}

export interface AskSuggestion {
  id: string;
  title: string;
  /** Hardcoded Speak reply when this suggestion is sent */
  reply: string;
}

export interface AskPastChat {
  id: string;
  title: string;
  preview: string;
  quarter: string;
  /** Hardcoded thread loaded when this past chat is opened */
  messages: AskMessage[];
}

export interface AskPageContent {
  title: string;
  messages: AskMessage[];
  suggestions: AskSuggestion[];
  /** Fallback Speak reply for free-typed questions in the demo */
  defaultReply: string;
  pastChats: AskPastChat[];
  pastChatsHeading: string;
  inputPlaceholder: string;
  /** Template — `{topic}` replaced when opened from a Home card */
  aboutGreeting: string;
}

export interface BaileyHistoryItem {
  quarter: string;
  summary: string;
  status: MarkerStatus;
  statusLabel: string;
}

export interface BaileyPageContent {
  title: string;
  subtitle: string;
  historyHeading: string;
  history: BaileyHistoryItem[];
  nextKitHeading: string;
  nextKitBody: string;
  membershipHeading: string;
  membershipBody: string;
  /** Extra pet fields for You → Pet tab */
  weightLabel: string;
  sexLabel: string;
  ageLabel: string;
  breedLabel: string;
  vetClinicLabel: string;
  vetClinicDetail: string;
}

export interface OwnerProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  membershipLabel: string;
  membershipDetail: string;
  preferredVetLabel: string;
  preferredVetDetail: string;
  insuranceLabel: string;
  insuranceDetail: string;
  insuranceHint: string;
}

export interface NotificationPref {
  id: string;
  label: string;
  detail: string;
  enabled: boolean;
}

export interface VetSharePacket {
  heading: string;
  subtitle: string;
  bullets: string[];
  shareCta: string;
  copiedLabel: string;
  footnote: string;
}

export interface YouPageContent {
  title: string;
  petTabLabel: string;
  ownerTabLabel: string;
  pet: BaileyPageContent;
  owner: OwnerProfile;
  notificationsHeading: string;
  notifications: NotificationPref[];
  notificationsFootnote: string;
}

export interface VetVisit {
  id: string;
  dateLabel: string;
  clinic: string;
  reason: string;
  statusLabel: string;
}

export interface VetPageContent {
  title: string;
  subtitle: string;
  clinicHeading: string;
  vetName: string;
  clinic: string;
  phone: string;
  address: string;
  insuranceHeading: string;
  insuranceDetail: string;
  insuranceHint: string;
  visitsHeading: string;
  visits: VetVisit[];
  scheduleCta: string;
  scheduleHint: string;
  historyHeading: string;
  history: BaileyHistoryItem[];
  sharePacket: VetSharePacket;
}

export interface HandoffPageContent {
  backLabel: string;
  backHref: string;
  title: string;
  subtitle: string;
  nextHeading: string;
  nextSteps: string[];
  calendarCta: string;
  viewSentLabel: string;
  viewSentHref: string;
}

export interface PlaceholderPageContent {
  title: string;
  subtitle: string;
  body: string;
}

export interface InfoContact {
  name: string;
  role: string;
  email: string;
  linkedinUrl: string;
  linkedinLabel: string;
}

export interface InfoRoadmapItem {
  phase: string;
  title: string;
  detail: string;
}

export interface InfoPageContent {
  title: string;
  intro: string;
  teamHeading: string;
  contacts: InfoContact[];
  roadmapHeading: string;
  roadmap: InfoRoadmapItem[];
  footnote: string;
}

export interface GlassStatCard {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface GlassLabPageContent {
  title: string;
  subtitle: string;
  stats: GlassStatCard[];
  note: string;
}

export interface DeliveryStep {
  label: string;
  detail: string;
  status: "complete" | "current" | "upcoming";
}

export interface DeliveryPageContent {
  title: string;
  subtitle: string;
  steps: DeliveryStep[];
}
