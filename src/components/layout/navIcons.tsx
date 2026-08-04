type NavIconProps = {
  active?: boolean;
};

const svgProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  shapeRendering: "geometricPrecision" as const,
  "aria-hidden": true,
};

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const strokeActive = {
  ...stroke,
  strokeWidth: 2,
};

/**
 * Nav glyphs — always outline detail; active = brighter white stroke.
 */
export function HomeIcon({ active = false }: NavIconProps) {
  const outline =
    "M12 3.5 3.5 10.5V20.5h6.5v-6h4v6h6.5V10.5L12 3.5Z";

  return (
    <svg {...svgProps} fill="none">
      <path d={outline} {...(active ? strokeActive : stroke)} />
    </svg>
  );
}

export function AskIcon({ active = false }: NavIconProps) {
  const outline =
    "M4.5 3.5h15A3.5 3.5 0 0 1 23 7v6.5a3.5 3.5 0 0 1-3.5 3.5H10.5L5.5 21.5V17H4.5A3.5 3.5 0 0 1 1 13.5V7A3.5 3.5 0 0 1 4.5 3.5Z";

  return (
    <svg {...svgProps} fill="none">
      <path d={outline} {...(active ? strokeActive : stroke)} />
    </svg>
  );
}

export function KitIcon({ active = false }: NavIconProps) {
  const outline =
    "M9.5 3.5h5v4.5l4 10.5a2 2 0 0 1-1.9 2.5H7.4a2 2 0 0 1-1.9-2.5l4-10.5V3.5Z";
  const s = active ? strokeActive : stroke;

  return (
    <svg {...svgProps} fill="none">
      <path d={outline} {...s} />
      <path d="M9.5 3.5h5" {...s} />
    </svg>
  );
}

/** Document / full report — Results tab */
export function ResultsIcon({ active = false }: NavIconProps) {
  const outline =
    "M7 3.5h7l4 4v13.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z";
  const s = active ? strokeActive : stroke;

  return (
    <svg {...svgProps} fill="none">
      <path d={outline} {...s} />
      <path d="M14 3.5v4h4" {...s} />
    </svg>
  );
}

/** Care tab — plus inside a circle */
export function CarePlusIcon({ active = false }: NavIconProps) {
  const s = active ? strokeActive : stroke;

  return (
    <svg {...svgProps} fill="none">
      <circle cx="12" cy="12" r="9" {...s} />
      <path d="M12 8v8M8 12h8" {...s} />
    </svg>
  );
}

export function VetIcon({ active = false }: NavIconProps) {
  return <CarePlusIcon active={active} />;
}

export function YouIcon({ active = false }: NavIconProps) {
  const s = active ? strokeActive : stroke;

  return (
    <svg {...svgProps} fill="none">
      <circle cx="12" cy="7.5" r="3.5" {...s} />
      <path d="M4.5 20.5c0.5-3.8 3.6-6.5 7.5-6.5s7 2.7 7.5 6.5" {...s} />
    </svg>
  );
}

/** Contacts / socials — Speak “S” only (no circle) */
export function ContactsIcon({ active = false }: NavIconProps) {
  return (
    <svg {...svgProps} fill="none">
      <text
        x="12"
        y="13"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontSize={active ? "18" : "17"}
        fontWeight="800"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
      >
        S
      </text>
    </svg>
  );
}

/** Insurance claim — clipboard / form */
export function ClaimIcon({ active = false }: NavIconProps) {
  const board =
    "M8 4.5h8a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z";
  const clip =
    "M9.5 3.5h5a1.5 1.5 0 0 1 0 3h-5a1.5 1.5 0 0 1 0-3Z";
  const s = active ? strokeActive : stroke;

  return (
    <svg {...svgProps} fill="none">
      <path d={board} {...s} />
      <path d={clip} {...s} />
      <path d="M8.5 11.5h7M8.5 14.5h7M8.5 17.5h5" {...s} />
    </svg>
  );
}
