/** Client-side account keys for the Demo Day “real account” (local). */
export const ACCOUNT_KEYS = {
  firstName: "speak.account.firstName",
  lastName: "speak.account.lastName",
  email: "speak.account.email",
  phone: "speak.account.phone",
  createdAt: "speak.account.createdAt",
} as const;

export type SpeakAccount = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
};

export function saveAccount(account: Omit<SpeakAccount, "createdAt">) {
  const createdAt = new Date().toISOString();
  window.localStorage.setItem(ACCOUNT_KEYS.firstName, account.firstName);
  window.localStorage.setItem(ACCOUNT_KEYS.lastName, account.lastName);
  window.localStorage.setItem(ACCOUNT_KEYS.email, account.email);
  window.localStorage.setItem(ACCOUNT_KEYS.phone, account.phone);
  window.localStorage.setItem(ACCOUNT_KEYS.createdAt, createdAt);
  window.localStorage.setItem("speak.viewerFirstName", account.firstName);
  return { ...account, createdAt };
}

/** Explore-path name — same greeting persistence as a full account. */
export function saveViewerName(firstName: string) {
  window.localStorage.setItem(ACCOUNT_KEYS.firstName, firstName);
  window.localStorage.setItem("speak.viewerFirstName", firstName);
}

export function clearViewerName() {
  window.localStorage.removeItem("speak.viewerFirstName");
  // Explore-only: no email means no full beta account — clear first name too
  if (!window.localStorage.getItem(ACCOUNT_KEYS.email)) {
    window.localStorage.removeItem(ACCOUNT_KEYS.firstName);
  }
}

export function getAccountFirstName(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("speak.viewerFirstName") ||
    window.localStorage.getItem(ACCOUNT_KEYS.firstName)
  );
}

export function getAccount(): SpeakAccount | null {
  if (typeof window === "undefined") return null;
  const firstName = window.localStorage.getItem(ACCOUNT_KEYS.firstName);
  if (!firstName) return null;
  return {
    firstName,
    lastName: window.localStorage.getItem(ACCOUNT_KEYS.lastName) ?? "",
    email: window.localStorage.getItem(ACCOUNT_KEYS.email) ?? "",
    phone: window.localStorage.getItem(ACCOUNT_KEYS.phone) ?? "",
    createdAt: window.localStorage.getItem(ACCOUNT_KEYS.createdAt) ?? "",
  };
}
