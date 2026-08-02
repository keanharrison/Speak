import type { ReactNode } from "react";

type SurfaceCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "section" | "div" | "aside";
};

export function SurfaceCard({
  children,
  className = "",
  as: Tag = "div",
}: SurfaceCardProps) {
  return <Tag className={`glass-panel ${className}`}>{children}</Tag>;
}
