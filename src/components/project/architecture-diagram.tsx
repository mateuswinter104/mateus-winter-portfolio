"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function Node({ title, subtitle, emphasis }: { title: string; subtitle: string; emphasis?: boolean }) {
  return (
    <div
      className={cn(
        "flex min-h-28 flex-1 flex-col justify-between gap-4 rounded-2xl border p-5",
        emphasis ? "border-foreground bg-foreground text-background" : "border-line bg-card",
      )}
    >
      <span className={cn("label", emphasis ? "text-background/70" : "")}>{subtitle}</span>
      <span className="display-tight text-2xl md:text-3xl">{title}</span>
    </div>
  );
}

function Connector({ request, response, delay, inView }: { request: string; response: string; delay: number; inView: boolean }) {
  return (
    <div className="flex shrink-0 flex-col justify-center gap-3 py-3 md:w-44 md:py-0 lg:w-52">
      <div className="space-y-1.5">
        <span className="label block text-foreground">{request} →</span>
        <div className="h-px w-full overflow-hidden bg-line">
          <motion.div
            className="h-px origin-left bg-foreground"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-px w-full overflow-hidden bg-line">
          <motion.div
            className="h-px origin-right bg-foreground"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 0.9, ease: EASE, delay: delay + 0.5 }}
          />
        </div>
        <span className="label block text-right">← {response}</span>
      </div>
    </div>
  );
}

export function ArchitectureDiagram() {
  const t = useTranslations("Project.diagram");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <figure ref={ref} className="not-prose my-12 space-y-4" data-testid="architecture-diagram">
      <figcaption className="label">{t("title")}</figcaption>
      <div className="flex flex-col items-stretch md:flex-row md:items-center">
        <Node title={t("browser")} subtitle={t("client")} />
        <Connector request="POST /api/auth" response={t("cookie")} delay={0.1} inView={inView} />
        <Node title={t("next")} subtitle={t("routes")} emphasis />
        <Connector request="Bearer" response={t("token")} delay={0.7} inView={inView} />
        <Node title={t("laravel")} subtitle="Sanctum" />
      </div>
      <p className="label text-foreground">✦ {t("noToken")}</p>
    </figure>
  );
}
