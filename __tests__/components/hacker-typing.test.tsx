import { act, render, screen } from "@testing-library/react";
import { useReducedMotion } from "motion/react";
import { GLYPHS, HackerTyping } from "@/components/motion/hacker-typing";

jest.mock("motion/react", () => ({
  ...jest.requireActual("motion/react"),
  useReducedMotion: jest.fn(() => false),
}));

const words = ["Next.js", "Laravel"] as const;

function renderTyping() {
  return render(<HackerTyping words={words} prefix="building with" srText="Stack: Next.js and Laravel." />);
}

describe("HackerTyping", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(useReducedMotion).mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with the first word fully typed, so the server HTML already makes sense", () => {
    renderTyping();
    expect(screen.getByTestId("hacker-typing-word")).toHaveTextContent("Next.js");
  });

  it("gives screen readers the whole stack instead of the animation", () => {
    renderTyping();
    expect(screen.getByText("Stack: Next.js and Laravel.")).toHaveClass("sr-only");
    expect(screen.getByTestId("hacker-typing")).toHaveAttribute("aria-hidden", "true");
  });

  it("scrambles through glyphs and settles on the next word", async () => {
    renderTyping();
    const word = () => screen.getByTestId("hacker-typing-word").textContent ?? "";

    let elapsed = 0;
    while (word() === "Next.js" && elapsed < 5000) {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(50);
      });
      elapsed += 50;
    }

    expect(elapsed).toBeGreaterThanOrEqual(1600);
    expect(Array.from(word()).every((char) => `${words.join("")}${GLYPHS}`.includes(char))).toBe(true);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(1500);
    });
    expect(word()).toBe("Laravel");
  });

  it("keeps still and offers the static list when the user prefers reduced motion", async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    renderTyping();
    expect(screen.getByTestId("hacker-typing-static")).toHaveTextContent("Next.js · Laravel");

    await act(async () => {
      await jest.advanceTimersByTimeAsync(5000);
    });
    expect(screen.getByTestId("hacker-typing-word")).toHaveTextContent("Next.js");
  });
});
