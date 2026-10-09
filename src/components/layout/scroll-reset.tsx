"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { usePathname } from "@/i18n/navigation";

const HEADER_OFFSET = -72;

function hashTarget() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return id ? document.getElementById(id) : null;
}

export function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const previous = useRef(pathname);
  const traversing = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      traversing.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    if (traversing.current) {
      traversing.current = false;
      lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
      return;
    }

    const target = hashTarget();
    if (target) {
      if (lenis) {
        lenis.scrollTo(target, { immediate: true, force: true, offset: HEADER_OFFSET });
      } else {
        target.scrollIntoView();
      }
      return;
    }

    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}
