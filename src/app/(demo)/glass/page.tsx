import { GlassLabView } from "@/features/glass/GlassLabView";
import { glassLabPage } from "@/lib/hardcoded-data";

export default function GlassPage() {
  return <GlassLabView data={glassLabPage} />;
}
