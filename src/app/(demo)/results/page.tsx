import { redirect } from "next/navigation";

/** Results live on /dashboard — one screen, BLUF up top. */
export default function ResultsPage() {
  redirect("/dashboard");
}
