import { screen } from "@testing-library/react";
import { Preloader } from "@/components/motion/preloader";
import { INTRO_DONE_EVENT, INTRO_STORAGE_KEY, introScript } from "@/hooks/use-intro";
import { FINE_POINTER_QUERY } from "@/hooks/use-media-query";
import { resetMediaQueries, setMediaQuery } from "../../test-utils/match-media";
import { renderWithIntl } from "../../test-utils/render";

function runIntroScript() {
  new Function(introScript)();
}

describe("Preloader", () => {
  beforeEach(() => {
    sessionStorage.clear();
    delete document.documentElement.dataset.intro;
  });

  afterEach(() => resetMediaQueries());

  it("plays on the first visit of the session", () => {
    runIntroScript();
    expect(document.documentElement.dataset.intro).toBe("play");
  });

  it("is skipped once the visitor has seen it in this session", () => {
    sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    runIntroScript();
    expect(document.documentElement.dataset.intro).toBeUndefined();
  });

  it("is skipped when the visitor prefers reduced motion", () => {
    setMediaQuery("(prefers-reduced-motion: reduce)", true);
    runIntroScript();
    expect(document.documentElement.dataset.intro).toBeUndefined();
  });

  it("does nothing when the intro is not playing", () => {
    setMediaQuery(FINE_POINTER_QUERY, true);
    renderWithIntl(<Preloader />);
    expect(screen.getByTestId("preloader")).toHaveAttribute("aria-hidden", "true");
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBeNull();
  });

  it("never leaves the page locked if it unmounts mid-animation", () => {
    document.documentElement.dataset.intro = "play";
    const onDone = jest.fn();
    window.addEventListener(INTRO_DONE_EVENT, onDone);

    const { unmount } = renderWithIntl(<Preloader />);
    unmount();

    expect(document.documentElement.dataset.intro).toBeUndefined();
    expect(sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe("1");
    expect(onDone).toHaveBeenCalled();
    window.removeEventListener(INTRO_DONE_EVENT, onDone);
  });
});
