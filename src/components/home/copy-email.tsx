"use client";

import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CopyEmailProps = {
  email: string;
  className?: string;
};

export function CopyEmail({ email, className }: CopyEmailProps) {
  const t = useTranslations("Contact");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success(t("copied"));
    } catch {
      toast.error(t("copyFailed", { email }));
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor={t("copy")}
      className={cn(
        "inline-flex size-12 shrink-0 items-center justify-center rounded-full border border-line transition-colors hover:bg-foreground hover:text-background",
        className,
      )}
      aria-label={t("copy")}
    >
      <Copy className="size-4" aria-hidden />
    </button>
  );
}
