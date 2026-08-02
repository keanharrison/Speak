import type { ReactNode } from "react";
import { brand } from "@/constants/brand";

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
  return (
    <Tag
      className={`rounded-card bg-surface ${className}`}
      style={{ border: brand.cardBorder }}
    >
      {children}
    </Tag>
  );
}
