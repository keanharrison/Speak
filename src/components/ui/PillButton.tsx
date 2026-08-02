import Link from "next/link";

type PillButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit";
  className?: string;
  onClick?: () => void;
};

export function PillButton({
  children,
  href,
  type = "button",
  className = "",
  onClick,
}: PillButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
