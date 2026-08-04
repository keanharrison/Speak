"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contactsPage } from "@/lib/hardcoded-data";

/** Brand app tile — icon only */
const appTile =
  "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] shadow-[0_2px_6px_rgba(0,0,0,0.16)]";

function LinkedInGlyph({ className }: { className?: string }) {
  /** White “in” only — tile supplies the blue rounded square */
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.5 9.5H3.7V20h2.8V9.5zM5.1 4.2a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3zM20.3 20h-2.8v-5.6c0-1.35-.5-2.25-1.75-2.25-1.05 0-1.65.7-1.9 1.4-.1.25-.1.55-.1.9V20h-2.8s.05-9.3 0-10.5h2.8v1.5c.35-.55 1.05-1.75 2.75-1.75 2.05 0 3.6 1.35 3.6 4.25V20z" />
    </svg>
  );
}

/** Official-style IG camera mark */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function AppIconLink({
  href,
  label,
  style,
  children,
}: {
  href: string;
  label: string;
  style: React.CSSProperties;
  children: React.ReactNode;
}) {
  const className = `${appTile} transition hover:opacity-90 active:scale-95`;
  if (!href) {
    return (
      <button
        type="button"
        aria-label={`${label} (coming soon)`}
        className={className}
        style={style}
      >
        {children}
      </button>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}

function CopyableEmail({ email }: { email: string }) {
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const longPressRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const clearLongPress = useCallback(() => {
    if (longPressRef.current != null) {
      window.clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  }, []);

  const openMenu = useCallback((x: number, y: number) => {
    setCopied(false);
    setMenu({ x, y });
  }, []);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [menu]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setMenu(null), 700);
    } catch {
      setMenu(null);
    }
  }

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <a
        href={`mailto:${email}`}
        className="block min-h-[44px] w-full break-all py-1 text-[14px] font-medium leading-snug text-[#0A0A0A] underline-offset-2 hover:underline"
        onContextMenu={(e) => {
          e.preventDefault();
          openMenu(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          clearLongPress();
          longPressRef.current = window.setTimeout(() => {
            openMenu(t.clientX, t.clientY);
          }, 480);
        }}
        onTouchEnd={clearLongPress}
        onTouchMove={clearLongPress}
        onTouchCancel={clearLongPress}
      >
        {email}
      </a>
      {menu ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            aria-label="Dismiss"
            onClick={() => setMenu(null)}
          />
          <div
            className="fixed z-50 overflow-hidden rounded-[12px] bg-[#2C2C2E]/92 text-white shadow-lg backdrop-blur-xl"
            style={{
              left: Math.min(menu.x, window.innerWidth - 120),
              top: Math.max(8, menu.y - 48),
            }}
          >
            <button
              type="button"
              onClick={copyEmail}
              className="min-h-[44px] min-w-[96px] px-4 text-left text-[15px] font-medium"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

/**
 * Founders + Speak socials — contact page for the demo.
 */
export function ContactsView() {
  const data = contactsPage;

  return (
    <main
      className="relative z-10 mx-auto w-full flex-1 overflow-x-hidden px-5 pb-6"
      style={{
        paddingTop:
          "max(2.75rem, calc(var(--speak-page-safe-top) + 2rem))",
      }}
    >
      <h1 className="page-title mt-1">{data.title}</h1>

      <section className="mt-6" aria-label="Founders">
        <h2 className="section-title">{data.foundersHeading}</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {data.people.map((person) => (
            <li key={person.email} className="glass-panel px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold text-[#0A0A0A]">
                    {person.name}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[#6b6b6b]">
                    {person.role}
                  </p>
                </div>
                <AppIconLink
                  href={person.linkedin}
                  label={`${person.name} on LinkedIn`}
                  style={{ backgroundColor: "#0A66C2" }}
                >
                  <LinkedInGlyph className="h-6 w-6 text-white" />
                </AppIconLink>
              </div>
              <div className="mt-2 min-w-0">
                <CopyableEmail email={person.email} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8" aria-label="Speak on social">
        <h2 className="section-title">{data.socialHeading}</h2>
        <div className="mt-4 flex items-center gap-3.5">
          {data.socials.map((social) => {
            if (social.id === "instagram") {
              return (
                <AppIconLink
                  key={social.id}
                  href={social.href}
                  label={social.label}
                  style={{
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                >
                  <InstagramGlyph className="h-6 w-6 text-white" />
                </AppIconLink>
              );
            }
            if (social.id === "linkedin") {
              return (
                <AppIconLink
                  key={social.id}
                  href={social.href}
                  label={social.label}
                  style={{ backgroundColor: "#0A66C2" }}
                >
                  <LinkedInGlyph className="h-6 w-6 text-white" />
                </AppIconLink>
              );
            }
            return (
              <AppIconLink
                key={social.id}
                href={social.href}
                label={social.label}
                style={{ backgroundColor: "#000000" }}
              >
                <XGlyph className="h-5 w-5 text-white" />
              </AppIconLink>
            );
          })}
        </div>
      </section>
    </main>
  );
}
