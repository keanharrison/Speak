import { InfoView } from "@/features/info/InfoView";
import { infoPage } from "@/lib/hardcoded-data";

export default function InfoPage() {
  return <InfoView data={infoPage} />;
}
