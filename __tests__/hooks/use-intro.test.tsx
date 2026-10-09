import { act, renderHook, waitFor } from "@testing-library/react";
import { INTRO_DONE_EVENT, useIntroDone } from "@/hooks/use-intro";

describe("useIntroDone", () => {
  afterEach(() => {
    delete document.documentElement.dataset.intro;
  });

  it("is ready right away when there is no intro", async () => {
    const { result } = renderHook(() => useIntroDone());
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("waits for the intro to finish before letting the hero animate", async () => {
    document.documentElement.dataset.intro = "play";
    const { result } = renderHook(() => useIntroDone());
    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    });

    await waitFor(() => expect(result.current).toBe(true));
  });
});
