import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";
import { landingCopy, pet } from "@/lib/hardcoded-data";

type NavbarProps = {
  variant?: "marketing" | "app";
};

function LogoMark() {
  return (
    <span className="relative inline-flex h-7 w-7 items-center justify-center" aria-hidden>
      <span className="absolute inset-0 rounded-full border-[1.5px] border-ink" />
      <span className="absolute inset-[6px] rounded-full border-[1.5px] border-ink" />
    </span>
  );
}

export function Navbar({ variant = "marketing" }: NavbarProps) {
  if (variant === "app") {
    return (
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-[18px] font-medium tracking-tight text-ink">
          speak
        </Link>
        <div className="flex items-center gap-2 text-[14px] text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[12px] text-white" aria-hidden>
            ◠
          </span>
          <span className="font-medium">{pet.name}</span>
        </div>
      </header>
    );
  }

  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-2.5">
        <LogoMark />
        <span className="sr-only">speak</span>
      </Link>
      <nav className="hidden items-center gap-8 text-[14px] text-ink md:flex">
        <a href="#how-it-works" className="hover:opacity-70">
          How it works
        </a>
        <a href="#manifesto" className="hover:opacity-70">
          Manifesto
        </a>
        <a href="#faq" className="hover:opacity-70">
          FAQ
        </a>
      </nav>
      <PillButton href={landingCopy.tryNowHref}>{landingCopy.tryNowCta}</PillButton>
    </header>
  );
}
