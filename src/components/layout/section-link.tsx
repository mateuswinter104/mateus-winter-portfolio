"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type SectionLinkProps = Omit<ComponentProps<"a">, "href"> & {
  section: string;
};

export function SectionLink({ section, children, ...props }: SectionLinkProps) {
  const pathname = usePathname();

  if (pathname === "/") {
    return (
      <a href={`#${section}`} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={`/#${section}`} {...props}>
      {children}
    </Link>
  );
}
