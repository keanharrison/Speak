import { DeliveryView } from "@/features/delivery/DeliveryView";
import { deliveryPage } from "@/lib/hardcoded-data";

export default function DeliveryPage() {
  return <DeliveryView data={deliveryPage} />;
}
