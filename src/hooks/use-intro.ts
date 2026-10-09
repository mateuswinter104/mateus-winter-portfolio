"use client";

import { useEffect, useState } from "react";

export const INTRO_STORAGE_KEY = "mw-intro-seen";
export const INTRO_DONE_EVENT = "mw:intro-done";

export const introScript = `(function(){try{var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r&&!sessionStorage.getItem('${INTRO_STORAGE_KEY}')){d.dataset.intro='play';}}catch(e){}})();`;

export function isIntroPlaying() {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "play";
}

export function useIntroDone() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isIntroPlaying()) {
      const frame = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(frame);
    }

    const onDone = () => setDone(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, onDone);
  }, []);

  return done;
}
