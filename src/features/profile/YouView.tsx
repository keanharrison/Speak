"use client";

import { useEffect, useMemo, useState } from "react";
import { BaileyAvatar } from "@/components/ui/BaileyAvatar";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAccountFirstName } from "@/lib/account";
import type { YouPageContent } from "@/types";

type YouViewProps = {
  data: YouPageContent;
};

type Tab = "pet" | "owner";

/** Clean iOS Settings switch — lime on / grey off, no clipped “tail” */
function AppleSwitch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="relative isolate h-[31px] w-[51px] shrink-0 overflow-visible rounded-full border-0 p-0 transition-colors duration-200 ease-out"
      style={{
        backgroundColor: checked ? "#34C759" : "#E9E9EB",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-[2px] top-[2px] block h-[27px] w-[27px] rounded-full bg-white transition-transform duration-200 ease-out"
        style={{
          transform: checked ? "translateX(20px)" : "translateX(0)",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.06)",
        }}
      />
    </button>
  );
}

/**
 * You tab — Pet | Owner. Name/email come from the onboarding first name.
 */
export function YouView({ data }: YouViewProps) {
  const [tab, setTab] = useState<Tab>("pet");
  const [firstName, setFirstName] = useState<string | null>(null);
  const [notifState, setNotifState] = useState(() =>
    Object.fromEntries(data.notifications.map((n) => [n.id, n.enabled])),
  );
  const { pet, owner } = data;

  useEffect(() => {
    setFirstName(getAccountFirstName());
  }, []);

  const displayName = useMemo(() => {
    const trimmed = firstName?.trim();
    if (trimmed) return trimmed;
    return owner.firstName;
  }, [firstName, owner.firstName]);

  const displayEmail = useMemo(() => {
    const local = displayName.toLowerCase().replace(/\s+/g, "");
    return `${local || "member"}@gmail.com`;
  }, [displayName]);

  const petFacts = [
    { label: "Type", value: pet.breedLabel },
    { label: "Sex", value: pet.sexLabel },
    { label: "Age", value: pet.ageLabel },
    { label: "Weight", value: pet.weightLabel },
    { label: pet.vetClinicLabel, value: pet.vetClinicDetail },
  ];

  return (
    <main
      className="relative z-10 mx-auto w-full flex-1 overflow-x-hidden px-5 pb-6"
      style={{
        paddingTop: "max(0.45rem, calc(var(--speak-page-safe-top) + 0.2rem))",
      }}
    >
      <h1 className="page-title mt-1">{data.title}</h1>

      <div
        className="glass-segment-track mt-5 flex rounded-full p-1"
        role="tablist"
        aria-label="Profile sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "pet"}
          onClick={() => setTab("pet")}
          className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
            tab === "pet" ? "glass-light-button" : "text-white/65"
          }`}
        >
          {data.petTabLabel}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "owner"}
          onClick={() => setTab("owner")}
          className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
            tab === "owner" ? "glass-light-button" : "text-white/65"
          }`}
        >
          {data.ownerTabLabel}
        </button>
      </div>

      {tab === "pet" ? (
        <div className="mt-6 flex flex-col gap-4">
          <section className="glass-panel glass-panel--opaque overflow-hidden px-4 py-4">
            <div className="flex items-center gap-3">
              <BaileyAvatar size="md" className="ring-2 ring-white/70" />
              <h2 className="text-[20px] font-semibold tracking-tight text-white">
                {pet.title}
              </h2>
            </div>
            <ul className="mt-4 flex flex-col">
              {petFacts.map((fact, i) => (
                <li
                  key={fact.label}
                  className={`flex items-baseline justify-between gap-3 py-2.5 ${
                    i < petFacts.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                >
                  <span className="text-[13px] text-white/65">{fact.label}</span>
                  <span className="text-right text-[14px] font-medium text-white">
                    {fact.value}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="section-title">{pet.historyHeading}</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {pet.history.map((item) => (
                <li key={item.quarter} className="glass-panel glass-panel--opaque px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-medium text-white">
                        {item.quarter}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-white/65">
                        {item.summary}
                      </p>
                    </div>
                    <StatusBadge status={item.status} onGlass />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-panel glass-panel--opaque px-4 py-3">
            <p className="text-[12px] text-white/65">{pet.nextKitHeading}</p>
            <p className="mt-1 text-[14px] font-medium text-white">
              {pet.nextKitBody}
            </p>
          </section>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <section className="glass-panel glass-panel--opaque px-4 py-4">
            <div className="flex items-center gap-3">
              <PersonAvatar size="md" label={displayName} />
              <div className="min-w-0">
                <h2 className="text-[20px] font-semibold tracking-tight text-white">
                  {displayName}
                </h2>
                <p className="mt-0.5 text-[14px] text-white/65">Owner</p>
              </div>
            </div>
            <dl className="mt-4 flex flex-col gap-3 text-[13px]">
              <div>
                <dt className="text-white/65">Email</dt>
                <dd className="mt-0.5 font-medium text-white">
                  {displayEmail}
                </dd>
              </div>
              <div>
                <dt className="text-white/65">Phone</dt>
                <dd className="mt-0.5 font-medium text-white">
                  {owner.phone}
                </dd>
              </div>
              <div>
                <dt className="text-white/65">{owner.membershipLabel}</dt>
                <dd className="mt-0.5 font-medium text-white">
                  {owner.membershipDetail}
                </dd>
              </div>
            </dl>
          </section>

          <section className="glass-panel glass-panel--opaque overflow-hidden">
            <h3 className="section-title px-4 pt-4">{data.notificationsHeading}</h3>
            <ul className="mt-1">
              {data.notifications.map((pref, i) => (
                <li
                  key={pref.id}
                  className={`flex min-h-[44px] min-w-0 items-center justify-between gap-3 px-4 py-3 ${
                    i < data.notifications.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <p className="text-[15px] text-white">{pref.label}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-white/65">
                      {pref.detail}
                    </p>
                  </div>
                  <AppleSwitch
                    checked={Boolean(notifState[pref.id])}
                    label={pref.label}
                    onChange={() =>
                      setNotifState((prev) => ({
                        ...prev,
                        [pref.id]: !prev[pref.id],
                      }))
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
          <p className="px-1 text-[12px] leading-relaxed text-white/65">
            {data.notificationsFootnote}
          </p>
        </div>
      )}
    </main>
  );
}
