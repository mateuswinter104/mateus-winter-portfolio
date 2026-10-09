"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export function LocalClock({ timeZone }: { timeZone: string }) {
  const locale = useLocale();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [locale, timeZone]);

  return (
    <time data-testid="local-clock" className="font-mono text-sm tabular-nums" suppressHydrationWarning>
      {time ?? "--:--:--"}
      <span className="ml-2 text-muted-foreground">UTC−3</span>
    </time>
  );
}
