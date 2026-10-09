import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PillVariant = "solid" | "outline";

const base =
  "text-roll-trigger inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-300 select-none";

const variants: Record<PillVariant, string> = {
  solid: "bg-foreground text-background hover:bg-foreground/85",
  outline: "border border-line text-foreground hover:bg-foreground hover:text-background",
};

export function pillClassName(variant: PillVariant = "solid", className?: string) {
  return cn(base, variants[variant], className);
}

export function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="text-roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}

type PillAnchorProps = ComponentProps<"a"> & {
  variant?: PillVariant;
  icon?: ReactNode;
};

export function PillAnchor({ variant = "solid", icon, className, children, ...props }: PillAnchorProps) {
  return (
    <a className={pillClassName(variant, className)} {...props}>
      <RollText>{children}</RollText>
      {icon}
    </a>
  );
}
