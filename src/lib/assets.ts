import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";

export function assetExists(publicPath: string) {
  return existsSync(join(process.cwd(), "public", publicPath.replace(/^\//, "")));
}

export const portraitPath = "/images/me/portrait.webp";
