import { act, fireEvent, render, screen } from "@testing-library/react";
import { Cursor } from "@/components/motion/cursor";
import { FINE_POINTER_QUERY } from "@/hooks/use-media-query";
import { resetMediaQueries, setMediaQuery } from "../../test-utils/match-media";

function pointer(type: string, target: EventTarget, init: Record<string, unknown> = {}) {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, { pointerType: "mouse", clientX: 10, clientY: 10, ...init });
  act(() => {
    target.dispatchEvent(event);
  });
}

describe("Cursor", () => {
  afterEach(() => {
    resetMediaQueries();
    document.documentElement.classList.remove("has-custom-cursor");
  });

  it("stays out of the way on touch screens", () => {
    setMediaQuery(FINE_POINTER_QUERY, false);
    render(<Cursor />);
    expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("has-custom-cursor");
  });

  it("replaces the system cursor when there is a mouse", () => {
    setMediaQuery(FINE_POINTER_QUERY, true);
    const { unmount } = render(<Cursor />);
    expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("has-custom-cursor");
    unmount();
    expect(document.documentElement).not.toHaveClass("has-custom-cursor");
  });

  it("shows the label of the element under the pointer and grows over links", () => {
    setMediaQuery(FINE_POINTER_QUERY, true);
    render(
      <>
        <Cursor />
        <a href="#case" data-cursor="View case">
          card
        </a>
        <a href="#plain">plain link</a>
      </>,
    );

    pointer("pointermove", window);
    pointer("pointerover", screen.getByText("card"));
    expect(screen.getByTestId("custom-cursor-label")).toHaveTextContent("View case");
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute("data-mode", "label");

    pointer("pointerover", screen.getByText("plain link"));
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute("data-mode", "interactive");
  });

  it("hides over text fields so the caret stays visible", () => {
    setMediaQuery(FINE_POINTER_QUERY, true);
    render(
      <>
        <Cursor />
        <input aria-label="field" />
      </>,
    );
    pointer("pointermove", window);
    fireEvent.pointerOver(screen.getByLabelText("field"));
    pointer("pointerover", screen.getByLabelText("field"));
    expect(screen.getByTestId("custom-cursor")).toHaveAttribute("data-mode", "hidden");
  });
});
