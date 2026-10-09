import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  coverageProvider: "v8",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/e2e/", "<rootDir>/.next/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/app/**", "!src/components/ui/**"],
};

const ESM_PACKAGES = ["next-intl", "use-intl", "intl-messageformat", "@formatjs", "icu-minify", "lenis"];

export default async function jestConfig() {
  const resolved = await createJestConfig(config)();
  return {
    ...resolved,
    transformIgnorePatterns: [`/node_modules/(?!(${ESM_PACKAGES.join("|")})/)`, "^.+\\.module\\.(css|sass|scss)$"],
  };
}
