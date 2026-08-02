type BaileyAvatarProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-9 w-9",
  md: "h-14 w-14",
  lg: "h-16 w-16",
} as const;

/** Bailey’s photo — use anywhere Bailey is referenced visually. */
export function BaileyAvatar({ size = "md", className = "" }: BaileyAvatarProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/reference/labrador-smile.png"
      alt="Bailey"
      className={`${sizeClass[size]} shrink-0 rounded-full object-cover ${className}`}
    />
  );
}
