import { YouView } from "@/features/profile/YouView";
import { youPage } from "@/lib/hardcoded-data";

export default function ProfilePage() {
  return <YouView data={youPage} />;
}
