/**
 * Shared form chrome — matches WelcomeScreen control sizing/type.
 * Page content centered as one cluster; field text LTR.
 */
export const formUi = {
  page: "flex h-full flex-col items-center justify-center bg-canvas px-6 py-10",
  title: "text-center text-[28px] font-black tracking-tight text-ink",
  subtitle: "mt-2 text-center text-[15px] font-medium text-muted",
  fieldLabel: "mb-1.5 block text-left text-[13px] font-semibold text-ink",
  field:
    "h-11 w-full rounded-full border border-ink/15 bg-surface px-5 text-left text-[13px] font-light text-muted outline-none transition focus:border-ink focus:text-ink focus:font-normal",
  primaryButton:
    "inline-flex h-11 w-full items-center justify-center rounded-full bg-ink px-6 text-[13px] font-semibold text-white transition-opacity disabled:opacity-60",
  googleButton:
    "inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 bg-surface px-6 text-[13px] font-semibold text-ink transition-opacity disabled:opacity-60",
  mutedLink: "text-[13px] font-medium text-muted",
  error: "text-center text-[13px] font-medium text-accent",
  divider: "shrink-0 px-3 text-[12px] font-medium uppercase tracking-wide text-muted",
} as const;
