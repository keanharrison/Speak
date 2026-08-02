import { PhoneFrame } from "@/components/layout/PhoneFrame";

/**
 * Pre-app entry flow: splash → welcome → explore name.
 * No bottom nav. Same phone frame as the demo app for laptop demos.
 */
export default function EntryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PhoneFrame>
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
    </PhoneFrame>
  );
}
