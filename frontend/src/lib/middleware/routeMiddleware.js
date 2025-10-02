import { NextResponse } from "next/server";

const RESTRICTED_PREFIXES = ["/chat", "/specbot", "/meetings", "/feedback"];

export function routeMiddleware(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // check if the path is restricted
  const isRestricted = RESTRICTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isRestricted) {
    const hasProject = request.cookies.get("selectedProject");

    if (!hasProject) {
      // no project selected → force redirect to /projects
      return NextResponse.redirect(new URL("/projects", request.url));
    }
  }

  // every other route is allowed
  return NextResponse.next();
}
