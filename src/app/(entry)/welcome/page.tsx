import { redirect } from "next/navigation";

/** Welcome splash removed — send old links to the cinematic intro. */
export default function WelcomePage() {
  redirect("/intro");
}
