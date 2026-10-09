import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

export async function loadDisplayFont() {
  return readFile(join(process.cwd(), "node_modules/@fontsource/archivo-narrow/files/archivo-narrow-latin-700-normal.woff"));
}

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
};

export function OgCard({ eyebrow, title, subtitle, footer }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px",
        background: "#0a0a0a",
        color: "#f5f5f4",
        fontFamily: "Archivo Narrow",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#8f8f8c" }}>
        <span>{eyebrow.toUpperCase()}</span>
        <span>©2026</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span style={{ fontSize: 168, lineHeight: 0.86, letterSpacing: -2, textTransform: "uppercase" }}>{title}</span>
        <span style={{ fontSize: 34, color: "#c9c9c6" }}>{subtitle}</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.16)",
          paddingTop: 24,
          fontSize: 22,
          letterSpacing: 3,
          color: "#8f8f8c",
        }}
      >
        <span>{footer.toUpperCase()}</span>
        <span>MATEUS WINTER</span>
      </div>
    </div>
  );
}
