import { NextRequest, NextResponse } from "next/server";
import { getUserCookies } from "./actions/auth.actions";
const apiAuthPrefix = "/api";
const DEFAULT_LOGIN_REDIRECT = "/";
const AUTH_ROUTES = ["/login"];
const RESTRICTED_ROUTES = ["/"];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const baseUrl = req.nextUrl.origin;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname);
  const isRestrictedRoute = RESTRICTED_ROUTES.includes(nextUrl.pathname);
  const isLoggedIn = await getUserCookies();

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, baseUrl));
    }
    return;
  }

  if (isRestrictedRoute && !isLoggedIn)
    return NextResponse.redirect(new URL("/login", baseUrl));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
