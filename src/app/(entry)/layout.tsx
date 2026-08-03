import { PhoneFrame } from "@/components/layout/PhoneFrame";

/**
 * Pre-app entry flow: intro → name.
 * Full-bleed phone stage (same edge-to-edge canvas as the demo app).
 */
export default function EntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PhoneFrame>
      <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden">
        {children}
      </div>
    </PhoneFrame>
  );
}
