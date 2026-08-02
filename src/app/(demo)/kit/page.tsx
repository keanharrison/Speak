import { redirect } from "next/navigation";

/** Kit merged into Home — keep route so old links don't 404. */
export default function KitRedirectPage() {
  redirect("/dashboard");
}
