import { redirect } from "next/navigation";

/**
 * Vet booking / handoff confirmation is FUTURE SCOPE — not V1.
 * No clinic partnerships yet; Speak must not auto-book without the owner.
 * Keep route so old links don't 404; send people Home.
 */
export default function HandoffRedirectPage() {
  redirect("/dashboard");
}
