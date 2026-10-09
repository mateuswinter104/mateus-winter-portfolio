import { screen } from "@testing-library/react";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { renderWithIntl } from "../../test-utils/render";

jest.mock("next/navigation", () => ({
  usePathname: () => "/en/projects/grao-co",
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  useParams: () => ({ locale: "en" }),
}));

describe("LocaleSwitcher", () => {
  it("marks the current language", () => {
    renderWithIntl(<LocaleSwitcher />);
    expect(screen.getByText("en")).toHaveAttribute("aria-current", "true");
  });

  it("keeps the visitor on the same page when switching language", () => {
    renderWithIntl(<LocaleSwitcher />);
    const link = screen.getByRole("link", { name: "Switch to Português" });
    expect(link).toHaveAttribute("href", "/pt/projects/grao-co");
    expect(link).toHaveAttribute("lang", "pt-BR");
  });

  it("speaks the visitor's language in its labels", () => {
    renderWithIntl(<LocaleSwitcher />, { locale: "pt" });
    expect(screen.getByRole("navigation", { name: "Idioma" })).toBeInTheDocument();
  });
});
