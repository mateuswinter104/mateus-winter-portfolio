import { render, screen } from "@testing-library/react";
import { VariableWordmark } from "@/components/motion/variable-wordmark";

describe("VariableWordmark", () => {
  it("exposes the full name as a heading for assistive technology", () => {
    render(<VariableWordmark words={["Mateus", "Winter"]} label="Mateus Winter — Full-stack Developer" />);
    expect(screen.getByRole("heading", { level: 1, name: "Mateus Winter — Full-stack Developer" })).toBeInTheDocument();
  });

  it("hides the per-letter spans from assistive technology", () => {
    render(<VariableWordmark words={["Mateus", "Winter"]} label="Mateus Winter" />);
    const visual = screen.getByTestId("variable-wordmark");
    expect(visual).toHaveAttribute("aria-hidden", "true");
    expect(visual.textContent).toBe("MateusWinter");
  });

  it("starts every letter at the resting weight and width", () => {
    render(<VariableWordmark words={["Ab"]} label="Ab" />);
    const slots = Array.from(screen.getByTestId("variable-wordmark").querySelectorAll<HTMLElement>("span[style*='font-variation-settings']"));
    expect(slots).toHaveLength(2);
    for (const slot of slots) {
      expect(slot.style.fontVariationSettings).toContain('"wght" 760.0');
      expect(slot.style.fontVariationSettings).toContain('"wdth" 68.0');
    }
  });
});
