import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { projects } from "./content/projects";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);
const PROJECT_PATH = /^\/(en|pt)\/projects\/([^/]+)\/?$/;

export default function proxy(request: NextRequest) {
  const match = PROJECT_PATH.exec(request.nextUrl.pathname);

  if (match && !projects.some((project) => project.slug === match[2])) {
    return NextResponse.rewrite(new URL(`/${match[1]}/not-found`, request.url));
  }

  return intl(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
