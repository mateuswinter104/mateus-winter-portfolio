import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  label: string;
  className?: string;
  duration?: number;
};

function Row({ items, hidden }: { items: string[]; hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-6 pr-6 md:gap-10 md:pr-10">
          <span className="display-tight text-4xl whitespace-nowrap md:text-7xl">{item}</span>
          <span aria-hidden className="size-2.5 rounded-full bg-foreground md:size-3.5" />
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ items, label, className, duration = 38 }: MarqueeProps) {
  return (
    <section aria-label={label} className={cn("group overflow-hidden border-y border-line py-5 md:py-7", className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <Row items={items} />
        <Row items={items} hidden />
      </div>
    </section>
  );
}
