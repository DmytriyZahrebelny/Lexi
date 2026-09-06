import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "lexi_session";
const PROTECTED_PATHS = ["/"];
const AUTH_ONLY_PATHS = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  if (!hasSession && PROTECTED_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && AUTH_ONLY_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register"],
};
