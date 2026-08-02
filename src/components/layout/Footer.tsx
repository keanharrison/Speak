import { landingCopy } from "@/lib/hardcoded-data";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <span className="text-[16px] font-medium tracking-tight text-canvas">
          speak
        </span>
        <span className="text-[14px] text-accent">{landingCopy.footerTagline}</span>
      </div>
    </footer>
  );
}
