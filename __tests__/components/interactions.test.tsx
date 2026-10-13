import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { CopyEmail } from "@/components/home/copy-email";
import { FaqList } from "@/components/home/faq-list";
import { Magnetic } from "@/components/motion/magnetic";
import { WordReveal } from "@/components/motion/word-reveal";
import { resetMediaQueries } from "../../test-utils/match-media";
import { messagesEn, renderWithIntl } from "../../test-utils/render";

jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

afterEach(() => {
  resetMediaQueries();
  jest.clearAllMocks();
});

describe("CopyEmail", () => {
  it("copies the address and confirms it", async () => {
    const user = userEvent.setup();
    const writeText = jest.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    renderWithIntl(<CopyEmail email="hi@example.com" />);

    await user.click(screen.getByRole("button", { name: "Copy e-mail" }));

    expect(writeText).toHaveBeenCalledWith("hi@example.com");
    expect(toast.success).toHaveBeenCalledWith("E-mail copied to the clipboard");
  });

  it("shows the address when the clipboard is blocked", async () => {
    const user = userEvent.setup();
    jest.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    renderWithIntl(<CopyEmail email="hi@example.com" />);

    await user.click(screen.getByRole("button", { name: "Copy e-mail" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Couldn't copy — the address is hi@example.com"));
  });
});

describe("FaqList", () => {
  const items = messagesEn.Faq.items;

  it("opens the first answer so the section never looks empty", () => {
    renderWithIntl(<FaqList items={items} />);
    expect(screen.getByText(items[0].a)).toBeVisible();
    expect(screen.queryByText(items[1].a)).not.toBeInTheDocument();
  });

  it("opens one answer at a time", async () => {
    const user = userEvent.setup();
    renderWithIntl(<FaqList items={items} />);

    await user.click(screen.getByRole("button", { name: new RegExp(items[2].q) }));

    expect(screen.getByText(items[2].a)).toBeVisible();
    expect(screen.queryByText(items[0].a)).not.toBeInTheDocument();
  });
});

describe("Magnetic", () => {
  it("keeps still without a fine pointer", async () => {
    renderWithIntl(
      <Magnetic>
        <button type="button">pull</button>
      </Magnetic>,
    );
    const wrapper = screen.getByTestId("magnetic");
    wrapper.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 400, clientY: 400 }));
    expect(wrapper.style.transform === "" || wrapper.style.transform === "none").toBe(true);
  });
});

describe("WordReveal", () => {
  it("keeps the whole sentence readable", () => {
    renderWithIntl(<WordReveal text="Tests keep them honest." />);
    expect(screen.getByText((_, element) => element?.tagName === "P" && element.textContent === "Tests keep them honest.")).toBeInTheDocument();
  });
});
