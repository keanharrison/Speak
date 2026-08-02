import { VetView } from "@/features/vet/VetView";
import { vetPage } from "@/lib/hardcoded-data";

export default function VetPage() {
  return <VetView data={vetPage} />;
}
