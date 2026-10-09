import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 className="case-h2 display-tight mt-24 mb-8 scroll-mt-28 border-t border-line pt-6 text-4xl first:mt-0 md:text-6xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-12 mb-4 text-xl font-semibold tracking-tight md:text-2xl">{children}</h3>,
  p: ({ children }) => <p className="my-5 text-lg leading-relaxed text-muted-foreground md:text-xl">{children}</p>,
  ul: ({ children }) => <ul className="my-6 space-y-3 text-lg text-muted-foreground md:text-xl">{children}</ul>,
  li: ({ children }) => (
    <li className="relative pl-7 leading-relaxed before:absolute before:top-[0.7em] before:left-0 before:h-px before:w-4 before:bg-foreground">
      {children}
    </li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded-md border border-line bg-card px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">{children}</code>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-foreground underline decoration-line underline-offset-4 transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
