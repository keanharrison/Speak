type PersonAvatarProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizeClass = {
  sm: "h-11 w-11",
  md: "h-14 w-14",
  lg: "h-16 w-16",
} as const;

/**
 * Neutral owner avatar — same grey silhouette on Home, Speak, and Profile.
 */
export function PersonAvatar({
  size = "sm",
  className = "",
  label = "Profile",
}: PersonAvatarProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E5E5EA] ${sizeClass[size]} ${className}`}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox="0 0 40 40"
        className="h-[70%] w-[70%] text-[#AEAEB2]"
        aria-hidden
      >
        <circle cx="20" cy="14" r="7" fill="currentColor" />
        <path
          fill="currentColor"
          d="M8 34.5c1.2-7.2 6.2-11 12-11s10.8 3.8 12 11"
        />
      </svg>
    </span>
  );
}
