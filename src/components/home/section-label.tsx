import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index: string;
  label: string;
  aside?: string;
  className?: string;
};

export function SectionLabel({ index, label, aside = "©2026", className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="label flex items-center gap-2 text-foreground">
        <span aria-hidden className="h-3 w-px bg-foreground" />
        <span className="text-muted-foreground">{index}</span>
        {label}
      </span>
      <span aria-hidden className="rule-dotted h-px flex-1" />
      <span className="label">{aside}</span>
    </div>
  );
}
