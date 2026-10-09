import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ skipIntro: void }>({
  skipIntro: [
    async ({ context }, use) => {
      await context.addInitScript(() => {
        try {
          sessionStorage.setItem("mw-intro-seen", "1");
        } catch {}
      });
      await use();
    },
    { auto: true },
  ],
});

export { expect };
