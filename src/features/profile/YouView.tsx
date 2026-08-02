"use client";

import { useState } from "react";
import { PersonAvatar } from "@/components/ui/PersonAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { YouPageContent } from "@/types";

type YouViewProps = {
  data: YouPageContent;
};

type Tab = "pet" | "owner";

/** iOS Settings-style switch */
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
      className="relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200 ease-out"
      style={{
        backgroundColor: checked ? "#34C759" : "#E9E9EB",
      }}
    >
      <span
        className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white transition-transform duration-200 ease-out"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(2px)",
          boxShadow:
            "0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.16)",
        }}
      />
    </button>
  );
}

/**
 * You tab — Pet | Owner. Vet prep lives on the Vet tab.
 */
export function YouView({ data }: YouViewProps) {
  const [tab, setTab] = useState<Tab>("pet");
  const [notifState, setNotifState] = useState(() =>
    Object.fromEntries(data.notifications.map((n) => [n.id, n.enabled])),
  );
  const { pet, owner } = data;

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
        paddingTop: "max(2.25rem, calc(env(safe-area-inset-top) + 0.65rem))",
      }}
    >
      <div className="min-h-[44px]" aria-hidden />
      <h1 className="page-title mt-2">{data.title}</h1>

      <div
        className="glass-panel mt-5 flex rounded-full p-1"
        role="tablist"
        aria-label="Profile sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "pet"}
          onClick={() => setTab("pet")}
          className={`flex min-h-[44px] flex-1 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
            tab === "pet" ? "glass-light-button" : "text-[#6b6b6b]"
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
            tab === "owner" ? "glass-light-button" : "text-[#6b6b6b]"
          }`}
        >
          {data.ownerTabLabel}
        </button>
      </div>

      {tab === "pet" ? (
        <div className="mt-6 flex flex-col gap-4">
          <section className="glass-panel overflow-hidden px-4 py-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/reference/labrador-smile.png"
                alt=""
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
              <h2 className="text-[20px] font-semibold tracking-tight text-[#0A0A0A]">
                {pet.title}
              </h2>
            </div>
            <ul className="mt-4 flex flex-col">
              {petFacts.map((fact, i) => (
                <li
                  key={fact.label}
                  className={`flex items-baseline justify-between gap-3 py-2.5 ${
                    i < petFacts.length - 1
                      ? "border-b border-black/[0.06]"
                      : ""
                  }`}
                >
                  <span className="text-[13px] text-[#6b6b6b]">{fact.label}</span>
                  <span className="text-right text-[14px] font-medium text-[#0A0A0A]">
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
                <li key={item.quarter} className="glass-panel px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-medium text-[#0A0A0A]">
                        {item.quarter}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-[#6b6b6b]">
                        {item.summary}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid grid-cols-1 gap-2.5">
            <div className="glass-panel px-4 py-3">
              <p className="text-[12px] text-[#6b6b6b]">{pet.nextKitHeading}</p>
              <p className="mt-1 text-[14px] font-medium text-[#0A0A0A]">
                {pet.nextKitBody}
              </p>
            </div>
            <div className="glass-panel px-4 py-3">
              <p className="text-[12px] text-[#6b6b6b]">
                {pet.membershipHeading}
              </p>
              <p className="mt-1 text-[14px] font-medium text-[#0A0A0A]">
                {pet.membershipBody}
              </p>
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          <section className="glass-panel px-4 py-4">
            <div className="flex items-center gap-3">
              <PersonAvatar size="md" label="Owner" />
              <div className="min-w-0">
                <h2 className="text-[20px] font-semibold tracking-tight text-[#0A0A0A]">
                  {owner.firstName} {owner.lastName}
                </h2>
                <p className="mt-0.5 text-[14px] text-[#6b6b6b]">Owner</p>
              </div>
            </div>
            <dl className="mt-4 flex flex-col gap-3 text-[13px]">
              <div>
                <dt className="text-[#6b6b6b]">Email</dt>
                <dd className="mt-0.5 font-medium text-[#0A0A0A]">
                  {owner.email}
                </dd>
              </div>
              <div>
                <dt className="text-[#6b6b6b]">Phone</dt>
                <dd className="mt-0.5 font-medium text-[#0A0A0A]">
                  {owner.phone}
                </dd>
              </div>
              <div>
                <dt className="text-[#6b6b6b]">{owner.membershipLabel}</dt>
                <dd className="mt-0.5 font-medium text-[#0A0A0A]">
                  {owner.membershipDetail}
                </dd>
              </div>
            </dl>
          </section>

          <section className="overflow-hidden rounded-[14px] bg-white">
            <h3 className="section-title px-4 pt-4">{data.notificationsHeading}</h3>
            <ul className="mt-1">
              {data.notifications.map((pref, i) => (
                <li
                  key={pref.id}
                  className={`flex min-h-[44px] min-w-0 items-center justify-between gap-3 px-4 py-3 ${
                    i < data.notifications.length - 1
                      ? "border-b border-black/[0.08]"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <p className="text-[15px] text-[#0A0A0A]">{pref.label}</p>
                    <p className="mt-0.5 text-[12px] leading-snug text-[#6b6b6b]">
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
            <p className="px-4 py-3 text-[11px] leading-relaxed text-[#6b6b6b]">
              {data.notificationsFootnote}
            </p>
          </section>
        </div>
      )}
    </main>
  );
}
