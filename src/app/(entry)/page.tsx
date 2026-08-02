import { redirect } from "next/navigation";

/** Entry opens on windowboxed cinematic intro. */
export default function EntryPage() {
  redirect("/intro");
}
